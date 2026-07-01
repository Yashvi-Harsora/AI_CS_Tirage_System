'use strict';
import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Too many requests. Maximum ${config.rateLimit.max} requests per minute allowed.`,
    },
  },
});

export default rateLimiter;
