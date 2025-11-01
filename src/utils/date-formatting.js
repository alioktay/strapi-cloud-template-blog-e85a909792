'use strict';

/**
 * Date formatting utilities
 */

/**
 * Format date in various formats
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (ISO, locale, relative, custom)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
function formatDate(date, format = 'ISO', options = {}) {
  if (!date) {
    return null;
  }

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return null;
  }

  const { locale = 'en-US', timezone = null } = options;

  switch (format) {
    case 'ISO':
      return dateObj.toISOString();

    case 'locale':
      return dateObj.toLocaleDateString(locale, {
        timeZone: timezone,
        ...options,
      });

    case 'datetime':
      return dateObj.toLocaleString(locale, {
        timeZone: timezone,
        ...options,
      });

    case 'relative':
      return getRelativeTime(dateObj);

    case 'custom':
      return formatCustom(dateObj, options.pattern || 'YYYY-MM-DD');

    default:
      return dateObj.toISOString();
  }
}

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 * @param {Date} date - Date to compare
 * @returns {string} Relative time string
 */
function getRelativeTime(date) {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const isPast = diffMs < 0;

  if (diffSeconds < 60) {
    return isPast ? 'just now' : 'in a moment';
  }

  if (diffMinutes < 60) {
    return isPast
      ? `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
      : `in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
  }

  if (diffHours < 24) {
    return isPast
      ? `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
      : `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  }

  if (diffDays < 7) {
    return isPast
      ? `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
      : `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  }

  if (diffWeeks < 4) {
    return isPast
      ? `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`
      : `in ${diffWeeks} week${diffWeeks !== 1 ? 's' : ''}`;
  }

  if (diffMonths < 12) {
    return isPast
      ? `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`
      : `in ${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
  }

  return isPast
    ? `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`
    : `in ${diffYears} year${diffYears !== 1 ? 's' : ''}`;
}

/**
 * Format date with custom pattern
 * @param {Date} date - Date to format
 * @param {string} pattern - Pattern (YYYY, MM, DD, HH, mm, ss)
 * @returns {string} Formatted date
 */
function formatCustom(date, pattern) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return pattern
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, String(month))
    .replace(/DD/g, String(day))
    .replace(/HH/g, String(hours))
    .replace(/mm/g, String(minutes))
    .replace(/ss/g, String(seconds));
}

/**
 * Format date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date range
 */
function formatDateRange(startDate, endDate, options = {}) {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  const { format = 'locale', locale = 'en-US' } = options;

  if (start.getTime() === end.getTime()) {
    return formatDate(start, format, options);
  }

  // Same day, different times
  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  ) {
    return `${formatDate(start, 'custom', { pattern: 'YYYY-MM-DD' })} ${formatDate(start, 'custom', { pattern: 'HH:mm' })} - ${formatDate(end, 'custom', { pattern: 'HH:mm' })}`;
  }

  // Same year and month
  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()
  ) {
    return `${start.getDate()} - ${formatDate(end, format, options)}`;
  }

  // Different dates
  return `${formatDate(start, format, options)} - ${formatDate(end, format, options)}`;
}

/**
 * Get date parts (year, month, day, etc.)
 * @param {Date|string} date - Date
 * @returns {Object} Date parts
 */
function getDateParts(date) {
  const dateObj = date instanceof Date ? date : new Date(date);

  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1,
    day: dateObj.getDate(),
    hours: dateObj.getHours(),
    minutes: dateObj.getMinutes(),
    seconds: dateObj.getSeconds(),
    dayOfWeek: dateObj.getDay(),
    timestamp: dateObj.getTime(),
  };
}

module.exports = {
  formatDate,
  getRelativeTime,
  formatCustom,
  formatDateRange,
  getDateParts,
};

