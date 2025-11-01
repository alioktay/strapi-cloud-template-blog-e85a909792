'use strict';

/**
 * statistics router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/statistics',
      handler: 'statistics.index',
      config: {
        auth: false,
      },
    },
  ],
};

