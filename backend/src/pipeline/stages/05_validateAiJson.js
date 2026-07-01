'use strict';
import AppError from '../../utils/AppError.js';
import logger from '../../utils/logger.js';

const REQUIRED_FIELDS = [
  'category', 'priority', 'priorityScore',
  'sentiment', 'sentimentScore', 'summary',
  'suggestedActions', 'confidence',
];

/**
 * STAGE 5 — Validate AI JSON
 *
 * Responsibility: Parse the raw JSON string from Stage 4 and validate it
 * against the expected schema. Even though Gemini's JSON mode is highly
 * reliable, this stage acts as a safety net and normalises optional fields.
 *
 * If the JSON is invalid or missing required fields, the pipeline aborts
 * with a 502 AI_INVALID_RESPONSE error before any partial data reaches
 * the client or business rules engine.
 *
 * Context reads:  context.rawAiResponse {string}
 * Context writes: context.analysis      {object} - validated, normalised object
 */
export async function validateAiJson(context) {
  let parsed;

  try {
    parsed = JSON.parse(context.rawAiResponse);
  } catch {
    logger.error('Stage 5: Gemini returned non-JSON', {
      preview: context.rawAiResponse?.slice(0, 200),
    });
    throw new AppError(502, 'AI_INVALID_RESPONSE',
      'The AI service returned an invalid response format. Please try again.'
    );
  }

  const missing = REQUIRED_FIELDS.filter(
    (k) => parsed[k] === undefined || parsed[k] === null
  );

  if (missing.length > 0) {
    logger.error('Stage 5: Gemini JSON missing required fields', { missing });
    throw new AppError(502, 'AI_INVALID_RESPONSE',
      `AI response was incomplete. Missing fields: ${missing.join(', ')}.`
    );
  }

  // Normalise and apply safe defaults for optional fields
  context.analysis = {
    category:               parsed.category,
    subCategory:            parsed.subCategory            || '',
    priority:               parsed.priority,
    priorityScore:          Math.min(100, Math.max(0, Number(parsed.priorityScore))),
    sentiment:              parsed.sentiment,
    sentimentScore:         Math.min(1, Math.max(-1, Number(parsed.sentimentScore))),
    urgencyIndicators:      Array.isArray(parsed.urgencyIndicators) ? parsed.urgencyIndicators : [],
    suggestedDepartment:    parsed.suggestedDepartment    || 'General Support',
    estimatedResolutionTime: parsed.estimatedResolutionTime || 'To be determined',
    keyEntities: {
      products:  parsed.keyEntities?.products  || [],
      orderIds:  parsed.keyEntities?.orderIds  || [],
      amounts:   parsed.keyEntities?.amounts   || [],
      dates:     parsed.keyEntities?.dates     || [],
    },
    summary:          parsed.summary,
    suggestedActions: Array.isArray(parsed.suggestedActions) ? parsed.suggestedActions : [],
    tags:             Array.isArray(parsed.tags) ? parsed.tags : [],
    confidence:       Math.min(1, Math.max(0, Number(parsed.confidence))),
    escalate:         false, // set by Stage 6
    slaTarget:        null,  // set by Stage 6
  };
}
