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
	./setup-topic-extraction.sh

setup-topics-force:
	@echo "Force setting up topic extraction system..."
	./setup-topic-extraction.sh --force

# Update Commands
update-topics-metadata:
	@echo "Updating topic extraction (smart update) and blog metadata..."
	./update-blog-metadata.sh

update-metadata:
	@echo "Updating blog metadata only (fast)..."
	./update-blog-metadata.sh --metadata-only

update-topic-discovery:
	@echo "Updating topic discovery only..."
	./update-blog-metadata.sh --discovery-only

update-topics-metadata-force:
	@echo "Force updating all topics and metadata..."
	./update-blog-metadata.sh --force

update-topic-config:
	@echo "Updating topic configuration from blog content analysis..."
	./update-blog-metadata.sh --update-config

# Build Integration
build-with-topics:
	@echo "Building website with updated topics..."
	./update-blog-metadata.sh
	cd website && npm run build

generate-with-topics:
	@echo "Generating static site with updated topics..."
	./update-blog-metadata.sh
	cd website && npm run generate

# Development Commands
dev-with-topics:
	@echo "Starting development server with updated topics..."
	./update-blog-metadata.sh --metadata-only
	cd website && npm run dev

test-topics:
	@echo "Testing topic extraction system..."
	source .venv/bin/activate && python website/scripts/setup_models.py --action test_system --verbose

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
	@echo "  setup-topics         - Initial setup of topic extraction system"
	@echo "  setup-topics-force   - Force complete regeneration of all models"
	@echo "  update-topics        - Smart update (only regenerates what's needed)"
	@echo "  update-metadata      - Fast metadata-only update"
	@echo "  update-discovery     - Topic discovery only"
	@echo "  update-topics-force  - Force complete regeneration"
	@echo "  update-topic-config  - Update topic config from content analysis"
	@echo "  build-with-topics    - Build website with updated topics"
	@echo "  generate-with-topics - Generate static site with updated topics"
	@echo "  dev-with-topics      - Start dev server with updated topics"
	@echo "  test-topics          - Validate topic extraction system"
	@echo "  clean-topics         - Clean generated topic models"
	@echo "  backup-topics        - Create manual backup of models"
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

.PHONY: backend cli frontend all setup-topics setup-topics-force update-topics update-metadata update-discovery update-topics-force build-with-topics generate-with-topics dev-with-topics test-topics clean-topics backup-topics dev build generate preview clean install postinstall lint-fix help
