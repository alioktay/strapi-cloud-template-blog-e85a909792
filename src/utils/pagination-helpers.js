'use strict';

/**
 * Pagination utility functions
 */

/**
 * Calculate pagination metadata
 * @param {number} total - Total number of items
 * @param {number} page - Current page number
 * @param {number} pageSize - Items per page
 * @returns {Object} Pagination metadata
 */
function calculatePagination(total, page = 1, pageSize = 10) {
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const size = Math.max(1, parseInt(pageSize, 10) || 10);
  const totalItems = parseInt(total, 10) || 0;
  const totalPages = Math.ceil(totalItems / size);

  return {
    page: pageNumber,
    pageSize: size,
    total: totalItems,
    pageCount: totalPages,
    hasNextPage: pageNumber < totalPages,
    hasPreviousPage: pageNumber > 1,
    nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
    previousPage: pageNumber > 1 ? pageNumber - 1 : null,
  };
}

/**
 * Get pagination offset from page number
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {number} Offset (start index)
 */
function getOffset(page = 1, pageSize = 10) {
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const size = Math.max(1, parseInt(pageSize, 10) || 10);
  return (pageNumber - 1) * size;
}

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} pageSize - Page size
 * @param {Object} options - Validation options
 * @returns {Object} Validated pagination params { page, pageSize, start, limit }
 */
function validatePagination(page, pageSize, options = {}) {
  const { minPageSize = 1, maxPageSize = 100, defaultPageSize = 10 } = options;

  let pageNumber = parseInt(page, 10) || 1;
  let size = parseInt(pageSize, 10) || defaultPageSize;

  // Validate bounds
  pageNumber = Math.max(1, pageNumber);
  size = Math.max(minPageSize, Math.min(maxPageSize, size));

  const start = (pageNumber - 1) * size;
  const limit = size;

  return {
    page: pageNumber,
    pageSize: size,
    start,
    limit,
  };
}

/**
 * Create pagination links
 * @param {Object} pagination - Pagination metadata
 * @param {string} baseUrl - Base URL for links
 * @param {Object} queryParams - Additional query parameters
 * @returns {Object} Pagination links
 */
function createPaginationLinks(pagination, baseUrl, queryParams = {}) {
  const { page, pageCount } = pagination;
  const links = {};

  // Remove existing page parameter from query
  const params = { ...queryParams };
  delete params.page;

  const buildUrl = (pageNum) => {
    const url = new URL(baseUrl, 'http://localhost');
    Object.entries({ ...params, page: pageNum }).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.pathname + url.search;
  };

  if (page > 1) {
    links.first = buildUrl(1);
    links.prev = buildUrl(page - 1);
  }

  if (page < pageCount) {
    links.next = buildUrl(page + 1);
    links.last = buildUrl(pageCount);
  }

  links.self = buildUrl(page);

  return links;
}

module.exports = {
  calculatePagination,
  getOffset,
  validatePagination,
  createPaginationLinks,
};

