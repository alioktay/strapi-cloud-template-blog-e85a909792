# Table Tennis Association - Strapi Backend

A comprehensive Strapi backend for a Table Tennis Association website with i18n support, event management, and custom API endpoints.

## 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

## 📋 Features

- **Content Management**: Articles, News, Pages, Events (Tournaments, Training Sessions, Meetings, etc.)
- **Internationalization (i18n)**: Support for multiple locales (de-AT, en)
- **Custom API Endpoints**: Search, filtering, statistics, and more
- **Event Management**: Comprehensive event system with registration, scheduling, and categorization
- **Validation & Data Integrity**: Custom validations for email, URLs, dates, and slugs
- **Performance Optimized**: Smart populate queries and optimized database access
- **Webhooks**: Content creation/update/deletion webhooks

## 🔧 Setup

1. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run database migrations and seed data**:
   ```bash
   npm run seed:example
   ```

4. **Start development server**:
   ```bash
   npm run develop
   ```

## 📡 API Examples

### Search Articles
```bash
GET /api/articles/search?q=table%20tennis
```

### Get Featured Articles
```bash
GET /api/articles/featured?limit=5
```

### Get Upcoming Events
```bash
GET /api/tournaments/upcoming?eventType=tournament&limit=10
```

### Get Statistics
```bash
GET /api/statistics
```

### Export Content
```bash
GET /api/export/article/json?download=true
GET /api/export/tournament/csv?download=true
```

### i18n - Get Locales
```bash
GET /api/i18n/locales
GET /api/i18n/detect
```

### Filter Events by Date Range
```bash
GET /api/tournaments?startDateFrom=2025-01-01&startDateTo=2025-12-31&eventType=tournament
```

## 📝 API Response Format

All API responses follow a standardized format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-01-01T00:00:00.000Z",
    "pagination": { ... }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "status": 400,
    "details": { ... }
  },
  "meta": {
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
```

## 🌍 Internationalization

The project supports multiple locales:
- Default: `de-AT` (Deutsch - Österreich)
- Available: `en` (English)

Locale can be specified via query parameter:
```
GET /api/articles?locale=en
GET /api/tournaments?locale=de-AT
```

## 🎯 Content Types

- **Article**: Blog posts and articles
- **News**: News items
- **Page**: Static pages
- **Event (Tournament)**: Events including tournaments, training sessions, meetings, social events
- **Author**: Content authors
- **Category**: Article categories
- **Sponsor**: Sponsors with tier levels
- **Location**: Event locations
- **Organizer**: Event organizers
- **Menu**: Navigation menus
- **Global**: Site-wide settings

## 📚 Custom Endpoints

### Articles
- `GET /api/articles/search?q=term` - Full-text search
- `GET /api/articles/featured?limit=10` - Featured articles
- `GET /api/articles/related/:id?limit=5` - Related articles

### Events
- `GET /api/tournaments/upcoming` - Upcoming events
- `GET /api/tournaments/upcoming-tournaments` - Upcoming tournaments only
- `GET /api/tournaments/by-category?category=competitive` - Events by category

### Statistics
- `GET /api/statistics` - Aggregated statistics

### i18n
- `GET /api/i18n/locales` - Available locales
- `GET /api/i18n/detect` - Detect locale from browser
- `GET /api/i18n/localizations/:contentType/:id` - Get localizations
- `GET /api/i18n/missing/:contentType/:id` - Get missing translations
- `POST /api/i18n/translate/:contentType/:id` - Create translation
- `GET /api/i18n/export/:contentType/:locale` - Export translations
- `POST /api/i18n/import/:contentType/:locale` - Import translations

### Export
- `GET /api/export/:contentType/json?download=true` - Export to JSON
- `GET /api/export/:contentType/csv?download=true` - Export to CSV

### Webhooks
- `POST /api/webhooks/content-created` - Content created webhook
- `POST /api/webhooks/content-updated` - Content updated webhook
- `POST /api/webhooks/content-deleted` - Content deleted webhook
- `POST /api/webhooks/event-registration` - Event registration webhook

## 🛠️ Development

### Project Structure
```
src/
├── api/              # API endpoints and content types
├── components/       # Reusable components
├── middlewares/      # Custom middlewares
├── services/         # Business logic services
└── utils/            # Utility functions
```

### Available Scripts
- `npm run develop` - Start development server
- `npm run build` - Build admin panel
- `npm run start` - Start production server
- `npm run seed:example` - Seed example data

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
