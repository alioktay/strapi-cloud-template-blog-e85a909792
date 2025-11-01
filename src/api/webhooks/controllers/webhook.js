'use strict';

const { successResponse } = require('../../../utils/api-response');

/**
 * Webhook controller for content events
 */
module.exports = ({ strapi }) => ({
  /**
   * Handle content created webhook
   * POST /api/webhooks/content-created
   */
  async contentCreated(ctx) {
    const { model, entry, event } = ctx.request.body;

    // Log the webhook event
    strapi.log.info(`Webhook: Content created - Model: ${model}, ID: ${entry?.id}`);

    // Process webhook based on content type
    try {
      // You can add custom logic here
      // Example: Send email notifications, update external systems, etc.

      ctx.body = successResponse({
        received: true,
        model,
        entryId: entry?.id,
        event: 'created',
      }, null, 'Webhook processed successfully');
    } catch (error) {
      strapi.log.error('Webhook error:', error);
      ctx.throw(500, 'Webhook processing failed');
    }
  },

  /**
   * Handle content updated webhook
   * POST /api/webhooks/content-updated
   */
  async contentUpdated(ctx) {
    const { model, entry, event } = ctx.request.body;

    strapi.log.info(`Webhook: Content updated - Model: ${model}, ID: ${entry?.id}`);

    try {
      ctx.body = successResponse({
        received: true,
        model,
        entryId: entry?.id,
        event: 'updated',
      }, null, 'Webhook processed successfully');
    } catch (error) {
      strapi.log.error('Webhook error:', error);
      ctx.throw(500, 'Webhook processing failed');
    }
  },

  /**
   * Handle content deleted webhook
   * POST /api/webhooks/content-deleted
   */
  async contentDeleted(ctx) {
    const { model, entryId, event } = ctx.request.body;

    strapi.log.info(`Webhook: Content deleted - Model: ${model}, ID: ${entryId}`);

    try {
      ctx.body = successResponse({
        received: true,
        model,
        entryId,
        event: 'deleted',
      }, null, 'Webhook processed successfully');
    } catch (error) {
      strapi.log.error('Webhook error:', error);
      ctx.throw(500, 'Webhook processing failed');
    }
  },

  /**
   * Handle event registration webhook
   * POST /api/webhooks/event-registration
   */
  async eventRegistration(ctx) {
    const { eventId, registrationData, action } = ctx.request.body;

    strapi.log.info(`Webhook: Event registration - Event: ${eventId}, Action: ${action}`);

    try {
      // Custom logic for event registration webhooks
      // Example: Send confirmation emails, update external systems, etc.

      ctx.body = successResponse({
        received: true,
        eventId,
        action,
        registrationData,
      }, null, 'Registration webhook processed successfully');
    } catch (error) {
      strapi.log.error('Webhook error:', error);
      ctx.throw(500, 'Webhook processing failed');
    }
  },
});

