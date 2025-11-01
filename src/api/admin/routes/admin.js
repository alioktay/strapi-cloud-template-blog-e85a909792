'use strict';

/**
 * Admin routes
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/admin/dashboard',
      handler: 'admin.getDashboard',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/bulk-delete',
      handler: 'admin.bulkDelete',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/admin/bulk-publish',
      handler: 'admin.bulkPublish',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/admin/preview/:contentType/:id',
      handler: 'admin.getPreview',
      config: {
        policies: [],
      },
    },
  ],
};

