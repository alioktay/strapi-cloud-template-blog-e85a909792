'use strict';

/**
 * tournament controller (Event controller)
 */

const { createCoreController } = require('@strapi/strapi').factories;

// Populate relations and media by default for tournament queries
module.exports = createCoreController('api::tournament.tournament', ({ strapi }) => ({
  async find(ctx) {
    // Ensure all relations/components/media are populated unless client overrides
    if (!ctx.query) ctx.query = {};
    if (!ctx.query.populate) ctx.query.populate = '*';

    // Add date range filtering if provided
    const { startDateFrom, startDateTo, endDateFrom, endDateTo, eventType, eventCategory } = ctx.query;
    
    if (!ctx.query.filters) ctx.query.filters = {};
    
    // Filter by start date range
    if (startDateFrom || startDateTo) {
      ctx.query.filters.startDate = {};
      if (startDateFrom) {
        ctx.query.filters.startDate.$gte = startDateFrom;
      }
      if (startDateTo) {
        ctx.query.filters.startDate.$lte = startDateTo;
      }
    }

    // Filter by end date range
    if (endDateFrom || endDateTo) {
      ctx.query.filters.endDate = {};
      if (endDateFrom) {
        ctx.query.filters.endDate.$gte = endDateFrom;
      }
      if (endDateTo) {
        ctx.query.filters.endDate.$lte = endDateTo;
      }
    }

    // Filter by event type
    if (eventType) {
      ctx.query.filters.eventType = eventType;
    }

    // Filter by event category
    if (eventCategory) {
      ctx.query.filters.eventCategory = eventCategory;
    }

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    // Ensure all relations/components/media are populated unless client overrides
    if (!ctx.query) ctx.query = {};
    if (!ctx.query.populate) ctx.query.populate = '*';

    const entity = await super.findOne(ctx);
    return entity;
  },

  /**
   * Get upcoming events (all types or filtered by type)
   * GET /api/tournaments/upcoming?eventType=tournament&limit=10
   */
  async upcoming(ctx) {
    const { eventType, limit = 10, populate, includePast = false } = ctx.query;
    
    const filters = {
      publishedAt: { $notNull: true },
    };

    // Filter by event type if provided
    if (eventType) {
      filters.eventType = eventType;
    }

    // Filter by future dates (startDate >= today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!includePast || includePast === 'false') {
      filters.$or = [
        { startDate: { $gte: today.toISOString().split('T')[0] } },
        { endDate: { $gte: today.toISOString().split('T')[0] } },
      ];
    }

    const events = await strapi.entityService.findMany('api::tournament.tournament', {
      filters,
      populate: populate || '*',
      sort: [
        { priority: 'desc' },
        { startDate: 'asc' },
      ],
      limit: parseInt(limit, 10),
    });

    return this.transformResponse(events);
  },

  /**
   * Get upcoming tournaments only (filtered by event type = tournament)
   * GET /api/tournaments/upcoming-tournaments?limit=10
   */
  async upcomingTournaments(ctx) {
    const { limit = 10, populate } = ctx.query;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tournaments = await strapi.entityService.findMany('api::tournament.tournament', {
      filters: {
        eventType: 'tournament',
        publishedAt: { $notNull: true },
        $or: [
          { startDate: { $gte: today.toISOString().split('T')[0] } },
          { endDate: { $gte: today.toISOString().split('T')[0] } },
        ],
      },
      populate: populate || '*',
      sort: [
        { priority: 'desc' },
        { startDate: 'asc' },
      ],
      limit: parseInt(limit, 10),
    });

    return this.transformResponse(tournaments);
  },

  /**
   * Get events by category (competitive, social, training, administrative)
   * GET /api/tournaments/by-category?category=competitive&limit=10
   */
  async byCategory(ctx) {
    const { category, limit = 10, populate } = ctx.query;
    
    if (!category) {
      return ctx.badRequest('Category parameter is required (competitive, social, training, administrative)');
    }

    const validCategories = ['competitive', 'social', 'training', 'administrative'];
    if (!validCategories.includes(category)) {
      return ctx.badRequest(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }

    const events = await strapi.entityService.findMany('api::tournament.tournament', {
      filters: {
        eventCategory: category,
        publishedAt: { $notNull: true },
      },
      populate: populate || '*',
      sort: [
        { priority: 'desc' },
        { startDate: 'desc' },
      ],
      limit: parseInt(limit, 10),
    });

    return this.transformResponse(events);
  },
}));