'use strict';
import * as geminiService from '../../services/geminiService.js';

/**
 * STAGE 4 — AI Analysis
 *
 * Responsibility: Send the normalized customer message to Gemini 2.5 Flash
 * and store the raw AI response on the context for Stage 5 to validate.
 *
 * This is the only stage that makes an external network call.
 * All retry and timeout logic lives inside geminiService.
 *
 * Context reads:  context.normalizedMessage, context.metadata
 * Context writes: context.rawAiResponse {string}  - raw JSON string from Gemini
 */
export async function aiAnalysis(context) {
  const rawResponse = await geminiService.callGemini(
    context.normalizedMessage,
    context.metadata
  );

  context.rawAiResponse = rawResponse;
}
