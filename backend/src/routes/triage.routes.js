'use strict';
import { Router } from 'express';
import { triageValidationRules, handleValidationErrors } from '../middleware/validate.js';
import { triageMessage, getSchema } from '../controllers/triageController.js';
import rateLimiter from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/triage
router.post(
  '/',
  rateLimiter,
  triageValidationRules,
  handleValidationErrors,
  triageMessage
);

// GET /api/triage/schema
router.get('/schema', getSchema);

export default router;
