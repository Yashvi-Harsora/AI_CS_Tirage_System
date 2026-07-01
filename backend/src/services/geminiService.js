'use strict';
import { geminiModel } from '../config/gemini.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';
import {
  buildSystemPrompt,
  buildUserPrompt,
  RESPONSE_SCHEMA,
} from '../prompts/triagePrompt.js';

/**
 * Pure Gemini I/O function — called exclusively by Stage 4 (aiAnalysis).
 *
 * Responsibilities:
 *  - Build prompt from template
 *  - Call Gemini 2.5 Flash with JSON mode + responseSchema
 *  - Handle timeout and retries
 *  - Return the raw JSON string (NOT parsed — Stage 5 owns parsing)
 *
 * @param {string} normalizedMessage - Cleaned message from Stage 3
 * @param {object} metadata          - Channel, language, customerId
 * @returns {string} Raw JSON string from Gemini
 */
export async function callGemini(normalizedMessage, metadata = {}) {
  logger.info('[GeminiService] Building prompt', { channel: metadata.channel });

  const systemPrompt   = buildSystemPrompt(metadata);
  const userPrompt     = buildUserPrompt(normalizedMessage);

  const generationConfig = {
    temperature:      0.2,
    topP:             0.8,
    responseMimeType: 'application/json',
    responseSchema:   RESPONSE_SCHEMA,
  };

  // One automatic retry on transient Gemini failures
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Gemini request timed out')),
          config.gemini.timeoutMs
        )
      );

      const apiCall = geminiModel.generateContent({
        systemInstruction: systemPrompt,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig,
      });

      const result  = await Promise.race([apiCall, timeoutPromise]);
      const rawText = result.response.text();

      logger.info('[GeminiService] Response received', {
        attempt,
        chars: rawText?.length,
      });

      return rawText; // raw JSON string — Stage 5 will parse + validate

    } catch (err) {
      logger.warn(`[GeminiService] Attempt ${attempt} failed`, { error: err.message });

      if (attempt === 2) {
        if (err.message?.includes('timed out')) {
          throw new AppError(502, 'AI_UNREACHABLE', 'The AI service timed out. Please try again.');
        }
        if (err.status === 429 || err.message?.toLowerCase().includes('quota')) {
          throw new AppError(503, 'AI_QUOTA_EXCEEDED', 'AI service quota exceeded. Please try again later.');
        }
        throw new AppError(502, 'AI_UNREACHABLE', 'The AI service is temporarily unavailable.');
      }

      // Brief pause before retry
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}
