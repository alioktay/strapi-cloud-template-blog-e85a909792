'use strict';

const { resolveLocale, getI18nConfig } = require('../../utils/locale');

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Only affect API routes, leave admin and assets untouched
    const path = ctx?.request?.path || '';
    if (!path.startsWith('/api')) {
      return next();
    }

    const q = ctx.query || {};
    const requested = q.locale;

    // Preserve explicit 'all' behavior
    if (requested === 'all') {
      return next();
    }

    const { locales, defaultLocale } = getI18nConfig(strapi);
    const resolved = resolveLocale(requested, locales, defaultLocale);

    // If we resolved to a configured locale, normalize query
    if (resolved) {
      ctx.query = { ...q, locale: resolved };
      ctx.state = ctx.state || {};
      ctx.state.locale = resolved;
    } else if (requested) {
      // We keep the requested as-is when unresolvable to let controllers
      // decide (some may want to return data: null, others may fallback)
      ctx.state = ctx.state || {};
      ctx.state.locale = null;
    }

    await next();
  };
};
