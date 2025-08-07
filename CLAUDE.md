# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build and Development

- `cd website && npm run dev` - Start development server
- `cd website && npm run build` - Build the application
- `cd website && npm run generate` - Generate static site
- `cd website && npm run preview` - Preview the built site
- `cd website && npm run clean` - Clean build artifacts
- `cd website && npm run generate-search-index` - Generate search index for blog posts

### Topic Extraction & AI Features

- `./scripts/setup-topic-extraction.sh` - Setup ML-based topic extraction system
- `./scripts/update-blog-metadata.sh` - Update blog metadata including topics
- Python scripts in `website/scripts/` for advanced topic analysis and generation:
  - `transformer_topic_extraction.py` - **NEW** Unified transformer-based approach
  - `enhanced_topic_extraction.py` - Enhanced hybrid static/dynamic method
  - `topic_discovery.py` - Traditional scikit-learn clustering

### Linting

- `cd website && node node_modules/eslint/bin/eslint.js --fix ./app/pages/**` - Fix ESLint issues in pages

### Dependencies

- `cd website && npm install` - Install dependencies
- `cd website && npm run postinstall` - Run post-install tasks

## Project Architecture

This is a personal website and blog built with Nuxt 4 and Vue 3. The main application lives in the `website/` directory.

### Key Directory Structure

- `website/` - Main Nuxt 4 application
  - `app/` - **Nuxt 4 structure** - Contains client-side code
    - `components/` - Vue components organized by feature (about, blog, home-page, etc.)
    - `pages/` - File-based routing with dynamic blog post pages
    - `layouts/` - Layout components
    - `plugins/` - Client-side plugins (includes error handlers)
    - `stores/` - Pinia stores for state management
    - `utils/` - Utility functions and helpers (including topic extraction)
    - `composables/` - Vue composables
    - `style/` - SCSS style files
    - `app.vue` - Main app component
  - `config/` - Configuration files including topic extraction data
  - `public/` - Static assets and generated blog content
  - `scripts/` - Python scripts for topic extraction, metadata generation
  - `server/` - Server-side code (API routes, sitemap, RSS feed)
  - `nuxt.config.ts` - Main configuration file
  - `tsconfig.json` - TypeScript configuration with strict mode
  - `volar.config.js` - Vue tooling configuration

- `blog/` - Blog post source files in markdown format, organized by year/month/day
- `documentation/` - Project documentation
- `scripts/` - Root-level shell scripts for setup and maintenance
- `public/blogdata/` - Mirror of blog content for static generation

### Technology Stack

- **Framework**: Nuxt 4.0.1 with Vue 3.5.18
- **UI**: Vuetify 3.9.2 with Material Design Icons
- **State Management**: Pinia 3.0.3
- **Styling**: SCSS with Vuetify, Sass 1.89.2
- **Content**: Markdown with markdown-it plugins and enhanced processing
- **Build**: Vite (via Nuxt 4) with Webpack 5.100.2 support
- **PWA**: @vite-pwa/nuxt 1.0.4 (modern PWA solution)
- **AI/ML**: @xenova/transformers 2.17.2 for search + sentence-transformers for unified topic extraction
- **TypeScript**: Strict mode enabled with enhanced type checking

### Blog System Architecture

- Blog posts are stored as markdown files in `blog/YYYY/MM/DD/post-name/readme.md`
- Python scripts generate enhanced metadata with unified AI-powered topic extraction:
  - `website/scripts/create_blog_metadata.py` - Core metadata generation with hybrid extraction
  - `website/scripts/transformer_topic_extraction.py` - **NEW** Unified transformer-based extraction
  - `website/scripts/enhanced_topic_extraction.py` - Enhanced hybrid static/dynamic analysis
  - `website/scripts/topic_discovery.py` - Traditional clustering for fallback
- Static routes are generated dynamically based on blog post structure
- RSS feed and sitemap generation handled via Nuxt hooks
- Search index generation for full-text blog search
- JSON-LD structured data for enhanced SEO

### Key Configuration Files

- `website/nuxt.config.ts` - Main Nuxt configuration with PWA, sitemap, feed, and prerendering
- `website/package.json` - Dependencies and build scripts
- `website/tsconfig.json` - TypeScript configuration with strict compilation
- `website/volar.config.js` - Vue tooling configuration
- `website/config/topic-extraction-data.json` - ML topic extraction configuration
- `renovate.json` - Dependency update automation
- `.github/workflows/main.yml` - CI/CD with topic extraction automation

### Development Notes

- The site is deployed to GitHub Pages from the `source` branch
- Blog posts use a specific markdown format with frontmatter and AI-generated topics
- The build process generates static files, RSS feeds, search index, and structured data
- PWA functionality is configured for offline access with service worker
- Content is licensed under CC BY-NC-ND 4.0 with AI training restrictions
- Enhanced SEO with comprehensive meta tags and OpenGraph data
- TypeScript strict mode enabled for better code quality

### AI-Powered Content Features ✨

- **Unified Topic Extraction**: Transformer-based semantic analysis using same embeddings as search
- **Multi-Tier AI System**: 
  - Primary: Sentence transformers with semantic similarity
  - Fallback: Enhanced hybrid static/dynamic method
  - Final fallback: Traditional TF-IDF + clustering
- **Semantic Consistency**: Same `all-MiniLM-L6-v2` model for search and topic analysis
- **Advanced Topic Discovery**: BERTopic integration for automatic topic modeling
- **Smart Content Licensing**: CC BY-NC-ND 4.0 with machine-readable AI training policies
- **Enhanced SEO**: JSON-LD structured data and comprehensive meta tags
- **Content Discovery**: Advanced search with semantic similarity and topic-based filtering
- **Automated Workflows**: GitHub Actions with weekly topic discovery and model caching

### Content Licensing & AI Policy

- **License**: CC BY-NC-ND 4.0 (Creative Commons Attribution-NonCommercial-NoDerivatives)
- **AI Training Policy**: Non-commercial use only with explicit restrictions
- **Machine-Readable Policies**: HTML meta tags and robots.txt directives
- **Content Protection**: Comprehensive AI bot blocking in robots.txt
- **Legal Documentation**: Detailed policies in `/legal` section

### CI/CD & Automation

- **GitHub Actions**: Build, deployment, and automated topic extraction
- **Scheduled Tasks**: Weekly topic discovery runs on Sundays at 2 AM UTC
- **Workflow Dispatch**: Manual trigger with configurable topic extraction modes
- **Multi-Environment**: Python 3.12 and Node.js latest versions
- **Caching**: Intelligent caching for topic models and dependencies
- **Error Handling**: Client and server-side error handlers
- **Quality Tools**: ESLint, TypeScript strict mode, and automated testing
