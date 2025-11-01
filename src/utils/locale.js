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

module.exports = {
  resolveLocale,
  getI18nConfig,
};
