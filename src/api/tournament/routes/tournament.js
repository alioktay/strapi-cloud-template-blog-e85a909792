'use strict';

/**
 * tournament router (Event router)
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::tournament.tournament');

const customRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/tournaments/upcoming',
      handler: 'tournament.upcoming',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/tournaments/upcoming-tournaments',
      handler: 'tournament.upcomingTournaments',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/tournaments/by-category',
      handler: 'tournament.byCategory',
      config: {
        auth: false,
      },
    },
  ],
};

module.exports = {
  routes: [
    ...defaultRouter.routes,
    ...customRoutes.routes,
  ],
};