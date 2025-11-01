'use strict';

const { successResponse } = require('../../../utils/api-response');
const { schedulePublish, unschedulePublish, checkScheduledContent } = require('../services/content-scheduling');

/**
 * Content scheduling controller
 */
module.exports = ({ strapi }) => ({
  /**
   * Schedule content for publication
   * POST /api/content-scheduling/schedule
   */
  async schedule(ctx) {
    const { contentType, entityId, publishAt } = ctx.request.body;

    if (!contentType || !entityId || !publishAt) {
      ctx.throw(400, 'Content type, entity ID, and publish date are required');
    }

    try {
      await schedulePublish(strapi, contentType, parseInt(entityId, 10), publishAt);

      ctx.body = successResponse(
        {
          contentType,
          entityId,
          publishAt,
        },
        null,
        'Content scheduled for publication'
      );
    } catch (error) {
      strapi.log.error('Schedule error:', error);
      ctx.throw(400, error.message || 'Failed to schedule content');
    }
  },

  /**
   * Unschedule content publication
   * POST /api/content-scheduling/unschedule
   */
  async unschedule(ctx) {
    const { contentType, entityId } = ctx.request.body;

    if (!contentType || !entityId) {
      ctx.throw(400, 'Content type and entity ID are required');
    }

    try {
      await unschedulePublish(strapi, contentType, parseInt(entityId, 10));

      ctx.body = successResponse(
        {
          contentType,
          entityId,
        },
        null,
        'Content publication unscheduled'
      );
    } catch (error) {
      strapi.log.error('Unschedule error:', error);
      ctx.throw(400, error.message || 'Failed to unschedule content');
    }
  },

  /**
   * Check and publish scheduled content
   * POST /api/content-scheduling/check
   */
  async check(ctx) {
    try {
      const published = await checkScheduledContent(strapi);

      ctx.body = successResponse(
        {
          published,
          count: published.length,
        },
        null,
        `Checked scheduled content: ${published.length} items published`
      );
    } catch (error) {
      strapi.log.error('Check scheduled content error:', error);
      ctx.throw(500, 'Failed to check scheduled content');
    }
  },
});

