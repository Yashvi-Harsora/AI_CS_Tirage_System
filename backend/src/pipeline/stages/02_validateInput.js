'use strict';
import AppError from '../../utils/AppError.js';

const VALID_CHANNELS = ['email', 'chat', 'phone', 'social'];
const MIN_LENGTH = 10;
const MAX_LENGTH = 2000;

/**
 * STAGE 2 — Validate Input
 *
 * Responsibility: Apply business-level validation rules to the incoming data.
 * This is a second, deeper validation pass after express-validator's HTTP-layer
 * checks. Stage 2 is the fail-fast gate — it aborts the pipeline before any
 * expensive downstream operation (normalisation, AI call) is attempted.
 *
 * Throws AppError(400) on any violation.
 *
 * Context reads:  context.rawMessage, context.metadata
 * Context writes: nothing (validation only)
 */
export async function validateInput(context) {
  const { rawMessage, metadata } = context;

  if (!rawMessage || typeof rawMessage !== 'string') {
    throw new AppError(400, 'VALIDATION_ERROR', 'message is required and must be a string.');
  }

  const trimmed = rawMessage.trim();

  if (trimmed.length < MIN_LENGTH) {
    throw new AppError(400, 'VALIDATION_ERROR',
      `message must be at least ${MIN_LENGTH} characters (received ${trimmed.length}).`
    );
  }

  if (trimmed.length > MAX_LENGTH) {
    throw new AppError(400, 'VALIDATION_ERROR',
      `message must not exceed ${MAX_LENGTH} characters (received ${trimmed.length}).`
    );
  }

  if (metadata.channel && !VALID_CHANNELS.includes(metadata.channel)) {
    throw new AppError(400, 'VALIDATION_ERROR',
      `metadata.channel must be one of: ${VALID_CHANNELS.join(', ')}.`
    );
  }

  if (metadata.language && (typeof metadata.language !== 'string' || metadata.language.length > 10)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'metadata.language must be a valid ISO 639-1 code.');
  }
}
