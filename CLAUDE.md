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

- `cd website && node node_modules/eslint/bin/eslint.js --fix ./pages/**` - Fix ESLint issues in pages

### Dependencies

- `cd website && npm install` - Install dependencies
- `cd website && npm run postinstall` - Run post-install tasks

## Project Architecture

This is a personal website and blog built with Nuxt 3 and Vue 3. The main application lives in the `website/` directory.

### Key Directory Structure

- `website/` - Main Nuxt 3 application
  - `components/` - Vue components organized by feature (about, blog, home-page, etc.)
  - `pages/` - File-based routing with dynamic blog post pages
  - `public/` - Static assets and generated blog content
  - `stores/` - Pinia stores for state management
  - `utils/` - Utility functions and helpers
  - `nuxt.config.ts` - Main configuration file

- `blog/` - Blog post source files in markdown format, organized by year/month/day
- `documentation/` - Project documentation
- `public/blogdata/` - Mirror of blog content for static generation

### Technology Stack

- **Framework**: Nuxt 3 with Vue 3
- **UI**: Vuetify 3 with Material Design Icons
- **State Management**: Pinia
- **Styling**: SCSS with Vuetify
- **Content**: Markdown with markdown-it plugins
- **Build**: Vite (via Nuxt 3)

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

### CI/CD

- GitHub Actions handle build and deployment
- ESLint and other linting tools are configured
- Multiple CI providers are used (GitHub Actions, CircleCI)
