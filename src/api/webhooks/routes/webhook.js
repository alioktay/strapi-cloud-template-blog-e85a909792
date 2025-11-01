'use strict';

/**
 * Webhook routes
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/webhooks/content-created',
      handler: 'webhook.contentCreated',
      config: {
        auth: false, // Can be secured with API token
      },
    },
    {
      method: 'POST',
      path: '/webhooks/content-updated',
      handler: 'webhook.contentUpdated',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/webhooks/content-deleted',
      handler: 'webhook.contentDeleted',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/webhooks/event-registration',
      handler: 'webhook.eventRegistration',
      config: {
        auth: false,
      },
    },
  ],
};

