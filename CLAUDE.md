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

### Performance & Icon System

- `cd website && npm run build` - **CRITICAL**: Always run build to verify no font dependencies after icon changes
- Icon Usage: Use `<TreeShakenIcon icon="mdi-icon-name" />` instead of `<v-icon>mdi-icon-name</v-icon>`
- Font Management: All font changes must be made in `app/config/fonts.ts` (single source of truth)
- Icon Audit: `grep -r "mdi-" app/` to find any remaining MDI font references that need conversion

### Dependencies

**Node.js Dependencies:**
- `cd website && npm install` - Install dependencies
- `cd website && npm run postinstall` - Run post-install tasks

**Python Dependencies:**
- `make check-python-updates` - Check for Python package updates (equivalent to `ncu` for npm)
- `make update-python-interactive` - Update Python packages interactively with prompts
- `make update-python` - Update all Python packages in requirements.txt
- `make update-python-specific PACKAGES='numpy,torch'` - Update only specific packages
- `make update-python-minor` - Update minor versions only for critical packages
- `make update-python-patch` - Update patch versions only for critical packages

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
  - `config/` - Configuration files including topic extraction data and centralized font configuration
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
- **UI**: Vuetify 3.9.2 with Tree-Shaken Icon System (TreeShakenIcon components)
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
- `website/app/config/fonts.ts` - Centralized font management system (single source of truth)
- `website/app/components/TreeShakenIcon.vue` - Tree-shaken icon component system
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
- **Performance Optimized**: Complete icon tree-shaking system eliminates 3.6MB font dependencies
- **Centralized Font Management**: Single source of truth for all font configurations

### Performance Optimization & Icon System 🚀

- **Tree-Shaken Icons**: Custom TreeShakenIcon component system eliminates font dependencies
- **Bundle Size Reduction**: 3.6MB Material Design Icons font dependency completely eliminated
- **Vuetify Compatibility**: TreeShakenIcon supports all Vuetify size mappings (x-small=12px, small=16px, etc.)
- **Zero Regressions**: All icon functionality maintained while achieving 100% font elimination
- **Centralized Font Config**: Single source of truth at `app/config/fonts.ts` controls all font settings
- **Performance Phases Completed**:
  - ✅ Phase 1: CSS Bundle Reduction (41.3% reduction)
  - ✅ Phase 2: Font Loading Optimization (99.5% reduction)
  - ✅ Phase 3: Dynamic Component Loading (ML models lazy-loaded)
  - ✅ Phase 4: Blog & Search Tree-Shaking (110+ icons converted)
  - ✅ Phase 5: Image Optimization Pipeline (infrastructure complete)
  - ✅ Phase 6: Complete Icon Tree-Shaking (3.6MB font elimination)

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
