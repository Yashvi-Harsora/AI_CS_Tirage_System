'use strict';
import { body, validationResult } from 'express-validator';

// ─── Validation Rules ─────────────────────────────────────────────────────────
export const triageValidationRules = [
  body('message')
    .exists({ checkFalsy: true })
    .withMessage('message is required')
    .isString()
    .withMessage('message must be a string')
    .trim()
    .isLength({ min: 10 })
    .withMessage('message must be at least 10 characters')
    .isLength({ max: 2000 })
    .withMessage('message must not exceed 2000 characters'),

  body('metadata').optional().isObject().withMessage('metadata must be an object'),

  body('metadata.channel')
    .optional()
    .isIn(['email', 'chat', 'phone', 'social'])
    .withMessage('metadata.channel must be one of: email, chat, phone, social'),

  body('metadata.language')
    .optional()
    .isString()
    .isLength({ min: 2, max: 10 })
    .withMessage('metadata.language must be a valid language code'),

  body('metadata.customerId')
    .optional()
    .isString()
    .withMessage('metadata.customerId must be a string'),
];

// ─── Validation Result Handler ────────────────────────────────────────────────
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: errors.array()[0].msg,
        details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      },
    });
  }
  next();
}
