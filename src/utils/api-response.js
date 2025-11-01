'use strict';

/**
 * Standardized API response utility
 * Provides consistent response format across all endpoints
 */

/**
 * Success response formatter
 * @param {Object} data - The response data
 * @param {Object} meta - Optional metadata
 * @param {string} message - Optional success message
 * @returns {Object} Formatted success response
 */
function successResponse(data, meta = {}, message = null) {
  const response = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };

  if (message) {
    response.message = message;
  }

  return response;
}

/**
 * Error response formatter
 * @param {string|Error} error - Error message or Error object
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details
 * @returns {Object} Formatted error response
 */
function errorResponse(error, statusCode = 500, details = {}) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return {
    success: false,
    error: {
      message: errorMessage,
      status: statusCode,
      ...details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Paginated response formatter
 * @param {Array} data - The response data array
 * @param {Object} pagination - Pagination metadata
 * @param {Object} meta - Additional metadata
 * @returns {Object} Formatted paginated response
 */
function paginatedResponse(data, pagination, meta = {}) {
  return successResponse(data, {
    pagination: {
      page: pagination.page || 1,
      pageSize: pagination.pageSize || 10,
      pageCount: pagination.pageCount || 0,
      total: pagination.total || 0,
    },
    ...meta,
  });
}

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};

