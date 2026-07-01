'use strict';

/**
 * STAGE 1 — Receive Input
 *
 * Responsibility: Package the raw HTTP request data into a clean, structured
 * context object that all downstream stages will read from and write to.
 *
 * This stage never fails. It is the source filter of the pipeline.
 *
 * Context output:
 *   context.rawMessage   {string}  - Original message as received
 *   context.metadata     {object}  - Channel, language, customerId
 */
export async function receiveInput(context) {
  context.rawMessage = context.rawMessage ?? '';
  context.metadata = {
    customerId: context.metadata?.customerId || null,
    channel:    context.metadata?.channel    || null,
    language:   context.metadata?.language   || 'en',
  };
}
