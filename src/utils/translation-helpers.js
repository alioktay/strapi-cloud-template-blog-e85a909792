'use strict';

/**
 * Translation management helpers
 */

const { getI18nConfig } = require('./locale');

/**
 * Get all localizations for a content type
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type
 * @param {number} entityId - Entity ID
 * @returns {Promise<Array>} All localizations
 */
async function getAllLocalizations(strapi, contentType, entityId) {
  const entity = await strapi.entityService.findOne(contentType, entityId, {
    populate: ['localizations'],
  });

  if (!entity || !entity.localizations) {
    return [];
  }

  // Include the entity itself in localizations
  const allLocalizations = [entity, ...entity.localizations];
  return allLocalizations;
}

/**
 * Get missing translations for a content type
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type
 * @param {number} entityId - Entity ID
 * @returns {Promise<Array>} Missing locales
 */
async function getMissingTranslations(strapi, contentType, entityId) {
  const { locales } = getI18nConfig(strapi);
  const localizations = await getAllLocalizations(strapi, contentType, entityId);

  const existingLocales = localizations.map((item) => item.locale || item.localizations?.map((l) => l.locale)).flat().filter(Boolean);
  const missingLocales = locales.filter((locale) => !existingLocales.includes(locale));

  return missingLocales;
}

/**
 * Create translation for an entity
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type
 * @param {number} sourceEntityId - Source entity ID
 * @param {string} targetLocale - Target locale
 * @param {Object} overrideData - Data to override in translation
 * @returns {Promise<*>} Created translation
 */
async function createTranslation(strapi, contentType, sourceEntityId, targetLocale, overrideData = {}) {
  const sourceEntity = await strapi.entityService.findOne(contentType, sourceEntityId);

  if (!sourceEntity) {
    throw new Error(`Source entity ${sourceEntityId} not found`);
  }

  // Prepare translation data (copy source data, override with provided data)
  const translationData = {
    ...sourceEntity,
    locale: targetLocale,
    ...overrideData,
    // Remove fields that shouldn't be copied
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    publishedAt: undefined,
    localizations: undefined,
  };

  // Create translation
  const translation = await strapi.entityService.create(contentType, {
    data: translationData,
  });

  return translation;
}

/**
 * Bulk create translations for multiple entities
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type
 * @param {Array} translations - Array of { entityId, locale, overrideData }
 * @returns {Promise<Array>} Created translations
 */
async function bulkCreateTranslations(strapi, contentType, translations) {
  const results = [];

  for (const { entityId, locale, overrideData = {} } of translations) {
    try {
      const translation = await createTranslation(strapi, contentType, entityId, locale, overrideData);
      results.push({ success: true, entityId, locale, translation });
    } catch (error) {
      results.push({ success: false, entityId, locale, error: error.message });
    }
  }

  return results;
}

/**
 * Export translations to JSON format
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type
 * @param {string} locale - Locale to export
 * @param {Object} options - Export options
 * @returns {Promise<string>} JSON string
 */
async function exportTranslations(strapi, contentType, locale, options = {}) {
  const { populate = '*', filters = {} } = options;

  const entities = await strapi.entityService.findMany(contentType, {
    filters: { ...filters, locale },
    populate,
  });

  return JSON.stringify(entities, null, 2);
}

/**
 * Import translations from JSON
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type
 * @param {string} jsonData - JSON string or object
 * @param {string} targetLocale - Target locale
 * @param {Object} options - Import options
 * @returns {Promise<Array>} Import results
 */
async function importTranslations(strapi, contentType, jsonData, targetLocale, options = {}) {
  const { overwrite = false } = options;
  const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
  const entities = Array.isArray(data) ? data : [data];

  const results = [];

  for (const entityData of entities) {
    try {
      // Check if translation already exists
      if (!overwrite) {
        const existing = await strapi.entityService.findMany(contentType, {
          filters: {
            locale: targetLocale,
            // Match by slug or title if available
            ...(entityData.slug ? { slug: entityData.slug } : {}),
            ...(entityData.title ? { title: entityData.title } : {}),
          },
          limit: 1,
        });

        if (existing && existing.length > 0) {
          results.push({
            success: false,
            entity: entityData,
            error: 'Translation already exists. Set overwrite=true to update.',
          });
          continue;
        }
      }

      // Create or update translation
      const translationData = {
        ...entityData,
        locale: targetLocale,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        localizations: undefined,
      };

      const translation = await strapi.entityService.create(contentType, {
        data: translationData,
      });

      results.push({ success: true, entity: entityData, translation });
    } catch (error) {
      results.push({ success: false, entity: entityData, error: error.message });
    }
  }

  return results;
}

module.exports = {
  getAllLocalizations,
  getMissingTranslations,
  createTranslation,
  bulkCreateTranslations,
  exportTranslations,
  importTranslations,
};

