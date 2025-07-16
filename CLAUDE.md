# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build and Development

- `cd website && npm run dev` - Start development server
- `cd website && npm run build` - Build the application
- `cd website && npm run generate` - Generate static site
- `cd website && npm run preview` - Preview the built site
- `cd website && npm run clean` - Clean build artifacts

### Linting

- `cd website && node node_modules/eslint/bin/eslint.js --fix ./app/pages/**` - Fix ESLint issues in pages

### Dependencies

- `cd website && npm install` - Install dependencies
- `cd website && npm run postinstall` - Run post-install tasks

## Project Architecture

This is a personal website and blog built with Nuxt 4 and Vue 3. The main application lives in the `website/` directory.

### Key Directory Structure

- `website/` - Main Nuxt 4 application
  - `app/` - **New Nuxt 4 structure** - Contains client-side code
    - `components/` - Vue components organized by feature (about, blog, home-page, etc.)
    - `pages/` - File-based routing with dynamic blog post pages
    - `layouts/` - Layout components
    - `plugins/` - Client-side plugins
    - `stores/` - Pinia stores for state management
    - `utils/` - Utility functions and helpers
    - `composables/` - Vue composables
    - `style/` - SCSS style files
    - `app.vue` - Main app component
  - `public/` - Static assets and generated blog content
  - `server/` - Server-side code (API routes, etc.)
  - `nuxt.config.ts` - Main configuration file

- `blog/` - Blog post source files in markdown format, organized by year/month/day
- `documentation/` - Project documentation
- `public/blogdata/` - Mirror of blog content for static generation

### Technology Stack

- **Framework**: Nuxt 4 with Vue 3
- **UI**: Vuetify 3 with Material Design Icons
- **State Management**: Pinia
- **Styling**: SCSS with Vuetify
- **Content**: Markdown with markdown-it plugins
- **Build**: Vite (via Nuxt 4)
- **PWA**: @vite-pwa/nuxt (replaces deprecated @kevinmarrec/nuxt-pwa)

### Blog System Architecture

- Blog posts are stored as markdown files in `blog/YYYY/MM/DD/post-name/readme.md`
- A Python script (`website/scripts/create_blog_metadata.py`) generates metadata
- Static routes are generated dynamically based on blog post structure
- RSS feed generation is handled in the build process

### Key Configuration Files

- `website/nuxt.config.ts` - Main Nuxt configuration with PWA, sitemap, and feed generation
- `website/package.json` - Dependencies and build scripts
- `website/vetur.config.js` - Vue tooling configuration

### Development Notes

- The site is deployed to GitHub Pages from the `source` branch
- Blog posts use a specific markdown format with frontmatter
- The build process generates static files and RSS feeds
- PWA functionality is configured for offline access

### Migration to Nuxt 4 (July 2025) - COMPLETED ✅

- **Status**: COMPLETE - Full migration to Nuxt 4 with new app directory structure
- **Node.js Version**: Using Node.js 24.4.1 (compatible with Nuxt 4 requirements)
- **Modules**: All modules updated and working:
  - Replaced `nuxt-simple-sitemap` with `@nuxtjs/sitemap`
  - Updated `@kevinmarrec/nuxt-pwa` to `@vite-pwa/nuxt` 
  - `nuxt-gtag` updated and working
- **New Structure**: All client-side code successfully moved to `app/` directory
- **Import Paths**: All relative imports updated to use `~/` alias for better compatibility
- **Build Status**: Build and generate processes working successfully

### CI/CD

- GitHub Actions handle build and deployment
- ESLint and other linting tools are configured
- Multiple CI providers are used (GitHub Actions, CircleCI)
