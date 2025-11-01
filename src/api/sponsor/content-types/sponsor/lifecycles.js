'use strict';

const { validateURL } = require('../../../../utils/validation-helpers');

/**
 * Lifecycle hooks for sponsor content type
 */
module.exports = {
  async beforeCreate(event) {
    await validateSponsorData(event);
  },

  async beforeUpdate(event) {
    await validateSponsorData(event);
  },
};

/**
 * Validate sponsor data
 */
async function validateSponsorData(event) {
  if (!event.params || !event.params.data) {
    return;
  }

  const { url } = event.params.data;

  // Validate URL format if provided
  if (url) {
    // Check if URL starts with http:// or https://
    const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
    
    if (!validateURL(hasProtocol ? url : `https://${url}`, {
      requireProtocol: false,
      allowedProtocols: ['http', 'https'],
    })) {
      const error = new Error('Invalid URL format. URL must be a valid web address');
      error.status = 400;
      throw error;
    }
  }
}

