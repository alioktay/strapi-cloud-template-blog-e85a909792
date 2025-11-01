'use strict';

/**
 * Custom error handling utilities
 */

const { errorResponse } = require('./api-response');

/**
 * Custom error classes
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApiError {
  constructor(message, details = {}) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', details = {}) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', details = {}) {
    super(message, 401, details);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', details = {}) {
    super(message, 403, details);
    this.name = 'ForbiddenError';
  }
}

/**
 * Error handler middleware for Strapi
 * @param {Object} ctx - Koa context
 * @param {Function} next - Next middleware
 */
async function errorHandlerMiddleware(ctx, next) {
  try {
    await next();
  } catch (err) {
    // If response already sent, delegate to default error handler
    if (ctx.response.headerSent) {
      throw err;
    }

    // Handle custom API errors
    if (err instanceof ApiError) {
      ctx.status = err.statusCode;
      ctx.body = errorResponse(err, err.statusCode, err.details);
      return;
    }

    // Handle Strapi errors
    if (err.status) {
      ctx.status = err.status;
      ctx.body = errorResponse(err.message || 'An error occurred', err.status, {
        name: err.name,
      });
      return;
    }

    // Handle validation errors
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      ctx.status = 400;
      ctx.body = errorResponse(err.message || 'Validation error', 400, {
        name: err.name,
      });
      return;
    }

    // Handle unexpected errors
    ctx.status = err.status || 500;
    ctx.body = errorResponse(
      process.env.NODE_ENV === 'development' 
        ? err.message 
        : 'Internal server error',
      ctx.status,
      process.env.NODE_ENV === 'development' 
        ? { stack: err.stack, name: err.name }
        : {}
    );
  }
}

/**
 * Create standardized error response for controllers
 * @param {Object} ctx - Koa context
 * @param {Error|string} error - Error object or message
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details
 */
function sendError(ctx, error, statusCode = 500, details = {}) {
  ctx.status = statusCode;
  ctx.body = errorResponse(error, statusCode, details);
}

module.exports = {
  ApiError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  errorHandlerMiddleware,
  sendError,
};

