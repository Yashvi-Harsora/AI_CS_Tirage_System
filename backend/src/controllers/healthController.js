'use strict';
import { geminiModel } from '../config/gemini.js';
import config from '../config/index.js';

export async function getHealth(req, res) {
  let geminiConnected = false;

  let timeoutId;
  try {
    // Lightweight connectivity check with a 3-second timeout
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Gemini ping timed out')), 3000);
    });

    const apiCall = geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
      generationConfig: { maxOutputTokens: 1 },
    });

    await Promise.race([apiCall, timeoutPromise]);
    geminiConnected = true;
  } catch {
    geminiConnected = false;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  res.status(200).json({
    status: 'healthy',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    gemini: {
      model: config.gemini.model,
      connected: geminiConnected,
    },
  });
}
