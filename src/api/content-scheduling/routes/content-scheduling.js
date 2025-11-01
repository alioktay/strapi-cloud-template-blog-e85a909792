'use strict';

/**
 * Content scheduling routes
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/content-scheduling/schedule',
      handler: 'content-scheduling.schedule',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/content-scheduling/unschedule',
      handler: 'content-scheduling.unschedule',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/content-scheduling/check',
      handler: 'content-scheduling.check',
      config: {
        policies: [],
      },
    },
  ],
};

