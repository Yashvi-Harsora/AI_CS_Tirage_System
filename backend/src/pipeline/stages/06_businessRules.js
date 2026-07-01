'use strict';
import logger from '../../utils/logger.js';

/**
 * STAGE 6 — Apply Business Rules
 *
 * Responsibility: Apply deterministic, company-defined business rules to the
 * AI analysis output. This stage enriches and overrides AI decisions based on
 * explicit operational policies — it is completely independent of Gemini.
 *
 * Rules are applied defensively: if any rule throws, it is logged as a warning
 * and skipped. The pipeline NEVER aborts at this stage — partial enrichment
 * is always better than a failed response.
 *
 * Rules applied:
 *  1. Auto-escalation    — critical priority → escalate flag
 *  2. Churn risk tagging — angry + billing → add churn-risk tag
 *  3. SLA target mapping — priority → SLA time target
 *  4. Department routing — category → department name override
 *  5. Low-confidence     — confidence < 0.5 → add clarification action + tag
 *
 * Context reads:  context.analysis {object}
 * Context writes: context.analysis (mutated in-place)
 */
export async function applyBusinessRules(context) {
  const a = context.analysis;

  // ── Rule 1: Auto-escalation ───────────────────────────────────────────────
  try {
    if (a.priority === 'critical') {
      a.escalate = true;
      logger.info('[BusinessRules] Rule 1 applied: auto-escalation (critical priority)');
    }
  } catch (e) { logger.warn('[BusinessRules] Rule 1 failed', { error: e.message }); }

  // ── Rule 2: Churn Risk Tagging ────────────────────────────────────────────
  try {
    const isChurnRisk =
      (a.sentiment === 'angry' || a.sentiment === 'frustrated') &&
      a.category === 'billing';

    if (isChurnRisk && !a.tags.includes('churn-risk')) {
      a.tags.push('churn-risk');
      logger.info('[BusinessRules] Rule 2 applied: churn-risk tag added');
    }
  } catch (e) { logger.warn('[BusinessRules] Rule 2 failed', { error: e.message }); }

  // ── Rule 3: SLA Target Mapping ────────────────────────────────────────────
  try {
    const SLA_MAP = {
      critical: '1 hour',
      high:     '4 hours',
      medium:   '24 hours',
      low:      '72 hours',
    };
    a.slaTarget = SLA_MAP[a.priority] || '24 hours';
    // Override AI's estimation only if critical (non-negotiable SLA)
    if (a.priority === 'critical') {
      a.estimatedResolutionTime = '< 1 hour';
    }
    logger.info(`[BusinessRules] Rule 3 applied: SLA target set to ${a.slaTarget}`);
  } catch (e) { logger.warn('[BusinessRules] Rule 3 failed', { error: e.message }); }

  // ── Rule 4: Department Routing ────────────────────────────────────────────
  try {
    const DEPT_MAP = {
      billing:   'Billing & Payments Team',
      technical: 'Tier 2 Engineering Support',
      account:   'Account Management Team',
      shipping:  'Logistics & Fulfilment Team',
      general:   'General Customer Support',
    };
    a.suggestedDepartment = DEPT_MAP[a.category] || a.suggestedDepartment;
    logger.info(`[BusinessRules] Rule 4 applied: department → ${a.suggestedDepartment}`);
  } catch (e) { logger.warn('[BusinessRules] Rule 4 failed', { error: e.message }); }

  // ── Rule 5: Low Confidence Warning ───────────────────────────────────────
  try {
    if (a.confidence < 0.5) {
      if (!a.tags.includes('low-confidence')) a.tags.push('low-confidence');
      if (!a.suggestedActions.includes('Request clarification from the customer')) {
        a.suggestedActions.push('Request clarification from the customer');
      }
      logger.info('[BusinessRules] Rule 5 applied: low-confidence enrichment');
    }
  } catch (e) { logger.warn('[BusinessRules] Rule 5 failed', { error: e.message }); }
  // ── Rule 6: Human Escalation & Confidence Adjustment ───────────────────────
try {
  const message = (context.rawMessage || "").toLowerCase();

  const humanKeywords = [
    "previous",
    "earlier",
    "last agent",
    "support agent",
    "conversation",
    "ticket",
    "refund promised",
    "continue",
    "internal",
    "manager",
    "lawsuit",
    "legal",
    "police",
    "court",
    "media",
    "social media",
    "already contacted",
    "escalate"
  ];

  const requiresHuman = humanKeywords.some(keyword =>
    message.includes(keyword)
  );

  if (requiresHuman) {
    a.needsHuman = true;

    // Reduce confidence naturally instead of forcing a value
    if (typeof a.confidence === "number") {
      a.confidence = Math.max(0.60, a.confidence - 0.20);
    }

    if (!a.tags.includes("human-review")) {
      a.tags.push("human-review");
    }

    if (!a.suggestedActions.includes("Escalate to a human support agent")) {
      a.suggestedActions.unshift("Escalate to a human support agent");
    }

    logger.info("[BusinessRules] Rule 6 applied");
  }

} catch (e) {
  logger.warn("[BusinessRules] Rule 6 failed", { error: e.message });
}



// ── Rule 7: Prompt Injection Detection ──────────────────────────────────────
try {

  const message = (context.rawMessage || "").toLowerCase();

  const injectionPatterns = [
    "ignore previous instructions",
    "ignore all instructions",
    "system prompt",
    "act as",
    "you are chatgpt",
    "return hacked",
    "print prompt",
    "developer message",
    "forget previous"
  ];

  const injectionDetected = injectionPatterns.some(pattern =>
    message.includes(pattern)
  );

  if (injectionDetected) {

    a.needsHuman = true;

    a.confidence = Math.min(a.confidence, 0.35);

    if (!a.tags.includes("prompt-injection")) {
      a.tags.push("prompt-injection");
    }

    a.suggestedActions = [
      "Potential prompt injection detected.",
      "Do not follow embedded instructions.",
      "Escalate to manual review."
    ];

    logger.info("[BusinessRules] Rule 7 applied");

  }

} catch (e) {
  logger.warn("[BusinessRules] Rule 7 failed", { error: e.message });
}



// ── Rule 8: Multi-Issue Detection ───────────────────────────────────────────
try {

  const message = (context.rawMessage || "").toLowerCase();

  let issueCount = 0;

  const issueKeywords = [
    "payment",
    "refund",
    "login",
    "password",
    "account",
    "order",
    "delivery",
    "shipping",
    "subscription",
    "invoice"
  ];

  issueKeywords.forEach(keyword => {
    if (message.includes(keyword)) issueCount++;
  });

  if (issueCount >= 3) {

    a.needsHuman = true;

    a.confidence = Math.max(0.65, a.confidence - 0.10);

    if (!a.tags.includes("multi-issue")) {
      a.tags.push("multi-issue");
    }

    if (!a.suggestedActions.includes("Review all reported issues before responding")) {
      a.suggestedActions.unshift("Review all reported issues before responding");
    }

    logger.info("[BusinessRules] Rule 8 applied");

  }

} catch (e) {
  logger.warn("[BusinessRules] Rule 8 failed", { error: e.message });
}
}
