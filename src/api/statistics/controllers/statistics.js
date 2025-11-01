'use strict';

/**
 * statistics controller
 */

module.exports = ({ strapi }) => ({
  /**
   * Get aggregated statistics
   * GET /api/statistics
   */
  async index(ctx) {
    try {
      // Get article count
      const articleCount = await strapi.entityService.count('api::article.article', {
        filters: {
          publishedAt: { $notNull: true },
        },
      });

      // Get event count (all types)
      const eventCount = await strapi.entityService.count('api::tournament.tournament', {
        filters: {
          publishedAt: { $notNull: true },
        },
      });

      // Get tournament count (eventType = tournament)
      const tournamentCount = await strapi.entityService.count('api::tournament.tournament', {
        filters: {
          eventType: 'tournament',
          publishedAt: { $notNull: true },
        },
      });

      // Get upcoming events count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcomingEventsCount = await strapi.entityService.count('api::tournament.tournament', {
        filters: {
          publishedAt: { $notNull: true },
          $or: [
            { startDate: { $gte: today.toISOString().split('T')[0] } },
            { endDate: { $gte: today.toISOString().split('T')[0] } },
          ],
        },
      });

      // Get upcoming tournaments count
      const upcomingTournamentsCount = await strapi.entityService.count('api::tournament.tournament', {
        filters: {
          eventType: 'tournament',
          publishedAt: { $notNull: true },
          $or: [
            { startDate: { $gte: today.toISOString().split('T')[0] } },
            { endDate: { $gte: today.toISOString().split('T')[0] } },
          ],
        },
      });

      // Get news count
      const newsCount = await strapi.entityService.count('api::news.news', {
        filters: {
          publishedAt: { $notNull: true },
        },
      });

      // Get author count
      const authorCount = await strapi.entityService.count('api::author.author');

      // Get category count
      const categoryCount = await strapi.entityService.count('api::category.category');

      // Get sponsor count
      const sponsorCount = await strapi.entityService.count('api::sponsor.sponsor');

      // Get location count
      const locationCount = await strapi.entityService.count('api::location.location');

      // Get events by type
      const eventsByType = {};
      const eventTypes = ['tournament', 'training', 'meeting', 'social', 'workshop', 'administrative'];
      
      for (const type of eventTypes) {
        eventsByType[type] = await strapi.entityService.count('api::tournament.tournament', {
          filters: {
            eventType: type,
            publishedAt: { $notNull: true },
          },
        });
      }

      // Get events by category
      const eventsByCategory = {};
      const eventCategories = ['competitive', 'social', 'training', 'administrative'];
      
      for (const category of eventCategories) {
        eventsByCategory[category] = await strapi.entityService.count('api::tournament.tournament', {
          filters: {
            eventCategory: category,
            publishedAt: { $notNull: true },
          },
        });
      }

      // Get featured events count
      const featuredEventsCount = await strapi.entityService.count('api::tournament.tournament', {
        filters: {
          isFeatured: true,
          publishedAt: { $notNull: true },
        },
      });

      return {
        data: {
          articles: {
            total: articleCount,
          },
          events: {
            total: eventCount,
            upcoming: upcomingEventsCount,
            featured: featuredEventsCount,
            byType: eventsByType,
            byCategory: eventsByCategory,
          },
          tournaments: {
            total: tournamentCount,
            upcoming: upcomingTournamentsCount,
          },
          news: {
            total: newsCount,
          },
          authors: {
            total: authorCount,
          },
          categories: {
            total: categoryCount,
          },
          sponsors: {
            total: sponsorCount,
          },
          locations: {
            total: locationCount,
          },
        },
        meta: {
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      ctx.throw(500, `Error fetching statistics: ${error.message}`);
    }
  },
}));

