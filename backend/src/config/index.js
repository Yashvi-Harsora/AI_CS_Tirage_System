'use strict';
import 'dotenv/config';

const REQUIRED = [
  'GEMINI_API_KEY',
  'GEMINI_MODEL',
  'PORT',
  'NODE_ENV',
  'FRONTEND_URL',
];

const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`[Config] Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const config = Object.freeze({
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL,
    timeoutMs: parseInt(process.env.GEMINI_TIMEOUT_MS || '15000', 10),
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '30', 10),
  },
  log: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

export default config;
