'use strict';
import logger from '../utils/logger.js';

/**
 * Pipeline Runner — Pipe and Filter implementation.
 *
 * Accepts an ordered array of async stage functions and an initial context
 * object. Executes each stage sequentially, passing the (mutated) context
 * forward. Tracks per-stage timing and total duration.
 *
 * Any stage may throw an AppError to abort the pipeline immediately.
 * The error propagates up to Express's global errorHandler middleware.
 *
 * @param {Function[]} stages  - Ordered array of async stage functions
 * @param {Object}     context - Initial context object
 * @returns {Object} Final context after all stages complete
 */
export async function runPipeline(stages, context) {
  const pipelineStart = Date.now();
  const stageNames = [];

  for (const stage of stages) {
    const stageName = stage.name || 'anonymous';
    const stageStart = Date.now();

    logger.info(`[Pipeline] ▶ Running stage: ${stageName}`);

    await stage(context); // mutates context in-place

    const stageDuration = Date.now() - stageStart;
    logger.info(`[Pipeline] ✓ Stage complete: ${stageName}`, { durationMs: stageDuration });
    stageNames.push(stageName);
  }

  // Attach pipeline metadata to context for the response
  context.pipeline = {
    stages: stageNames,
    durationMs: Date.now() - pipelineStart,
  };

  return context;
}
