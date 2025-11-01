'use strict';

const { validateEmail } = require('../../../../utils/validation-helpers');

/**
 * Lifecycle hooks for author content type
 */
module.exports = {
  async beforeCreate(event) {
    await validateAuthorData(event);
  },

  async beforeUpdate(event) {
    await validateAuthorData(event);
  },
};

/**
 * Validate author data
 */
async function validateAuthorData(event) {
  if (!event.params || !event.params.data) {
    return;
  }

  const { email } = event.params.data;

  // Validate email format if provided
  if (email) {
    if (!validateEmail(email)) {
      const error = new Error('Invalid email format');
      error.status = 400;
      throw error;
    }
  }
}

