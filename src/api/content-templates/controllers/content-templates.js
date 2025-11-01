'use strict';

const { successResponse } = require('../../../utils/api-response');

/**
 * Content templates controller
 */
module.exports = ({ strapi }) => ({
  /**
   * Get available content templates
   * GET /api/content-templates
   */
  async find(ctx) {
    const { contentType } = ctx.query;

    // Define templates for different content types
    const templates = {
      article: [
        {
          name: 'Standard Article',
          description: 'Standard article template with title, description, and content blocks',
          template: {
            title: '',
            description: '',
            blocks: [],
          },
        },
        {
          name: 'News Article',
          description: 'News article template',
          template: {
            title: '',
            description: '',
            blocks: [
              {
                __component: 'shared.rich-text',
                body: '',
              },
            ],
          },
        },
      ],
      tournament: [
        {
          name: 'Tournament Event',
          description: 'Template for tournament events',
          template: {
            title: '',
            eventType: 'tournament',
            eventCategory: 'competitive',
            description: '',
            registrationRequired: true,
            maxParticipants: 0,
          },
        },
        {
          name: 'Training Session',
          description: 'Template for training sessions',
          template: {
            title: '',
            eventType: 'training',
            eventCategory: 'training',
            description: '',
            registrationRequired: false,
          },
        },
        {
          name: 'Meeting Event',
          description: 'Template for meetings',
          template: {
            title: '',
            eventType: 'meeting',
            eventCategory: 'administrative',
            description: '',
            registrationRequired: false,
          },
        },
      ],
      page: [
        {
          name: 'Standard Page',
          description: 'Standard page template',
          template: {
            title: '',
            heroTitle: '',
            heroSubtitle: '',
            content: [],
          },
        },
        {
          name: 'Landing Page',
          description: 'Landing page template with hero section',
          template: {
            title: '',
            heroTitle: '',
            heroSubtitle: '',
            content: [
              {
                __component: 'shared.media',
              },
              {
                __component: 'shared.rich-text',
                body: '',
              },
            ],
          },
        },
      ],
    };

    if (contentType && templates[contentType]) {
      ctx.body = successResponse(templates[contentType]);
    } else {
      ctx.body = successResponse(templates);
    }
  },

  /**
   * Apply template to create new content
   * POST /api/content-templates/apply
   */
  async apply(ctx) {
    const { contentType, templateName, templateData, customData = {} } = ctx.request.body;

    if (!contentType || !templateName || !templateData) {
      ctx.throw(400, 'Content type, template name, and template data are required');
    }

    try {
      // Merge template data with custom data
      const contentData = {
        ...templateData,
        ...customData,
      };

      // Create entity from template
      const entity = await strapi.entityService.create(contentType, {
        data: contentData,
      });

      ctx.body = successResponse(entity, null, `Content created from template "${templateName}"`);
    } catch (error) {
      strapi.log.error('Template apply error:', error);
      ctx.throw(500, 'Failed to apply template');
    }
  },
});

