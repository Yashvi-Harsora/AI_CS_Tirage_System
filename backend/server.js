'use strict';
import './src/config/index.js'; // Validate env vars before anything else
import app from './src/app.js';
import config from './src/config/index.js';
import logger from './src/utils/logger.js';

const server = app.listen(config.server.port, () => {
  logger.info(`🚀 TriageAI Backend running on http://localhost:${config.server.port}`);
  logger.info(`Environment: ${config.server.nodeEnv}`);
  logger.info(`Gemini model: ${config.gemini.model}`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection', { reason: String(reason) });
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message });
  process.exit(1);
});

export default server;
