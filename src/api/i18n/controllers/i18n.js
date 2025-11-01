'use strict';

const { LocaleSwitcher, detectLocaleFromHeader, getI18nConfig } = require('../../../utils/locale');
const {
  getAllLocalizations,
  getMissingTranslations,
  createTranslation,
  bulkCreateTranslations,
  exportTranslations,
  importTranslations,
} = require('../../../utils/translation-helpers');
const { successResponse } = require('../../../utils/api-response');

/**
 * i18n controller for locale and translation management
 */
module.exports = ({ strapi }) => {
  const localeSwitcher = new LocaleSwitcher(strapi);

  return {
    /**
     * Get available locales
     * GET /api/i18n/locales
     */
    async getLocales(ctx) {
      const locales = localeSwitcher.getAvailableLocales();
      const localeInfos = locales.map((locale) => localeSwitcher.getLocaleInfo(locale));

      ctx.body = successResponse(localeInfos, {
        defaultLocale: localeSwitcher.getDefaultLocale(),
      });
    },

    /**
     * Detect locale from Accept-Language header
     * GET /api/i18n/detect
     */
    async detectLocale(ctx) {
      const { locales, defaultLocale } = getI18nConfig(strapi);
      const acceptLanguage = ctx.request.headers['accept-language'];
      const detected = detectLocaleFromHeader(acceptLanguage, locales, defaultLocale);

      ctx.body = successResponse({
        detected,
        acceptLanguage,
        localeInfo: localeSwitcher.getLocaleInfo(detected),
      });
    },

    /**
     * Get all localizations for an entity
     * GET /api/i18n/localizations/:contentType/:id
     */
    async getLocalizations(ctx) {
      const { contentType, id } = ctx.params;
      const localizations = await getAllLocalizations(strapi, `api::${contentType}.${contentType}`, parseInt(id, 10));

      ctx.body = successResponse(localizations);
    },

    /**
     * Get missing translations for an entity
     * GET /api/i18n/missing/:contentType/:id
     */
    async getMissing(ctx) {
      const { contentType, id } = ctx.params;
      const missing = await getMissingTranslations(strapi, `api::${contentType}.${contentType}`, parseInt(id, 10));

      ctx.body = successResponse(missing);
    },

    /**
     * Create translation for an entity
     * POST /api/i18n/translate/:contentType/:id
     */
    async createTranslation(ctx) {
      const { contentType, id } = ctx.params;
      const { locale, ...overrideData } = ctx.request.body;

      if (!locale) {
        ctx.throw(400, 'Locale is required');
      }

      const translation = await createTranslation(
        strapi,
        `api::${contentType}.${contentType}`,
        parseInt(id, 10),
        locale,
        overrideData
      );

      ctx.body = successResponse(translation, null, 'Translation created successfully');
    },

    /**
     * Export translations
     * GET /api/i18n/export/:contentType/:locale
     */
    async export(ctx) {
      const { contentType, locale } = ctx.params;
      const { populate = '*', filters = '{}', download = false } = ctx.query;

      const json = await exportTranslations(strapi, `api::${contentType}.${contentType}`, locale, {
        populate,
        filters: JSON.parse(filters),
      });

      if (download === 'true') {
        ctx.set('Content-Type', 'application/json');
        ctx.set('Content-Disposition', `attachment; filename="${contentType}_${locale}.json"`);
        ctx.body = json;
      } else {
        ctx.body = successResponse(JSON.parse(json));
      }
    },

    /**
     * Import translations
     * POST /api/i18n/import/:contentType/:locale
     */
    async import(ctx) {
      const { contentType, locale } = ctx.params;
      const { overwrite = false } = ctx.request.body;
      const jsonData = ctx.request.body.data || ctx.request.body;

      const results = await importTranslations(
        strapi,
        `api::${contentType}.${contentType}`,
        jsonData,
        locale,
        { overwrite }
      );

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;

      ctx.body = successResponse(results, {
        successCount,
        failureCount,
        total: results.length,
      }, `Import completed: ${successCount} succeeded, ${failureCount} failed`);
    },
  };
};

