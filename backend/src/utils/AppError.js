'use strict';

/**
 * Custom operational error class.
 * isOperational = true → safe to expose message to client.
 * isOperational = false → bug; return generic 500.
 */
class AppError extends Error {
  constructor(statusCode, errorCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
