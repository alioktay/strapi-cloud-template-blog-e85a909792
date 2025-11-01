'use strict';

/**
 * Email template utilities
 * Provides reusable email templates for common use cases
 */

/**
 * Generate email template with header and footer
 * @param {string} content - Email content
 * @param {Object} options - Template options
 * @returns {string} Complete email HTML
 */
function generateEmailTemplate(content, options = {}) {
  const {
    title = 'Table Tennis Association',
    siteUrl = process.env.SITE_URL || 'https://example.com',
    primaryColor = '#007bff',
    footerText = '© 2025 Table Tennis Association. All rights reserved.',
  } = options;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: ${primaryColor}; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${title}</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d;">
              <p style="margin: 0;">${footerText}</p>
              <p style="margin: 10px 0 0 0;">
                <a href="${siteUrl}" style="color: ${primaryColor}; text-decoration: none;">Visit our website</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Event notification email template
 * @param {Object} event - Event data
 * @param {Object} options - Template options
 * @returns {string} Email HTML
 */
function eventNotificationTemplate(event, options = {}) {
  const { title, startDate, endDate, location, description, eventUrl } = event;

  const content = `
    <h2 style="color: #333; margin-top: 0;">New Event: ${title}</h2>
    <p style="color: #666; line-height: 1.6;">
      We're excited to announce a new event!
    </p>
    <table style="width: 100%; margin: 20px 0;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Event:</strong></td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${title}</td>
      </tr>
      ${startDate ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Start Date:</strong></td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${new Date(startDate).toLocaleDateString()}</td>
      </tr>
      ` : ''}
      ${endDate ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>End Date:</strong></td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${new Date(endDate).toLocaleDateString()}</td>
      </tr>
      ` : ''}
      ${location ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Location:</strong></td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${location}</td>
      </tr>
      ` : ''}
    </table>
    ${description ? `<p style="color: #666; line-height: 1.6;">${description}</p>` : ''}
    ${eventUrl ? `
    <p style="margin-top: 30px;">
      <a href="${eventUrl}" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        View Event Details
      </a>
    </p>
    ` : ''}
  `;

  return generateEmailTemplate(content, options);
}

/**
 * Newsletter email template
 * @param {Object} newsletter - Newsletter data
 * @param {Object} options - Template options
 * @returns {string} Email HTML
 */
function newsletterTemplate(newsletter, options = {}) {
  const { title, content, articles = [], unsubscribeUrl } = newsletter;

  let articlesHtml = '';
  if (articles.length > 0) {
    articlesHtml = articles
      .map(
        (article) => `
      <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #333;">${article.title}</h3>
        ${article.description ? `<p style="color: #666;">${article.description}</p>` : ''}
        ${article.url ? `<a href="${article.url}" style="color: #007bff;">Read more →</a>` : ''}
      </div>
    `
      )
      .join('');
  }

  const emailContent = `
    <h2 style="color: #333; margin-top: 0;">${title}</h2>
    <div style="color: #666; line-height: 1.6;">
      ${content}
    </div>
    ${articlesHtml}
    ${unsubscribeUrl ? `
    <p style="margin-top: 30px; font-size: 12px; color: #999;">
      <a href="${unsubscribeUrl}">Unsubscribe from this newsletter</a>
    </p>
    ` : ''}
  `;

  return generateEmailTemplate(emailContent, options);
}

module.exports = {
  generateEmailTemplate,
  eventNotificationTemplate,
  newsletterTemplate,
};

