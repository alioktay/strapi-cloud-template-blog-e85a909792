'use strict';

const { exportToJSON, exportToCSV, saveExportToFile, getExportFilename } = require('../../../services/export-service');
const { successResponse } = require('../../../utils/api-response');
const { ValidationError } = require('../../../utils/error-handler');

/**
 * Export controller for content export functionality
 */
module.exports = ({ strapi }) => ({
  /**
   * Export content to JSON
   * GET /api/export/:contentType/json
   */
  async exportJSON(ctx) {
    const { contentType } = ctx.params;
    const { filters = {}, populate = '*', sort, limit, download = false } = ctx.query;

    if (!contentType) {
      throw new ValidationError('Content type is required');
    }

    // Validate content type exists
    const contentTypeModel = strapi.contentTypes[`api::${contentType}.${contentType}`];
    if (!contentTypeModel) {
      throw new ValidationError(`Content type "${contentType}" does not exist`);
    }

    const json = await exportToJSON(strapi, `api::${contentType}.${contentType}`, {
      filters,
      populate,
      sort: sort ? JSON.parse(sort) : { publishedAt: 'desc' },
      limit: limit ? parseInt(limit, 10) : null,
    });

    if (download === 'true') {
      const filename = getExportFilename(contentType, 'json');
      const filepath = await saveExportToFile(json, filename, 'json');
      
      ctx.set('Content-Type', 'application/json');
      ctx.set('Content-Disposition', `attachment; filename="${filename}.json"`);
      ctx.body = json;
    } else {
      ctx.body = successResponse(JSON.parse(json));
    }
  },

  /**
   * Export content to CSV
   * GET /api/export/:contentType/csv
   */
  async exportCSV(ctx) {
    const { contentType } = ctx.params;
    const { filters = {}, populate = '*', sort, limit, fields, download = false } = ctx.query;

    if (!contentType) {
      throw new ValidationError('Content type is required');
    }

    // Validate content type exists
    const contentTypeModel = strapi.contentTypes[`api::${contentType}.${contentType}`];
    if (!contentTypeModel) {
      throw new ValidationError(`Content type "${contentType}" does not exist`);
    }

    const csv = await exportToCSV(strapi, `api::${contentType}.${contentType}`, {
      filters,
      populate,
      sort: sort ? JSON.parse(sort) : { publishedAt: 'desc' },
      limit: limit ? parseInt(limit, 10) : null,
      fields: fields ? fields.split(',') : null,
    });

    if (download === 'true') {
      const filename = getExportFilename(contentType, 'csv');
      const filepath = await saveExportToFile(csv, filename, 'csv');
      
      ctx.set('Content-Type', 'text/csv');
      ctx.set('Content-Disposition', `attachment; filename="${filename}.csv"`);
      ctx.body = csv;
    } else {
      ctx.body = successResponse({ csv });
    }
  },
});

