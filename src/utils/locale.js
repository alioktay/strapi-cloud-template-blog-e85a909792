'use strict';

/**
 * Read i18n plugin config in a resilient way across Strapi setups
 */
function getI18nConfig(strapi) {
  const i18nCfg = strapi?.config?.get('plugin.i18n', {});
  const configLocales = i18nCfg?.config?.locales || i18nCfg?.locales || [];
  const defaultLocale = i18nCfg?.config?.defaultLocale || i18nCfg?.defaultLocale || 'en';
  return { locales: configLocales, defaultLocale };
}

/**
 * Get content with fallback to default locale if translation is missing
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type
 * @param {string} requestedLocale - Requested locale
 * @param {Object} filters - Filters to apply
 * @param {Object} options - Additional options (populate, sort, etc.)
 * @returns {Promise<*>} Content with fallback
 */
async function getContentWithFallback(strapi, contentType, requestedLocale, filters = {}, options = {}) {
  const { locales, defaultLocale } = getI18nConfig(strapi);
  const targetLocale = resolveLocale(requestedLocale, locales, defaultLocale) || defaultLocale;

  try {
    // Try to get content in requested locale
    const content = await strapi.entityService.findMany(contentType, {
      filters: { ...filters, locale: targetLocale },
      ...options,
    });

    // If content found and not empty, return it
    if (content && (Array.isArray(content) ? content.length > 0 : content !== null)) {
      return { data: content, locale: targetLocale, fallback: false };
    }

    // If no content found and not default locale, try default locale
    if (targetLocale !== defaultLocale) {
      const fallbackContent = await strapi.entityService.findMany(contentType, {
        filters: { ...filters, locale: defaultLocale },
        ...options,
      });

      if (fallbackContent && (Array.isArray(fallbackContent) ? fallbackContent.length > 0 : fallbackContent !== null)) {
        return { data: fallbackContent, locale: defaultLocale, fallback: true };
      }
    }

    return { data: Array.isArray(content) ? [] : null, locale: targetLocale, fallback: false };
  } catch (error) {
    // If error occurs, try default locale as fallback
    if (targetLocale !== defaultLocale) {
      try {
        const fallbackContent = await strapi.entityService.findMany(contentType, {
          filters: { ...filters, locale: defaultLocale },
          ...options,
        });
        return { data: fallbackContent, locale: defaultLocale, fallback: true };
      } catch (fallbackError) {
        throw error; // Throw original error if fallback also fails
      }
    }
    throw error;
  }
}

/**
 * Resolve a requested locale to a configured locale using the following rules:
 * - 'all' is handled by callers.
 * - Exact match (case-insensitive) wins.
 * - Language-only input (e.g., 'de') resolves to a configured locale with that language.
 *   Prefer the configured defaultLocale if its language matches; else prefer the base locale
 *   (e.g., 'en') if present; else the first variant with that language.
 * - Language-region input (e.g., 'en-US') tries exact; if missing, falls back to base language
 *   if configured (e.g., 'en'); else any variant of that language (prefer defaultLocale language).
 * - If input is missing, resolve to configured defaultLocale.
 * - If nothing matches, return null.
 */
function resolveLocale(requested, configLocales, defaultLocale) {
  const localesOriginal = Array.isArray(configLocales) ? configLocales : [];
  const locales = localesOriginal.map((l) => String(l).toLowerCase());
  const originalByLower = Object.fromEntries(localesOriginal.map((l) => [String(l).toLowerCase(), l]));

  const toParts = (loc) => {
    if (!loc) return { lang: null, region: null };
    const [lang, region] = String(loc).split('-');
    return { lang: (lang || '').toLowerCase(), region: (region || '').toLowerCase() };
  };

  const pickForLang = (lang) => {
    if (!lang) return null;
    const dflt = (defaultLocale || '').toLowerCase();
    const dfltParts = toParts(dflt);
    // Prefer defaultLocale if its language matches
    if (dfltParts.lang === lang && originalByLower[dflt]) return originalByLower[dflt];
    // Prefer base locale (e.g., 'en') if configured
    if (originalByLower[lang]) return originalByLower[lang];
    // Otherwise any variant with same language
    const match = locales.find((l) => toParts(l).lang === lang);
    return match ? originalByLower[match] : null;
  };

  // No locale requested → use default
  if (!requested) return defaultLocale || null;

  const reqLower = String(requested).toLowerCase();

  // Exact match
  if (originalByLower[reqLower]) return originalByLower[reqLower];

  const { lang, region } = toParts(reqLower);

  if (lang && !region) {
    // Language-only input → pick preferred variant for that language
    return pickForLang(lang);
  }

  if (lang && region) {
    // Language-region input → try base language, then any variant of that language
    const base = pickForLang(lang);
    if (base) return base;
  }

  return null;
}

