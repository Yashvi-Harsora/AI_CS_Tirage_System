'use strict';

/**
 * STAGE 3 — Normalize Text
 *
 * Responsibility: Clean and standardize the raw customer message before it
 * is sent to the AI. This improves analysis consistency and prevents edge
 * cases from degrading Gemini's output quality.
 *
 * Normalizations applied:
 *  - Trim leading/trailing whitespace
 *  - Collapse multiple consecutive spaces/tabs into a single space
 *  - Normalize line endings to \n
 *  - Remove null bytes and other control characters (except \n, \t)
 *  - Normalize unicode to NFC form (canonical composition)
 *  - Collapse more than 3 consecutive newlines to 2
 *
 * Context reads:  context.rawMessage
 * Context writes: context.normalizedMessage {string}
 */
export async function normalizeText(context) {
  let text = context.rawMessage;

  // 1. Unicode normalization (NFC)
  text = text.normalize('NFC');

  // 2. Normalize line endings
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 3. Remove control characters except newline (\n=10) and tab (\t=9)
  // eslint-disable-next-line no-control-regex
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 4. Collapse horizontal whitespace (spaces/tabs) into single space per line
  text = text
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n');

  // 5. Collapse more than 2 consecutive blank lines to 2
  text = text.replace(/\n{3,}/g, '\n\n');

  // 6. Final trim
  context.normalizedMessage = text.trim();
}
