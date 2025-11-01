'use strict';

/**
 * Lifecycle hooks for tournament (Event) content type
 */

module.exports = {
  async beforeCreate(event) {
    await validateDates(event);
  },

  async beforeUpdate(event) {
    await validateDates(event);
  },
};

/**
 * Validate that endDate is after startDate
 */
async function validateDates(event) {
  if (!event.params || !event.params.data) {
    return;
  }

  const { startDate, endDate } = event.params.data;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      const error = new Error('End date must be after start date');
      error.status = 400;
      throw error;
    }
  }
}

