'use strict';

/**
 * Content templates routes
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/content-templates',
      handler: 'content-templates.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/content-templates/apply',
      handler: 'content-templates.apply',
      config: {
        policies: [],
      },
    },
  ],
};