/**
 * Detect locale from browser Accept-Language header
 * @param {string} acceptLanguage - Accept-Language header value
 * @param {Array} availableLocales - Available locales
 * @param {string} defaultLocale - Default locale
 * @returns {string} Detected locale
 */
function detectLocaleFromHeader(acceptLanguage, availableLocales, defaultLocale) {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const localesOriginal = Array.isArray(availableLocales) ? availableLocales : [];
  const locales = localesOriginal.map((l) => String(l).toLowerCase());
  const originalByLower = Object.fromEntries(localesOriginal.map((l) => [String(l).toLowerCase(), l]));

  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,de;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, quality = 'q=1'] = lang.trim().split(';');
      const q = parseFloat(quality.replace('q=', '')) || 1;
      return { locale: locale.trim().toLowerCase(), quality: q };
    })
    .sort((a, b) => b.quality - a.quality); // Sort by quality

  // Try to match each language preference
  for (const { locale: requested } of languages) {
    // Try exact match
    if (originalByLower[requested]) {
      return originalByLower[requested];
    }

    // Try language match (e.g., 'en' matches 'en-US')
    const requestedParts = requested.split('-');
    const requestedLang = requestedParts[0];

    for (const locale of localesOriginal) {
      const localeLower = String(locale).toLowerCase();
      if (localeLower.startsWith(requestedLang + '-') || localeLower === requestedLang) {
        return locale;
      }
    }
  }

  return defaultLocale;
}

/**
 * Locale switcher utility
 * Get available locales and switch between them
 */
class LocaleSwitcher {
  constructor(strapi) {
    this.strapi = strapi;
    const config = getI18nConfig(strapi);
    this.locales = config.locales;
    this.defaultLocale = config.defaultLocale;
  }

  /**
   * Get all available locales
   * @returns {Array} Available locales
   */
  getAvailableLocales() {
    return this.locales;
  }

  /**
   * Get default locale
   * @returns {string} Default locale
   */
  getDefaultLocale() {
    return this.defaultLocale;
  }

  /**
   * Check if locale is available
   * @param {string} locale - Locale to check
   * @returns {boolean} Whether locale is available
   */
  isLocaleAvailable(locale) {
    return this.locales.includes(locale);
  }

  /**
   * Get localized URL for a given locale
   * @param {string} currentUrl - Current URL
   * @param {string} newLocale - New locale
   * @returns {string} Localized URL
   */
  getLocalizedUrl(currentUrl, newLocale) {
    if (!this.isLocaleAvailable(newLocale)) {
      return currentUrl;
    }

    // Replace locale in URL query parameter
    const url = new URL(currentUrl, 'http://localhost');
    url.searchParams.set('locale', newLocale);
    return url.pathname + url.search;
  }

  /**
   * Get locale info object
   * @param {string} locale - Locale code
   * @returns {Object} Locale info
   */
  getLocaleInfo(locale) {
    return {
      code: locale,
      name: this.getLocaleName(locale),
      isDefault: locale === this.defaultLocale,
      isAvailable: this.isLocaleAvailable(locale),
    };
  }

  /**
   * Get locale display name
   * @param {string} locale - Locale code
   * @returns {string} Locale name
   */
  getLocaleName(locale) {
    const names = {
      'de-AT': 'Deutsch (Österreich)',
      'en': 'English',
      'de': 'Deutsch',
      'en-US': 'English (US)',
      'en-GB': 'English (UK)',
    };
    return names[locale] || locale;
  }
}

module.exports = {
  resolveLocale,
  getI18nConfig,
  getContentWithFallback,
  detectLocaleFromHeader,
  LocaleSwitcher,
};
