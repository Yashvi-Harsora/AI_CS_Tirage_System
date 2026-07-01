'use strict';
import { runPipeline }       from '../pipeline/pipeline.js';
import { receiveInput }      from '../pipeline/stages/01_receiveInput.js';
import { validateInput }     from '../pipeline/stages/02_validateInput.js';
import { normalizeText }     from '../pipeline/stages/03_normalizeText.js';
import { aiAnalysis }        from '../pipeline/stages/04_aiAnalysis.js';
import { validateAiJson }    from '../pipeline/stages/05_validateAiJson.js';
import { applyBusinessRules} from '../pipeline/stages/06_businessRules.js';
import { formatResponse }    from '../pipeline/stages/07_formatResponse.js';
import AppError              from '../utils/AppError.js';
import logger                from '../utils/logger.js';

const TRIAGE_PIPELINE = [
  receiveInput,
  validateInput,
  normalizeText,
  aiAnalysis,
  validateAiJson,
  applyBusinessRules,
  formatResponse,
];

const BULK_MAX   = 20;  // hard cap per request
const CONCURRENCY = 5; // max parallel Gemini calls

/**
 * Run `TRIAGE_PIPELINE` on a single context object.
 * Returns { ok: true, data } | { ok: false, error }
 */
async function runOne(message, metadata) {
  const context = { rawMessage: message, metadata: metadata || {} };
  try {
    await runPipeline(TRIAGE_PIPELINE, context);
    return { ok: true, data: context.result };
  } catch (err) {
    logger.warn('[AnalyzeController] runOne failed', { error: err.message });
    return { ok: false, error: err.message || 'Analysis failed.' };
  }
}

// ─── POST /api/analyze ────────────────────────────────────────────────────────
export async function analyzeSingle(req, res, next) {
  try {
    const context = {
      rawMessage: req.body.message,
      metadata:   req.body.metadata || {},
    };
    await runPipeline(TRIAGE_PIPELINE, context);
    res.status(200).json({ success: true, data: context.result });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/analyze/bulk ───────────────────────────────────────────────────
export async function analyzeBulk(req, res, next) {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'messages must be a non-empty array.');
    }
    if (messages.length > BULK_MAX) {
      throw new AppError(400, 'VALIDATION_ERROR',
        `Bulk analysis is limited to ${BULK_MAX} messages per request. Received ${messages.length}.`
      );
    }

    // Validate each item shape
    for (let i = 0; i < messages.length; i++) {
      const item = messages[i];
      if (typeof item !== 'object' || typeof item.message !== 'string') {
        throw new AppError(400, 'VALIDATION_ERROR',
          `messages[${i}] must be an object with a "message" string property.`
        );
      }
      const trimmed = item.message.trim();
      if (trimmed.length < 10) {
        throw new AppError(400, 'VALIDATION_ERROR',
          `messages[${i}].message must be at least 10 characters.`
        );
      }
      if (trimmed.length > 2000) {
        throw new AppError(400, 'VALIDATION_ERROR',
          `messages[${i}].message must not exceed 2000 characters.`
        );
      }
    }

    // ── Bounded concurrency pool ─────────────────────────────────────────────
    const results = new Array(messages.length);
    const queue   = messages.map((item, idx) => ({ item, idx }));
    let   pointer = 0;

    async function worker() {
      while (pointer < queue.length) {
        const { item, idx } = queue[pointer++];
        results[idx] = await runOne(item.message.trim(), item.metadata || {});
      }
    }

    const workers = Array.from({ length: Math.min(CONCURRENCY, messages.length) }, worker);
    await Promise.all(workers);

    // ── Summary stats ────────────────────────────────────────────────────────
    const succeeded = results.filter((r) => r.ok).length;
    const failed    = results.length - succeeded;

    const items = results.map((r, i) => ({
      index:    i,
      inputMessage: messages[i].message,
      ...( r.ok
        ? { success: true,  data:  r.data  }
        : { success: false, error: r.error }
      ),
    }));

    res.status(200).json({
      success: true,
      summary: {
        total:     messages.length,
        succeeded,
        failed,
      },
      results: items,
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/analyze/schema ──────────────────────────────────────────────────
export async function getAnalyzeSchema(req, res) {
  const { RESPONSE_SCHEMA } = await import('../prompts/triagePrompt.js');
  res.status(200).json({
    success:     true,
    schema:      RESPONSE_SCHEMA,
    description: 'JSON schema for the analysis object returned by /api/analyze and /api/analyze/bulk',
  });
}
