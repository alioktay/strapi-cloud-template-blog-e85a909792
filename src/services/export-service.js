'use strict';

/**
 * Content export service (JSON/CSV)
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Export content to JSON
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type (e.g., 'api::article.article')
 * @param {Object} options - Export options
 * @returns {Promise<string>} JSON string
 */
async function exportToJSON(strapi, contentType, options = {}) {
  const {
    filters = {},
    populate = '*',
    sort = { publishedAt: 'desc' },
    limit = null,
  } = options;

  const entities = await strapi.entityService.findMany(contentType, {
    filters,
    populate,
    sort,
    limit,
  });

  return JSON.stringify(entities, null, 2);
}

/**
 * Export content to CSV
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type (e.g., 'api::article.article')
 * @param {Object} options - Export options
 * @returns {Promise<string>} CSV string
 */
async function exportToCSV(strapi, contentType, options = {}) {
  const {
    filters = {},
    populate = '*',
    sort = { publishedAt: 'desc' },
    limit = null,
    fields = null, // Optional: array of field names to include
  } = options;

  const entities = await strapi.entityService.findMany(contentType, {
    filters,
    populate,
    sort,
    limit,
  });

  if (!entities || entities.length === 0) {
    return '';
  }

  // Flatten nested objects for CSV
  const flattenObject = (obj, prefix = '') => {
    const flattened = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && !(obj[key] instanceof Date)) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else {
          // Convert to string, handle arrays and dates
          if (Array.isArray(obj[key])) {
            flattened[newKey] = obj[key].map(item => 
              typeof item === 'object' ? JSON.stringify(item) : String(item)
            ).join('; ');
          } else if (obj[key] instanceof Date) {
            flattened[newKey] = obj[key].toISOString();
          } else {
            flattened[newKey] = obj[key] === null || obj[key] === undefined ? '' : String(obj[key]);
          }
        }
      }
    }
    return flattened;
  };

  // Determine fields to export
  let fieldsToExport = fields;
  if (!fieldsToExport) {
    // Auto-detect fields from first entity
    const firstEntity = flattenObject(entities[0]);
    fieldsToExport = Object.keys(firstEntity);
  }

  // Build CSV header
  const csvRows = [fieldsToExport.map(field => `"${field}"`).join(',')];

  // Build CSV rows
  for (const entity of entities) {
    const flattened = flattenObject(entity);
    const row = fieldsToExport.map(field => {
      const value = flattened[field] || '';
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(row.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Save export to file
 * @param {string} content - Content to save
 * @param {string} filename - Filename
 * @param {string} format - Format ('json' or 'csv')
 * @returns {Promise<string>} File path
 */
async function saveExportToFile(content, filename, format = 'json') {
  const exportDir = path.join(process.cwd(), 'exports');
  
  // Create exports directory if it doesn't exist
  try {
    await fs.mkdir(exportDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }

  const extension = format === 'json' ? '.json' : '.csv';
  const filepath = path.join(exportDir, `${filename}${extension}`);

  await fs.writeFile(filepath, content, 'utf8');

  return filepath;
}

/**
 * Get export filename with timestamp
 * @param {string} contentType - Content type name
 * @param {string} format - Format ('json' or 'csv')
 * @returns {string} Filename
 */
function getExportFilename(contentType, format = 'json') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const typeName = contentType.replace(/api::|\./g, '-').replace(/-/g, '_');
  return `${typeName}_${timestamp}`;
}

module.exports = {
  exportToJSON,
  exportToCSV,
  saveExportToFile,
  getExportFilename,
};

