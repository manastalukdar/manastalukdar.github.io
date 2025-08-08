workspaceFolder :=

# https://gist.github.com/sighingnow/deee806603ec9274fd47
ifneq ($(OS),Windows_NT)
	workspaceFolder = ./
endif

# Topic Extraction System
# =====================

# Setup Commands
setup-topics:
	@echo "Setting up topic extraction system..."
	./scripts/setup-topic-extraction.sh

setup-topics-force:
	@echo "Force setting up topic extraction system..."
	./scripts/setup-topic-extraction.sh --force

# Update Commands
update-topics-and-metadata:
	@echo "Updating topics and metadata (full processing)..."
	./scripts/update-blog-metadata.sh

update-metadata-only:
	@echo "Updating blog metadata only (skip topic discovery)..."
	./scripts/update-blog-metadata.sh --metadata-only

update-metadata-minimal:
	@echo "Updating blog metadata with minimal processing (skip topics entirely)..."
	./scripts/update-blog-metadata.sh --metadata-only --skip-topics

update-metadata-incremental:
	@echo "Updating blog metadata incrementally (changed posts only)..."
	./scripts/update-blog-metadata.sh --metadata-only --incremental

update-topics-only:
	@echo "Updating topic discovery only (skip metadata generation)..."
	./scripts/update-blog-metadata.sh --discovery-only

update-topics-metadata-force:
	@echo "Force updating all topics and metadata..."
	./scripts/update-blog-metadata.sh --force

update-topic-config:
	@echo "Updating topic configuration from blog content analysis..."
	./scripts/update-blog-metadata.sh --update-config

# Build Integration
build-with-topics:
	@echo "Building website with updated topics..."
	./scripts/update-blog-metadata.sh
	cd website && npm run build

generate-with-topics:
	@echo "Generating static site with updated topics..."
	./scripts/update-blog-metadata.sh
	cd website && npm run generate

# Development Commands
dev-with-topics:
	@echo "Starting development server with updated topics..."
	./scripts/update-blog-metadata.sh --metadata-only
	cd website && npm run dev

dev-fast:
	@echo "Starting development server with minimal topic processing..."
	./scripts/update-blog-metadata.sh --metadata-only --skip-topics
	cd website && npm run dev

# CI-Optimized Commands
ci-setup:
	@echo "Setting up topic extraction for CI (skip discovery)..."
	./scripts/setup-topic-extraction.sh --skip-discovery

ci-metadata-minimal:
	@echo "Generating minimal metadata for CI (no topic processing)..."
	./scripts/update-blog-metadata.sh --metadata-only --skip-topics

ci-metadata-full:
	@echo "Generating full metadata with topic discovery for CI..."
	./scripts/update-blog-metadata.sh

ci-build:
	@echo "Building for CI with optimized metadata..."
	./scripts/update-blog-metadata.sh --metadata-only --skip-topics
	cd website && npm run generate

test-topics:
	@echo "Testing topic extraction system..."
	source .venv/bin/activate && python website/scripts/setup_models.py --action test_system --verbose

test-metadata-flags:
	@echo "Testing new metadata generation flags..."
	@echo "1. Testing minimal metadata generation..."
	./scripts/update-blog-metadata.sh --metadata-only --skip-topics
	@echo "2. Testing incremental metadata generation..."
	./scripts/update-blog-metadata.sh --metadata-only --incremental
	@echo "✅ All new flags tested successfully"

validate-ci-setup:
	@echo "Validating CI setup and commands..."
	@echo "1. Testing CI setup..."
	./scripts/setup-topic-extraction.sh --skip-discovery
	@echo "2. Testing minimal metadata for CI..."
	./scripts/update-blog-metadata.sh --metadata-only --skip-topics
	@echo "✅ CI setup validation complete"

# Python Dependency Management
# =============================

# Check for Python package updates (like ncu for npm)
check-python-updates:
	@echo "Checking for Python package updates..."
	@bash -c "source .venv/bin/activate && pur -r website/scripts/python-requirements.txt --dry-run"

# Update Python packages (interactive)
update-python-interactive:
	@echo "Updating Python packages interactively..."
	@bash -c "source .venv/bin/activate && pur -r website/scripts/python-requirements.txt --interactive"

# Update Python packages (all)
update-python:
	@echo "Updating all Python packages..."
	@bash -c "source .venv/bin/activate && pur -r website/scripts/python-requirements.txt"

# Update only specific Python packages
update-python-specific:
	@echo "Usage: make update-python-specific PACKAGES='package1,package2'"
	@if [ -z "$(PACKAGES)" ]; then \
		echo "Error: Please specify PACKAGES='package1,package2'"; \
		exit 1; \
	fi
	@bash -c "source .venv/bin/activate && pur -r website/scripts/python-requirements.txt --only $(PACKAGES)"

# Update only minor versions for critical packages
update-python-minor:
	@echo "Updating Python packages (minor versions only for critical packages)..."
	@bash -c "source .venv/bin/activate && pur -r website/scripts/python-requirements.txt --minor torch,transformers,sentence-transformers"

