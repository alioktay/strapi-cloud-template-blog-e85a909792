'use strict';

/**
 * Slug generation service with uniqueness validation
 */

/**
 * Generate a slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} Generated slug
 */
function generateSlug(text) {
  if (!text) {
    return '';
  }

  return String(text)
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generate a unique slug for a content type
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type (e.g., 'api::article.article')
 * @param {string} baseSlug - Base slug to make unique
 * @param {number} existingId - Optional: exclude this ID from uniqueness check (for updates)
 * @param {string} locale - Optional: locale for i18n content
 * @returns {Promise<string>} Unique slug
 */
async function generateUniqueSlug(strapi, contentType, baseSlug, existingId = null, locale = null) {
  let slug = generateSlug(baseSlug);
  let counter = 1;
  const originalSlug = slug;

  while (true) {
    // Build filters
    const filters = { slug };

    // Exclude current entity if updating
    if (existingId) {
      filters.id = { $ne: existingId };
    }

    // For i18n content types, also check locale
    if (locale) {
      filters.locale = locale;
    }

    // Check if slug exists
    const existing = await strapi.entityService.findMany(contentType, {
      filters,
      limit: 1,
    });

    if (!existing || existing.length === 0) {
      return slug;
    }

    // Slug exists, append counter
    slug = `${originalSlug}-${counter}`;
    counter++;
  }
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

  // Check for valid slug format (lowercase letters, numbers, hyphens)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return {
      valid: false,
      error: 'Slug must contain only lowercase letters, numbers, and hyphens',
    };
  }

  // Check for leading/trailing hyphens
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { valid: false, error: 'Slug cannot start or end with a hyphen' };
  }

  return { valid: true };
}

module.exports = {
  generateSlug,
  generateUniqueSlug,
  validateSlug,
};

