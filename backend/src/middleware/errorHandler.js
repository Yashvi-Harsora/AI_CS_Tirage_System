'use strict';
import logger from '../utils/logger.js';
import config from '../config/index.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const isOperational = err.isOperational === true;
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_ERROR';

  if (isOperational) {
    logger.warn('Operational error', { statusCode, errorCode, message: err.message });
  } else {
    logger.error('Unexpected error', { statusCode, errorCode, message: err.message, stack: err.stack });
  }

  const responseMessage = isOperational
    ? err.message
    : 'An unexpected error occurred. Please try again later.';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: responseMessage,
      ...(config.server.nodeEnv === 'development' && !isOperational && { stack: err.stack }),
    },
  });
}
