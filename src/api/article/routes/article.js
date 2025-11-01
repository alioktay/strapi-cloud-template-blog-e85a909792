'use strict';

/**
 * article router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::article.article');

const customRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/articles/search',
      handler: 'article.search',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/articles/featured',
      handler: 'article.featured',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/articles/related/:id',
      handler: 'article.related',
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
