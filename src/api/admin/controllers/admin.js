'use strict';

const { successResponse } = require('../../../utils/api-response');

/**
 * Admin controller for admin panel customizations
 */
module.exports = ({ strapi }) => ({
  /**
   * Get admin dashboard statistics
   * GET /api/admin/dashboard
   */
  async getDashboard(ctx) {
    try {
      // Get statistics for dashboard
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Recent activity counts
      const recentArticles = await strapi.entityService.count('api::article.article', {
        filters: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      });

      const recentEvents = await strapi.entityService.count('api::tournament.tournament', {
        filters: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      });

      const upcomingEvents = await strapi.entityService.count('api::tournament.tournament', {
        filters: {
          publishedAt: { $notNull: true },
          $or: [
            { startDate: { $gte: today.toISOString().split('T')[0] } },
            { endDate: { $gte: today.toISOString().split('T')[0] } },
          ],
        },
      });

      const pendingArticles = await strapi.entityService.count('api::article.article', {
        filters: {
          publishedAt: { $null: true },
        },
      });

      // Get content type counts
      const contentCounts = {
        articles: await strapi.entityService.count('api::article.article'),
        events: await strapi.entityService.count('api::tournament.tournament'),
        news: await strapi.entityService.count('api::news.news'),
        authors: await strapi.entityService.count('api::author.author'),
        sponsors: await strapi.entityService.count('api::sponsor.sponsor'),
      };

      // Get recent events
      const upcomingEventsList = await strapi.entityService.findMany('api::tournament.tournament', {
        filters: {
          publishedAt: { $notNull: true },
          $or: [
            { startDate: { $gte: today.toISOString().split('T')[0] } },
            { endDate: { $gte: today.toISOString().split('T')[0] } },
          ],
        },
        sort: { startDate: 'asc' },
        limit: 5,
        populate: {
          location: true,
          organizer: true,
        },
      });

      // Get recent articles
      const recentArticlesList = await strapi.entityService.findMany('api::article.article', {
        filters: {
          publishedAt: { $notNull: true },
        },
        sort: { publishedAt: 'desc' },
        limit: 5,
        populate: {
          author: true,
          category: true,
        },
      });

      ctx.body = successResponse({
        statistics: {
          recentArticles,
          recentEvents,
          upcomingEvents,
          pendingArticles,
          contentCounts,
        },
        upcomingEvents: upcomingEventsList,
        recentArticles: recentArticlesList,
      });
    } catch (error) {
      strapi.log.error('Dashboard error:', error);
      ctx.throw(500, 'Failed to fetch dashboard data');
    }
  },

  /**
   * Bulk delete entities
   * POST /api/admin/bulk-delete
   */
  async bulkDelete(ctx) {
    const { contentType, ids } = ctx.request.body;

    if (!contentType || !Array.isArray(ids) || ids.length === 0) {
      ctx.throw(400, 'Content type and array of IDs required');
    }

    try {
      const deleted = [];
      const errors = [];

      for (const id of ids) {
        try {
          await strapi.entityService.delete(contentType, id);
          deleted.push(id);
        } catch (error) {
          errors.push({ id, error: error.message });
        }
      }

      ctx.body = successResponse({
        deleted,
        errors,
        total: ids.length,
        successCount: deleted.length,
        errorCount: errors.length,
      }, null, `Bulk delete completed: ${deleted.length} succeeded, ${errors.length} failed`);
    } catch (error) {
      strapi.log.error('Bulk delete error:', error);
      ctx.throw(500, 'Bulk delete failed');
    }
  },

  /**
   * Bulk publish entities
   * POST /api/admin/bulk-publish
   */
  async bulkPublish(ctx) {
    const { contentType, ids, publish = true } = ctx.request.body;

    if (!contentType || !Array.isArray(ids) || ids.length === 0) {
      ctx.throw(400, 'Content type and array of IDs required');
    }

    try {
      const updated = [];
      const errors = [];

      for (const id of ids) {
        try {
          const entity = await strapi.entityService.update(contentType, id, {
            data: {
              publishedAt: publish ? new Date() : null,
            },
          });
          updated.push(entity);
        } catch (error) {
          errors.push({ id, error: error.message });
        }
      }

      ctx.body = successResponse({
        updated: updated.map((e) => e.id),
        errors,
        total: ids.length,
        successCount: updated.length,
        errorCount: errors.length,
      }, null, `Bulk ${publish ? 'publish' : 'unpublish'} completed: ${updated.length} succeeded, ${errors.length} failed`);
    } catch (error) {
      strapi.log.error('Bulk publish error:', error);
      ctx.throw(500, 'Bulk publish failed');
    }
  },

  /**
   * Get content preview
   * GET /api/admin/preview/:contentType/:id
   */
  async getPreview(ctx) {
    const { contentType, id } = ctx.params;
    const { locale } = ctx.query;

    try {
      const entity = await strapi.entityService.findOne(contentType, parseInt(id, 10), {
        populate: '*',
        locale,
      });

      if (!entity) {
        ctx.throw(404, 'Content not found');
      }

      ctx.body = successResponse({
        content: entity,
        previewUrl: `/preview/${contentType}/${id}?locale=${locale || 'de-AT'}`,
      });
    } catch (error) {
      strapi.log.error('Preview error:', error);
      ctx.throw(500, 'Failed to fetch preview');
    }
  },
});

