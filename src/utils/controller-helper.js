'use strict';

const { successResponse, paginatedResponse, errorResponse } = require('./api-response');
const { ValidationError, NotFoundError } = require('./error-handler');

/**
 * Controller helper utilities for standardized responses
 */
class ControllerHelper {
  constructor(controller) {
    this.controller = controller;
  }

  /**
   * Send standardized success response
   * @param {Object} ctx - Koa context
   * @param {*} data - Response data
   * @param {Object} meta - Optional metadata
   * @param {string} message - Optional message
   */
  success(ctx, data, meta = {}, message = null) {
    ctx.body = successResponse(data, meta, message);
  }

  /**
   * Send standardized paginated response
   * @param {Object} ctx - Koa context
   * @param {Array} data - Response data array
   * @param {Object} pagination - Pagination metadata
   * @param {Object} meta - Additional metadata
   */
  paginated(ctx, data, pagination, meta = {}) {
    ctx.body = paginatedResponse(data, pagination, meta);
  }

  /**
   * Transform and send response using Strapi's transformResponse
   * Enhanced with standardized format
   * @param {Object} ctx - Koa context
   * @param {*} data - Data to transform
   * @param {Object} meta - Optional metadata
   */
  transformAndSend(ctx, data, meta = {}) {
    const transformed = this.controller.transformResponse(data);
    ctx.body = successResponse(transformed, meta);
  }

  /**
   * Transform paginated data and send with standardized format
   * @param {Object} ctx - Koa context
   * @param {Object} result - Result object with data and meta
   */
  transformPaginatedAndSend(ctx, result) {
    const transformedData = this.controller.transformResponse(result.data);
    ctx.body = paginatedResponse(transformedData, result.meta.pagination || {}, {
      ...result.meta,
      pagination: undefined, // Remove nested pagination, already in paginatedResponse
    });
  }
}

module.exports = {
  ControllerHelper,
  ValidationError,
  NotFoundError,
};

