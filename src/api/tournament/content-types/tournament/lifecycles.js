'use strict';

const { validateDateRange } = require('../../../../utils/validation-helpers');

/**
 * Lifecycle hooks for tournament (Event) content type
 */

module.exports = {
  async beforeCreate(event) {
    await validateEventData(event);
  },

  async beforeUpdate(event) {
    await validateEventData(event);
  },
};

/**
 * Validate event data including dates and slug uniqueness
 */
async function validateEventData(event) {
  if (!event.params || !event.params.data) {
    return;
  }

  const { startDate, endDate, slug, locale } = event.params.data;
  
  // Get strapi instance - available in event.model.strapi for lifecycle hooks
  const strapi = event.model?.strapi;

  // Validate date range
  if (startDate && endDate) {
    const dateValidation = validateDateRange(startDate, endDate, { strict: true });
    if (!dateValidation.valid) {
      const error = new Error(dateValidation.error || 'End date must be after start date');
      error.status = 400;
      throw error;
    }
  }

  // Validate slug uniqueness across locales if slug and strapi are available
  if (slug && strapi) {
    const entityId = event.params.where?.id;
    await validateSlugUniqueness(strapi, 'api::tournament.tournament', slug, entityId, locale);
  }
}

/**
 * Validate slug uniqueness across locales
 */
async function validateSlugUniqueness(strapi, contentType, slug, existingId = null, locale = null) {
  const { getI18nConfig } = require('../../../../utils/locale');
  const { locales } = getI18nConfig(strapi);

  // Check slug uniqueness in all locales
  for (const checkLocale of locales) {
    // Skip current locale if specified (we'll check it separately)
    if (locale && checkLocale === locale) {
      continue;
    }

    const filters = {
      slug,
      locale: checkLocale,
    };

    if (existingId) {
      filters.id = { $ne: existingId };
    }

    const existing = await strapi.entityService.findMany(contentType, {
      filters,
      limit: 1,
    });

    if (existing && existing.length > 0) {
      const error = new Error(`Slug "${slug}" already exists in locale "${checkLocale}"`);
      error.status = 400;
      throw error;
    }
  }

  // Check current locale if specified
  if (locale) {
    const filters = {
      slug,
      locale,
    };

    if (existingId) {
      filters.id = { $ne: existingId };
    }

    const existing = await strapi.entityService.findMany(contentType, {
      filters,
      limit: 1,
    });

    if (existing && existing.length > 0) {
      const error = new Error(`Slug "${slug}" already exists in locale "${locale}"`);
      error.status = 400;
      throw error;
    }
  }
}

