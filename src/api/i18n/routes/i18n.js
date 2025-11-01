'use strict';

/**
 * i18n router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/i18n/locales',
      handler: 'i18n.getLocales',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/i18n/detect',
      handler: 'i18n.detectLocale',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/i18n/localizations/:contentType/:id',
      handler: 'i18n.getLocalizations',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/i18n/missing/:contentType/:id',
      handler: 'i18n.getMissing',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/i18n/translate/:contentType/:id',
      handler: 'i18n.createTranslation',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/i18n/export/:contentType/:locale',
      handler: 'i18n.export',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/i18n/import/:contentType/:locale',
      handler: 'i18n.import',
      config: {
        auth: false,
      },
    },
  ],
};

