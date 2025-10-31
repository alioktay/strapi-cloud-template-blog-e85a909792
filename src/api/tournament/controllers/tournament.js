'use strict';

/**
 * tournament controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// Populate relations and media by default for tournament queries
module.exports = createCoreController('api::tournament.tournament', ({ strapi }) => ({
  async find(ctx) {
    // Ensure all relations/components/media are populated unless client overrides
    if (!ctx.query) ctx.query = {};
    if (!ctx.query.populate) ctx.query.populate = '*';

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
}));