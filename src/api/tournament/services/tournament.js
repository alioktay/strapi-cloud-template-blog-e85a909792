'use strict';

/**
 * tournament service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tournament.tournament', ({ strapi }) => ({
  async validate(event) {
    // Validate that endDate is after startDate
    if (event.startDate && event.endDate) {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      if (endDate < startDate) {
        throw new Error('End date must be after start date');
      }
    }
  }
}));