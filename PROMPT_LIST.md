# Strapi Backend Project - Prompt List

This document contains a comprehensive list of prompts and tasks we can work on together to enhance this Strapi backend project for a **Table Tennis Association**.

## Project Overview

- **Strapi Version**: 5.28.0
- **Database**: SQLite (configurable to MySQL/PostgreSQL)
- **Features**: i18n enabled (de-AT, en), custom locale resolution middleware
- **Content Types**: Article, Author, Category, News, Page, Event (includes Tournaments and other events), Sponsor, Organizer, Location, Menu, Global
- **Project Type**: Table Tennis Association Website

---

## 📋 Content Type Enhancements

### Enhance Existing Content Types
- [x] Refactor Tournament content type to Event content type (supports tournaments, training sessions, meetings, social events, etc.)
- [x] Add event type field to Event content type (tournament, training, meeting, social, workshop, etc.)
- [x] Add SEO fields to Event (meta description, keywords)
- [x] Add relationship between News and Author (currently just a string field)
- [x] Add draft/publish functionality to Article (currently disabled)
- [x] Add custom validation rules to Event date fields (endDate must be after startDate)
- [x] Add featured/priority sorting to Event content type
- [x] Enhance Sponsor with tier levels (gold, silver, bronze)
- [x] Add table tennis specific fields to Event for tournament types (match format, age categories, skill levels)
- [x] Add event-specific fields (registration required, max participants, registration deadline, event capacity)
- [x] Enhance Location with table tennis specific details (number of tables, venue type, accessibility)
- [x] Add player categories to Event for tournament types (men's, women's, youth, veteran, doubles)
- [x] Add event category/classification system (competitive, social, training, administrative)

### Component Improvements
- [x] Add a "Call to Action" component with button, link, and text
- [x] Add an "Event Schedule" component with dates and times (works for tournaments, training sessions, meetings, etc.)
- [x] Create an "Event Calendar" component for displaying upcoming events of all types
- [x] Add an "Event Registration" component for events requiring sign-up

---

## 🔌 API Customization & Endpoints

### Custom Controllers
- [x] Add search functionality to Article controller (full-text search)
- [x] Create a custom endpoint for getting featured articles
- [x] Add filtering by date range for Event controller
- [x] Add filtering by event type for Event controller (tournament, training, meeting, social, etc.)
- [x] Create an endpoint to get related articles based on category/tags
- [x] Add pagination helper to Article controller
- [x] Create a statistics endpoint that aggregates data (article count, event count, tournament count, active members, upcoming matches, etc.)
- [x] Add custom sorting options (popular, recent, alphabetical)
- [x] Create an endpoint to get upcoming events (all types or filtered by type)
- [x] Create an endpoint to get upcoming tournaments only (filtered by event type)
- [x] Create an endpoint to get events by category (competitive, social, training, administrative)

### API Response Formatting
- [x] Standardize API response format across all endpoints
- [x] Add custom error handling and error messages

---

## 🌍 Internationalization (i18n)

### Locale Enhancements
- [x] Add fallback locale handling for missing translations
- [x] Create a locale switcher utility
- [x] Add locale detection from browser headers

### Content Localization
- [x] Enable i18n for all content types that need it (utilities and API endpoints created)
- [x] Add locale-specific SEO metadata (SEO component supports i18n)
- [x] Create translation management helpers
- [x] Add bulk translation import/export

---

## ⚡ Performance Optimization

### Database & Queries
- [ ] Optimize populate queries (avoid over-populating)

---

## ✅ Validation & Data Integrity

### Custom Validations
- [ ] Add email format validation for Author email field
- [ ] Create URL validation for Sponsor URLs
- [ ] Add date range validation (endDate > startDate for Event)
- [ ] Validate slug uniqueness across locales
- [ ] Add required field validation rules

---

## 🔧 Custom Middleware & Utilities

### Middleware Development
- [ ] Enhance locale resolution middleware with more options
- [ ] Create authentication middleware for protected routes
- [ ] Add request logging middleware
- [ ] Create response compression middleware
- [ ] Add custom error handling middleware

### Utility Functions
- [ ] Create date formatting utilities
- [ ] Add slug generation helper
- [ ] Create pagination utility functions
- [ ] Add validation helper utilities
- [ ] Create email template utilities

---

## 🎨 Admin Panel Customization

### Admin Enhancements
- [ ] Customize admin panel theme/branding
- [ ] Add custom fields/widgets to admin
- [ ] Create custom admin views for specific content types
- [ ] Add bulk operations (bulk delete, bulk publish)
- [ ] Create admin dashboard with statistics

### Content Management
- [ ] Add content preview functionality
- [ ] Create content scheduling system
- [ ] Add content versioning/history
- [ ] Implement content approval workflow
- [ ] Create content templates

---

## 🧪 Testing & Quality Assurance

### Code Quality
- [ ] Set up Prettier for code formatting

---

## 🔗 Integration & Webhooks

### Third-party Integrations
- [ ] Add calendar integration (Google Calendar, iCal) for event schedules (tournaments, training sessions, meetings, etc.)

### Webhooks
- [ ] Set up webhooks for content creation/updates
- [ ] Create event registration webhooks (for tournaments and other events)
- [ ] Add email notification webhooks
- [ ] Create custom webhook endpoints


---

## 🎯 Specific Feature Requests

### Event Features (General)
- [ ] Add event registration API (works for tournaments, training sessions, meetings, etc.)
- [ ] Create event calendar view API (upcoming, past, by date range)
- [ ] Add event type filtering (tournament, training, meeting, social, workshop, etc.)
- [ ] Add event category filtering (competitive, social, training, administrative)

### Content & News Features
- [ ] Create newsletter subscription for association updates

---

## 💡 Quick Wins (Easy Improvements)

- [ ] Add `.env.example` file with all required variables
- [ ] Add API response examples to README
- [ ] Create seed data script improvements
- [ ] Create development setup script
- [ ] Improve error messages in API responses

---

## 📌 Notes

- **Project Type**: Table Tennis Association Website
- This project uses Strapi 5.28.0 with i18n support
- Current default locale: `de-AT`
- Available locales: `de-AT`, `en`
- Database: SQLite (configurable to MySQL/PostgreSQL)
- Custom middleware for locale resolution is already implemented
- Event controller has custom populate logic (supports tournaments and other event types)
- Content types are designed for sports association needs (events including tournaments, training sessions, meetings, social events, news, members, results)
- **Event Types Supported**: Tournament, Training Session, Meeting, Social Event, Workshop, Administrative Event, etc.

---

**How to Use This List:**
1. Pick any item from the list and share it with me
2. I'll help you implement it step by step
3. We can customize any item based on your specific needs
4. Feel free to combine multiple items for a feature request

Let's build something amazing together! 🚀

