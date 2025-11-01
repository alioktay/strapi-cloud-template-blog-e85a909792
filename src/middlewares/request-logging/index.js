'use strict';

/**
 * Request logging middleware
 * Logs API requests for debugging and monitoring
 */
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const startTime = Date.now();
    const { method, url, headers } = ctx.request;
    const userAgent = headers['user-agent'];
    const ip = ctx.request.ip || ctx.request.ips?.[0] || 'unknown';

    // Log request
    if (config?.enabled !== false) {
      strapi.log.debug(`[${method}] ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
    }

    try {
      await next();

      const duration = Date.now() - startTime;
      const { status } = ctx.response;

      // Log response
      if (config?.enabled !== false) {
        const logLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'debug';
        strapi.log[logLevel](
          `[${method}] ${url} - Status: ${status} - Duration: ${duration}ms`
        );
      }

      // Add custom headers if enabled
      if (config?.addHeaders !== false) {
        ctx.set('X-Response-Time', `${duration}ms`);
        ctx.set('X-Request-ID', ctx.state.requestId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      strapi.log.error(
        `[${method}] ${url} - Error: ${error.message} - Duration: ${duration}ms`,
        error
      );
      throw error;
    }
  };
};

