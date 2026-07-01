'use strict';
import { runPipeline } from '../pipeline/pipeline.js';
import { receiveInput }     from '../pipeline/stages/01_receiveInput.js';
import { validateInput }    from '../pipeline/stages/02_validateInput.js';
import { normalizeText }    from '../pipeline/stages/03_normalizeText.js';
import { aiAnalysis }       from '../pipeline/stages/04_aiAnalysis.js';
import { validateAiJson }   from '../pipeline/stages/05_validateAiJson.js';
import { applyBusinessRules } from '../pipeline/stages/06_businessRules.js';
import { formatResponse }   from '../pipeline/stages/07_formatResponse.js';

// Ordered pipeline — the sequence is the architecture
const TRIAGE_PIPELINE = [
  receiveInput,
  validateInput,
  normalizeText,
  aiAnalysis,
  validateAiJson,
  applyBusinessRules,
  formatResponse,
];

/**
 * POST /api/triage
 * Runs the full 7-stage Pipe & Filter triage pipeline and returns the result.
 */
export async function triageMessage(req, res, next) {
  try {
    // Seed the initial context with data from the HTTP request
    const context = {
      rawMessage: req.body.message,
      metadata:   req.body.metadata || {},
    };

    await runPipeline(TRIAGE_PIPELINE, context);

    res.status(200).json({
      success: true,
      data: context.result,
    });
  } catch (err) {
    next(err); // delegate all error handling to errorHandler middleware
  }
}

/**
 * GET /api/triage/schema
 * Returns the Gemini response schema for CRM integrations.
 */
export async function getSchema(req, res) {
  const { RESPONSE_SCHEMA } = await import('../prompts/triagePrompt.js');
  res.status(200).json({
    success: true,
    schema:  RESPONSE_SCHEMA,
    description: 'JSON schema for the analysis object in every /api/triage response',
  });
}
