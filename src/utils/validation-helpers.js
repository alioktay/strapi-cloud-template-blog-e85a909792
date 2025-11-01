'use strict';

/**
 * Validation helper utilities
 * Provides reusable validation functions for Strapi
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // RFC 5322 compliant email regex (simplified but practical)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @param {Object} options - Validation options
 * @returns {boolean} Whether URL is valid
 */
function validateURL(url, options = {}) {
  if (!url || typeof url !== 'string') {
    return options.required === false;
  }

  try {
    const urlObj = new URL(url);
    
    // Check protocol if required
    if (options.requireProtocol && !urlObj.protocol) {
      return false;
    }

    // Check allowed protocols
    if (options.allowedProtocols && options.allowedProtocols.length > 0) {
      const protocol = urlObj.protocol.slice(0, -1); // Remove trailing ':'
      if (!options.allowedProtocols.includes(protocol)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    // If URL parsing fails, it's invalid
    return false;
  }
}

/**
 * Validate date range (endDate >= startDate)
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @param {Object} options - Validation options
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
function validateDateRange(startDate, endDate, options = {}) {
  if (!startDate || !endDate) {
    if (options.allowNull) {
      return { valid: true };
    }
    return { valid: false, error: 'Both start date and end date are required' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }

  if (options.strict && end <= start) {
    return { valid: false, error: 'End date must be after start date' };
  }

  if (end < start) {
    return { valid: false, error: 'End date must be on or after start date' };
  }

  return { valid: true };
}

/**
 * Validate slug format
 * @param {string} slug - Slug to validate
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
function validateSlug(slug) {
  if (!slug || typeof slug !== 'string') {
    return { valid: false, error: 'Slug must be a non-empty string' };
  }

  if (slug.length > 255) {
    return { valid: false, error: 'Slug must be 255 characters or less' };
  }

  // Valid slug: lowercase letters, numbers, and hyphens only
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return {
      valid: false,
      error: 'Slug must contain only lowercase letters, numbers, and hyphens',
    };
  }

  // Cannot start or end with hyphen
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { valid: false, error: 'Slug cannot start or end with a hyphen' };
  }

  // Cannot have consecutive hyphens
  if (slug.includes('--')) {
    return { valid: false, error: 'Slug cannot contain consecutive hyphens' };
  }

  return { valid: true };
}

/**
 * Validate required fields
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result { valid: boolean, errors?: Array<string> }
 */
function validateRequiredFields(data, requiredFields) {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data must be an object'] };
  }

  const errors = [];

  for (const field of requiredFields) {
    const value = data[field];
    
    // Check if field exists and is not empty
    if (value === undefined || value === null || value === '') {
      errors.push(`Field '${field}' is required`);
    } else if (Array.isArray(value) && value.length === 0) {
      errors.push(`Field '${field}' must not be empty`);
    } else if (typeof value === 'string' && value.trim() === '') {
      errors.push(`Field '${field}' must not be empty`);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {Object} options - Validation options { min?: number, max?: number }
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
function validateNumberRange(value, options = {}) {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: 'Value must be a valid number' };
  }

  if (options.min !== undefined && value < options.min) {
    return { valid: false, error: `Value must be at least ${options.min}` };
  }

  if (options.max !== undefined && value > options.max) {
    return { valid: false, error: `Value must be at most ${options.max}` };
  }

  return { valid: true };
}

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {Object} options - Validation options { min?: number, max?: number }
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
function validateStringLength(value, options = {}) {
  if (typeof value !== 'string') {
    return { valid: false, error: 'Value must be a string' };
  }

  const length = value.length;

  if (options.min !== undefined && length < options.min) {
    return { valid: false, error: `String must be at least ${options.min} characters` };
  }

  if (options.max !== undefined && length > options.max) {
    return { valid: false, error: `String must be at most ${options.max} characters` };
  }

  return { valid: true };
}

module.exports = {
  validateEmail,
  validateURL,
  validateDateRange,
  validateSlug,
  validateRequiredFields,
  validateNumberRange,
  validateStringLength,
};

