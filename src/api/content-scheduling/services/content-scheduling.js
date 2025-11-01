'use strict';

/**
 * Content scheduling service
 * Handles scheduled publishing of content
 */

/**
 * Schedule content for publication
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type
 * @param {number} entityId - Entity ID
 * @param {Date|string} publishAt - Publish date/time
 * @returns {Promise<void>}
 */
async function schedulePublish(strapi, contentType, entityId, publishAt) {
  const publishDate = publishAt instanceof Date ? publishAt : new Date(publishAt);

  if (publishDate <= new Date()) {
    throw new Error('Publish date must be in the future');
  }

  // Update entity with scheduled publish date
  await strapi.entityService.update(contentType, entityId, {
    data: {
      scheduledPublishAt: publishDate.toISOString(),
      publishedAt: null, // Unpublish for now, will be published at scheduled time
    },
  });

  // Schedule the actual publish job
  // In a real implementation, you would use a job queue (like Bull, Agenda, etc.)
  // For now, we'll store the schedule and check on publish endpoint access
  strapi.log.info(
    `Content ${contentType}:${entityId} scheduled for publication at ${publishDate.toISOString()}`
  );
}

/**
 * Unschedule content publication
 * @param {Object} strapi - Strapi instance
 * @param {string} contentType - Content type
 * @param {number} entityId - Entity ID
 * @returns {Promise<void>}
 */
async function unschedulePublish(strapi, contentType, entityId) {
  await strapi.entityService.update(contentType, entityId, {
    data: {
      scheduledPublishAt: null,
    },
  });

  strapi.log.info(`Content ${contentType}:${entityId} publication unscheduled`);
}

/**
 * Check and publish scheduled content
 * This should be called periodically (e.g., via cron job)
 * @param {Object} strapi - Strapi instance
 * @returns {Promise<Array>} Published entities
 */
async function checkScheduledContent(strapi) {
  const now = new Date();
  const published = [];

  // Get all content types that support scheduling
  const contentTypes = ['api::article.article', 'api::tournament.tournament', 'api::news.news'];

  for (const contentType of contentTypes) {
    try {
      // Find entities scheduled for publication
      const scheduled = await strapi.entityService.findMany(contentType, {
        filters: {
          scheduledPublishAt: {
            $lte: now.toISOString(),
          },
          publishedAt: { $null: true },
        },
      });

      // Publish each scheduled entity
      for (const entity of scheduled) {
        try {
          await strapi.entityService.update(contentType, entity.id, {
            data: {
              publishedAt: now.toISOString(),
              scheduledPublishAt: null,
            },
          });

          published.push({ contentType, id: entity.id });
          strapi.log.info(`Published scheduled content: ${contentType}:${entity.id}`);
        } catch (error) {
          strapi.log.error(`Failed to publish scheduled content ${contentType}:${entity.id}:`, error);
        }
      }
    } catch (error) {
      strapi.log.error(`Error checking scheduled content for ${contentType}:`, error);
    }
  }

  return published;
}

module.exports = {
  schedulePublish,
  unschedulePublish,
  checkScheduledContent,
};

