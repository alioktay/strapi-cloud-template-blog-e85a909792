'use strict';

const { errorResponse } = require('../../utils/api-response');
const {
  ApiError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} = require('../../utils/error-handler');

/**
 * Custom error handler middleware
 * Handles errors and returns standardized error responses
 */
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
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
  };
};