# Update only patch versions for critical packages
update-python-patch:
	@echo "Updating Python packages (patch versions only for critical packages)..."
	@bash -c "source .venv/bin/activate && pur -r website/scripts/python-requirements.txt --patch torch,transformers,sentence-transformers,numpy"

# Utility Commands
clean-topics:
	@echo "Cleaning generated topic models and backups..."
	rm -f website/config/topic_models/*.pkl
	rm -f website/config/topic_models/discovered_topics.json
	rm -f website/config/topic_models/*_backup_*.json
	@echo "Topic models cleaned"

backup-topics:
	@echo "Creating manual backup of topic models..."
	@if [ -f "website/config/topic_models/discovered_topics.json" ]; then \
		timestamp=$$(date +%Y%m%d_%H%M%S); \
		cp website/config/topic_models/discovered_topics.json "website/config/topic_models/discovered_topics_manual_backup_$$timestamp.json"; \
		echo "Backup created: discovered_topics_manual_backup_$$timestamp.json"; \
	else \
		echo "No topic models found to backup"; \
	fi

# Website Commands (existing patterns from CLAUDE.md)
dev:
	cd website && npm run dev

build:
	cd website && npm run build

generate:
	cd website && npm run generate

preview:
	cd website && npm run preview

clean:
	cd website && npm run clean

install:
	cd website && npm install

postinstall:
	cd website && npm run postinstall

lint-fix:
	cd website && node node_modules/eslint/bin/eslint.js --fix ./app/pages/**

# Help
help:
	@echo "Available commands:"
	@echo ""
	@echo "Topic Extraction:"
	@echo "  setup-topics               - Initial setup of topic extraction system"
	@echo "  setup-topics-force         - Force complete regeneration of all models"
	@echo "  update-topics-and-metadata - Full processing (topics + metadata)"
	@echo "  update-metadata-only       - Metadata only (skip topic discovery)"
	@echo "  update-metadata-minimal    - Minimal metadata (skip topics entirely)"
	@echo "  update-metadata-incremental - Incremental (changed posts only)"
	@echo "  update-topics-only         - Topic discovery only (skip metadata)"
	@echo "  update-topics-force        - Force complete regeneration"
	@echo "  update-topic-config     - Update topic config from content analysis"
	@echo "  build-with-topics       - Build website with updated topics"
	@echo "  generate-with-topics    - Generate static site with updated topics"
	@echo "  dev-with-topics         - Start dev server with updated topics"
	@echo "  dev-fast                - Start dev server with minimal processing"
	@echo "  test-topics             - Validate topic extraction system"
	@echo "  test-metadata-flags     - Test new metadata generation flags"
	@echo "  validate-ci-setup       - Validate CI setup and commands"
	@echo "  clean-topics            - Clean generated topic models"
	@echo "  backup-topics           - Create manual backup of models"
	@echo ""
	@echo "CI-Optimized Commands:"
	@echo "  ci-setup                - Setup for CI (no discovery)"
	@echo "  ci-metadata-minimal     - Minimal metadata for CI"
	@echo "  ci-metadata-full        - Full metadata with discovery for CI"
	@echo "  ci-build                - Optimized CI build with minimal processing"
	@echo ""
	@echo "Python Dependency Management:"
	@echo "  check-python-updates        - Check for Python package updates (like ncu)"
	@echo "  update-python-interactive   - Update Python packages interactively"
	@echo "  update-python               - Update all Python packages"
	@echo "  update-python-specific      - Update specific packages (set PACKAGES='pkg1,pkg2')"
	@echo "  update-python-minor         - Update minor versions only for critical packages"
	@echo "  update-python-patch         - Update patch versions only for critical packages"
	@echo ""
	@echo "Website Development:"
	@echo "  dev                  - Start development server"
	@echo "  build                - Build the application"
	@echo "  generate             - Generate static site"
	@echo "  preview              - Preview the built site"
	@echo "  clean                - Clean build artifacts"
	@echo "  install              - Install dependencies"
	@echo "  postinstall          - Run post-install tasks"
	@echo "  lint-fix             - Fix ESLint issues in pages"
	@echo ""
	@echo "Legacy:"
	@echo "  backend              - WIP"
	@echo "  cli                  - WIP"
	@echo "  frontend             - WIP"
	@echo "  all                  - Run backend, cli, frontend"

.PHONY: backend cli frontend all setup-topics setup-topics-force update-topics-and-metadata update-metadata-only update-metadata-minimal update-metadata-incremental update-topics-only update-topics-force update-topic-config build-with-topics generate-with-topics dev-with-topics dev-fast ci-setup ci-metadata-minimal ci-metadata-full ci-build test-topics test-metadata-flags validate-ci-setup check-python-updates update-python-interactive update-python update-python-specific update-python-minor update-python-patch clean-topics backup-topics dev build generate preview clean install postinstall lint-fix help
