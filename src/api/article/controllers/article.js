'use strict';

/**
 *  article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  /**
   * Full-text search functionality
   * GET /api/articles/search?q=searchterm
   */
  async search(ctx) {
    const { q, populate } = ctx.query;
    
    if (!q || q.trim() === '') {
      return ctx.badRequest('Search query parameter "q" is required');
    }

    const searchTerm = q.trim();
    
    // Search in title, description, and slug
    const articles = await strapi.entityService.findMany('api::article.article', {
      filters: {
        $or: [
          { title: { $containsi: searchTerm } },
          { description: { $containsi: searchTerm } },
          { slug: { $containsi: searchTerm } },
        ],
        publishedAt: { $notNull: true },
      },
      populate: populate || {
        author: true,
        category: true,
        cover: true,
      },
      sort: { publishedAt: 'desc' },
    });

    return this.transformResponse(articles);
  },

  /**
   * Get featured articles
   * GET /api/articles/featured?limit=5
   */
  async featured(ctx) {
    const { limit = 10, populate } = ctx.query;
    
    const featuredArticles = await strapi.entityService.findMany('api::article.article', {
      filters: {
        publishedAt: { $notNull: true },
      },
      populate: populate || {
        author: true,
        category: true,
        cover: true,
      },
      sort: { publishedAt: 'desc' },
      limit: parseInt(limit, 10),
    });

    return this.transformResponse(featuredArticles);
  },

  /**
   * Get related articles based on category or tags
   * GET /api/articles/related/:id?limit=5
   */
  async related(ctx) {
    const { id } = ctx.params;
    const { limit = 5, populate } = ctx.query;
    
    if (!id) {
      return ctx.badRequest('Article ID is required');
    }

    // Get the current article
    const currentArticle = await strapi.entityService.findOne('api::article.article', id, {
      populate: {
        category: true,
        tags: true,
      },
    });

    if (!currentArticle) {
      return ctx.notFound('Article not found');
    }

    // Build filters for related articles
    const filters = {
      id: { $ne: id }, // Exclude current article
      publishedAt: { $notNull: true },
    };

    // If article has a category, find articles with same category
    if (currentArticle.category) {
      filters.category = { id: currentArticle.category.id };
    }

    const relatedArticles = await strapi.entityService.findMany('api::article.article', {
      filters,
      populate: populate || {
        author: true,
        category: true,
        cover: true,
      },
      sort: { publishedAt: 'desc' },
      limit: parseInt(limit, 10),
    });

    return this.transformResponse(relatedArticles);
  },

  /**
   * Enhanced find with pagination helper and custom sorting
   * GET /api/articles?sort=popular|recent|alphabetical&page=1&pageSize=10
   */
  async find(ctx) {
    const { sort, page, pageSize } = ctx.query;
    
    // Set default pagination
    const pageNumber = parseInt(page, 10) || 1;
    const size = parseInt(pageSize, 10) || 10;
    const start = (pageNumber - 1) * size;

    // Handle custom sorting
    let sortOrder = { publishedAt: 'desc' }; // Default: recent first
    
    if (sort === 'popular') {
      // Sort by publishedAt descending (most recent = most popular for now)
      // Could be enhanced with view counts if analytics are added
      sortOrder = { publishedAt: 'desc' };
    } else if (sort === 'recent') {
      sortOrder = { publishedAt: 'desc' };
    } else if (sort === 'alphabetical') {
      sortOrder = { title: 'asc' };
    }

    // Override query pagination
    ctx.query.pagination = {
      start,
      limit: size,
    };

    // Override query sort if custom sort is provided
    if (sort && ['popular', 'recent', 'alphabetical'].includes(sort)) {
      ctx.query.sort = sortOrder;
    }

    const { data, meta } = await super.find(ctx);
    
    // Enhance meta with pagination info
    meta.pagination = {
      page: pageNumber,
      pageSize: size,
      pageCount: Math.ceil(meta.pagination.total / size),
      total: meta.pagination.total,
    };

    return { data, meta };
  },
}));
