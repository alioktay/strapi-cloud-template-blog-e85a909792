'use strict';

/**
 * Populate query optimizer utilities
 * Helps optimize populate queries to avoid over-populating and improve performance
 */

/**
 * Common populate presets for different use cases
 */
const POPULATE_PRESETS = {
  // Minimal populate - only basic fields
  minimal: {},

  // Basic populate - essential relations only
  basic: {
    author: true,
    category: true,
    cover: true,
  },

  // Full populate - all relations
  full: '*',

  // Specific presets for content types
  article: {
    basic: {
      author: true,
      category: true,
      cover: true,
    },
    full: {
      author: {
        populate: {
          avatar: true,
        },
      },
      category: true,
      cover: true,
      tags: true,
      blocks: {
        populate: '*',
      },
    },
  },

  event: {
    basic: {
      location: true,
      organizer: true,
      category: true,
      flyer: true,
    },
    full: {
      location: {
        populate: '*',
      },
      organizer: {
        populate: '*',
      },
      category: true,
      flyer: true,
      seo: true,
      tags: true,
    },
  },
};

/**
 * Optimize populate query based on requested fields
 * @param {string|Object} requestedPopulate - Requested populate (string or object)
 * @param {Array} requestedFields - Requested fields from query
 * @param {string} contentType - Content type name (optional)
 * @returns {Object} Optimized populate object
 */
function optimizePopulate(requestedPopulate, requestedFields = [], contentType = null) {
  // If requestedFields includes specific fields, only populate those relations
  if (requestedFields && requestedFields.length > 0) {
    const optimizedPopulate = {};
    
    // Extract relation names from requested fields
    const relationFields = requestedFields.filter((field) => {
      // Check if field is a relation (could be in format like 'author.name' or 'location')
      return field.includes('.') || field.includes('_');
    });

    // Build populate object based on requested fields
    for (const field of relationFields) {
      const parts = field.split('.');
      if (parts.length > 0) {
        const relation = parts[0];
        if (!optimizedPopulate[relation]) {
          optimizedPopulate[relation] = true;
        }
      }
    }

    // If no relations found, return empty populate
    if (Object.keys(optimizedPopulate).length === 0) {
      return requestedPopulate === '*' ? {} : requestedPopulate;
    }

    return optimizedPopulate;
  }

  // If populate is a preset string, resolve it
  if (typeof requestedPopulate === 'string') {
    if (requestedPopulate === '*') {
      // For full populate, check if we can use a preset
      if (contentType) {
        const presetType = contentType.replace('api::', '').split('.')[0];
        if (POPULATE_PRESETS[presetType]?.full) {
          return POPULATE_PRESETS[presetType].full;
        }
      }
      return '*';
    }

    // Check for preset name
    if (POPULATE_PRESETS[requestedPopulate]) {
      if (contentType && POPULATE_PRESETS[contentType]?.[requestedPopulate]) {
        return POPULATE_PRESETS[contentType][requestedPopulate];
      }
      return POPULATE_PRESETS[requestedPopulate];
    }
  }

  return requestedPopulate;
}

/**
 * Get populate preset by name
 * @param {string} presetName - Preset name (basic, full, minimal)
 * @param {string} contentType - Content type name (optional)
 * @returns {Object} Populate preset
 */
function getPopulatePreset(presetName, contentType = null) {
  if (contentType && POPULATE_PRESETS[contentType]?.[presetName]) {
    return POPULATE_PRESETS[contentType][presetName];
  }

  if (POPULATE_PRESETS[presetName]) {
    return POPULATE_PRESETS[presetName];
  }

  return {};
}

/**
 * Limit populate depth to avoid deep nesting
 * @param {Object} populate - Populate object
 * @param {number} maxDepth - Maximum depth (default: 2)
 * @returns {Object} Limited populate object
 */
function limitPopulateDepth(populate, maxDepth = 2) {
  if (typeof populate === 'string') {
    return populate === '*' ? '*' : populate;
  }

  if (typeof populate !== 'object' || populate === null) {
    return populate;
  }

  if (maxDepth <= 0) {
    return {};
  }

  const limited = {};
  
  for (const [key, value] of Object.entries(populate)) {
    if (value === true) {
      limited[key] = true;
    } else if (typeof value === 'object' && value !== null) {
      // Recursively limit nested populate
      limited[key] = {
        populate: limitPopulateDepth(value.populate || value, maxDepth - 1),
      };
    }
  }

  return limited;
}

/**
 * Remove unnecessary populate fields
 * @param {Object} populate - Populate object
 * @param {Array} fieldsToExclude - Fields to exclude
 * @returns {Object} Filtered populate object
 */
function excludePopulateFields(populate, fieldsToExclude = []) {
  if (typeof populate === 'string') {
    return populate;
  }

  if (typeof populate !== 'object' || populate === null) {
    return populate;
  }

  const filtered = {};
  
  for (const [key, value] of Object.entries(populate)) {
    if (!fieldsToExclude.includes(key)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        filtered[key] = {
          populate: excludePopulateFields(value.populate || value, fieldsToExclude),
        };
      } else {
        filtered[key] = value;
      }
    }
  }

  return filtered;
}

/**
 * Smart populate based on context and content type
 * @param {string} contentType - Content type
 * @param {string} context - Context (list, detail, preview)
 * @param {Object} options - Additional options
 * @returns {Object} Optimized populate object
 */
function smartPopulate(contentType, context = 'list', options = {}) {
  const { include = [], exclude = [], depth = 2 } = options;
  
  // Get base populate based on content type and context
  let populate;
  
  if (context === 'list') {
    populate = getPopulatePreset('basic', contentType) || {};
  } else if (context === 'detail') {
    populate = getPopulatePreset('full', contentType) || '*';
  } else {
    populate = getPopulatePreset('basic', contentType) || {};
  }

  // Apply depth limit
  if (depth > 0) {
    populate = limitPopulateDepth(populate, depth);
  }

  // Exclude unwanted fields
  if (exclude.length > 0) {
    populate = excludePopulateFields(populate, exclude);
  }

  // Include additional fields if specified
  if (include.length > 0) {
    for (const field of include) {
      if (!populate[field]) {
        populate[field] = true;
      }
    }
  }

  return populate;
}

module.exports = {
  optimizePopulate,
  getPopulatePreset,
  limitPopulateDepth,
  excludePopulateFields,
  smartPopulate,
  POPULATE_PRESETS,
};

