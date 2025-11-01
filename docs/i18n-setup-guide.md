# i18n Setup Guide

This guide explains how to enable internationalization (i18n) for content types in your Strapi backend.

## Overview

The project currently has i18n configured with two locales:
- **de-AT** (default) - Deutsch (Österreich)
- **en** - English

## Currently Localized Content Types

- **Global** - Site-wide settings (siteName, siteDescription, SEO, menus)

## Recommended Content Types for i18n

For a Table Tennis Association website, the following content types should have i18n enabled:

1. **Article** - Blog articles and news content
2. **Page** - Static pages (About, Contact, etc.)
3. **Event (Tournament)** - Events, tournaments, training sessions
4. **News** - News items
5. **Category** - Article categories

### How to Enable i18n for a Content Type

To enable i18n for a content type, you need to add `pluginOptions` to the schema:

```json
{
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  }
}
```

### Example: Enabling i18n for Article

```json
{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "singularName": "article",
    "pluralName": "articles",
    "displayName": "Article"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "title": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "description": {
      "type": "text",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    }
    // ... other attributes
  }
}
```

## Using i18n APIs

### Get Available Locales
```
GET /api/i18n/locales
```

### Detect Locale from Browser
```
GET /api/i18n/detect
```

### Get Localizations for an Entity
```
GET /api/i18n/localizations/:contentType/:id
```

### Get Missing Translations
```
GET /api/i18n/missing/:contentType/:id
```

### Create Translation
```
POST /api/i18n/translate/:contentType/:id
Body: {
  "locale": "en",
  "title": "English Title",
  // ... other fields
}
```

### Export Translations
```
GET /api/i18n/export/:contentType/:locale?download=true
```

### Import Translations
```
POST /api/i18n/import/:contentType/:locale
Body: {
  "data": [...],
  "overwrite": false
}
```

## Locale-Specific SEO

The SEO component (`shared.seo`) supports i18n. When enabled, each locale can have its own:
- Meta title
- Meta description
- Keywords
- Share image
- Open Graph metadata

## Notes

⚠️ **Important**: Enabling i18n on existing content types will:
1. Require migration of existing data
2. Change how content is queried (locale parameter required)
3. Create separate entries for each locale

It's recommended to enable i18n on new content types before creating content, or to plan a migration strategy for existing content.

