'use strict';

/**
 *  global controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { resolveLocale } = require('../../../utils/locale');

const populateTree = {
  mainMenu: {
    populate: {
      items: {
        populate: {
          page: true,
          children: {
            populate: {
              page: true,
            },
          },
        },
      },
    },
  },
  footerMenu: {
    populate: {
      items: {
        populate: {
          page: true,
          children: {
            populate: {
              page: true,
            },
          },
        },
      },
    },
  },
  defaultSeo: true,
  sponsors: {
    populate: {
      image: true,
    },
  },
};

module.exports = createCoreController('api::global.global', ({ strapi }) => ({
  async find(ctx) {
    const requestedLocale = ctx?.query?.locale;

    // Return all localizations when explicitly requested
    if (requestedLocale === 'all') {
      const list = await strapi.entityService.findMany('api::global.global', {
        locale: 'all',
        populate: populateTree,
        publicationState: 'live',
      });
      return { data: list, meta: {} };
    }

    const i18nCfg = strapi.config.get('plugin.i18n', {});
    const configLocales = i18nCfg?.config?.locales || i18nCfg?.locales || [];
    const defaultLocale = i18nCfg?.config?.defaultLocale || i18nCfg?.defaultLocale || 'en';

    const targetLocale = resolveLocale(requestedLocale, configLocales, defaultLocale);

    if (!targetLocale) {
      return { data: null, meta: {} };
    }

    const list = await strapi.entityService.findMany('api::global.global', {
      filters: { locale: targetLocale },
      populate: populateTree,
      publicationState: 'live',
      limit: 1,
    });
    const entity = Array.isArray(list) ? list[0] : list;

    return { data: entity || null, meta: {} };
  },

  async findOne(ctx) {
    const requestedLocale = ctx?.query?.locale;

    if (requestedLocale === 'all') {
      const list = await strapi.entityService.findMany('api::global.global', {
        locale: 'all',
        populate: populateTree,
        publicationState: 'live',
      });
      return { data: list, meta: {} };
    }

    const i18nCfg = strapi.config.get('plugin.i18n', {});
    const configLocales = i18nCfg?.config?.locales || i18nCfg?.locales || [];
    const defaultLocale = i18nCfg?.config?.defaultLocale || i18nCfg?.defaultLocale || 'en';

    const targetLocale = resolveLocale(requestedLocale, configLocales, defaultLocale);

    if (!targetLocale) {
      return { data: null, meta: {} };
    }

    const list = await strapi.entityService.findMany('api::global.global', {
      filters: { locale: targetLocale },
      populate: populateTree,
      publicationState: 'live',
      limit: 1,
    });
    const entity = Array.isArray(list) ? list[0] : list;

    return { data: entity || null, meta: {} };
  },
}));
