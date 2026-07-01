'use strict';
import { v4 as uuidv4 } from 'uuid';

/**
 * STAGE 7 — Format Response
 *
 * Responsibility: Assemble the final, client-facing response payload.
 * Attaches a unique triageId, ISO timestamp, echoes back the original input,
 * and bundles the pipeline execution metadata.
 *
 * This is the sink filter of the pipeline — it only writes to context.result,
 * and never aborts.
 *
 * Context reads:  context.rawMessage, context.metadata,
 *                 context.analysis, context.pipeline
 * Context writes: context.result {object} - the final API response payload
 */
export async function formatResponse(context) {
  context.result = {
    triageId:  uuidv4(),
    timestamp: new Date().toISOString(),
    input: {
      message:  context.rawMessage,
      metadata: context.metadata,
    },
    analysis: context.analysis,
    pipeline: context.pipeline ?? null,
  };
}
