'use strict';

/**
 * Export router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/export/:contentType/json',
      handler: 'export.exportJSON',
      config: {
        auth: false, // Can be set to true if you want to require authentication
      },
    },
    {
      method: 'GET',
      path: '/export/:contentType/csv',
      handler: 'export.exportCSV',
      config: {
        auth: false, // Can be set to true if you want to require authentication
      },
    },
  ],
};

