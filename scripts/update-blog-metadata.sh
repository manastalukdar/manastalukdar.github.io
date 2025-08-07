#!/bin/bash

##############################################################################
# Enhanced Topic Extraction System - Quick Update Script
# 
# This script quickly regenerates topics and metadata without full setup.
# Use this when:
# - Blog content has changed and you want to update topic classifications
# - You want to regenerate metadata with current models
# - Dependencies are already installed
#
# Usage:
#   ./update-topics.sh [options]
#
# Options:
#   --metadata-only      Generate metadata only (skip topic discovery)
#   --discovery-only     Run topic discovery only (skip metadata generation)
#   --force              Force regeneration even if files are recent
#   --blog-folder PATH   Custom path to blog folder
#   --help               Show this help message
##############################################################################

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VENV_PATH="$PROJECT_ROOT/.venv"
BLOG_FOLDER="$PROJECT_ROOT/blog"
WEBSITE_DIR="$PROJECT_ROOT/website"
SCRIPTS_DIR="$WEBSITE_DIR/scripts"
CONFIG_DIR="$WEBSITE_DIR/config"
MODELS_DIR="$CONFIG_DIR/topic_models"
METADATA_FILE="$WEBSITE_DIR/public/blogdata/metadata/blog_metadata.json"

# Command line options
METADATA_ONLY=false
DISCOVERY_ONLY=false
FORCE_REGENERATION=false
UPDATE_CONFIG=false
CUSTOM_BLOG_FOLDER=""
SHOW_HELP=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --metadata-only)
            METADATA_ONLY=true
            shift
            ;;
        --discovery-only)
            DISCOVERY_ONLY=true
            shift
            ;;
        --force)
            FORCE_REGENERATION=true
            shift
            ;;
        --update-config)
            UPDATE_CONFIG=true
            shift
            ;;
        --blog-folder)
            CUSTOM_BLOG_FOLDER="$2"
            shift 2
            ;;
        --help)
            SHOW_HELP=true
            shift
            ;;
        *)
            echo -e "${RED}Error: Unknown option $1${NC}"
            SHOW_HELP=true
            shift
            ;;
    esac
done

# Show help if requested
if [ "$SHOW_HELP" = true ]; then
    echo "Enhanced Topic Extraction System - Quick Update"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --metadata-only      Generate metadata only (skip topic discovery)"
    echo "  --discovery-only     Run topic discovery only (skip metadata generation)"
    echo "  --force              Force regeneration even if files are recent"
    echo "  --update-config      Update topic configuration from blog content analysis"
    echo "  --blog-folder PATH   Custom path to blog folder"
    echo "  --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                            # Update both topics and metadata"
    echo "  $0 --metadata-only            # Only regenerate metadata (faster)"
    echo "  $0 --discovery-only           # Only discover new topics"
    echo "  $0 --update-config            # Update topic configuration from content"
    echo "  $0 --force                    # Force complete regeneration"
    echo ""
    echo "Note: This script assumes the system is already set up."
    echo "If you need to set up the system, use: ./scripts/setup-topic-extraction.sh"
    echo ""
    exit 0
fi

# Use custom blog folder if provided
if [ -n "$CUSTOM_BLOG_FOLDER" ]; then
    BLOG_FOLDER="$CUSTOM_BLOG_FOLDER"
fi

# Utility functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Check if system is set up
check_prerequisites() {
    log_step "Checking prerequisites..."
    
    # Check if virtual environment exists
    if [ ! -d "$VENV_PATH" ]; then
        log_error "Virtual environment not found at $VENV_PATH"
        echo "Please run ./scripts/setup-topic-extraction.sh first to set up the system"
        exit 1
    fi
    
    # Check if virtual environment has required packages
    source "$VENV_PATH/bin/activate"
    python -c "import sklearn, nltk, numpy, scipy" 2>/dev/null || {
        log_error "Required Python packages not found in virtual environment"
        echo "Please run ./scripts/setup-topic-extraction.sh to install dependencies"
        exit 1
    }
    
    # Check if scripts directory exists
    if [ ! -d "$SCRIPTS_DIR" ]; then
        log_error "Scripts directory not found: $SCRIPTS_DIR"
        exit 1
    fi
    
    # Check if blog folder exists
    if [ ! -d "$BLOG_FOLDER" ]; then
        log_error "Blog folder not found: $BLOG_FOLDER"
        echo "Use --blog-folder option to specify the correct path"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Check if regeneration is needed
should_regenerate_topics() {
    if [ "$FORCE_REGENERATION" = true ]; then
        return 0  # Force regeneration
    fi
    
    local topics_file="$MODELS_DIR/discovered_topics.json"
    
    # If topics file doesn't exist, regeneration is needed
    if [ ! -f "$topics_file" ]; then
        return 0
    fi
    
    # Check if any blog posts are newer than the topics file
    local newest_blog_file=$(find "$BLOG_FOLDER" -name "*.md" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)
    
    if [ -n "$newest_blog_file" ] && [ "$newest_blog_file" -nt "$topics_file" ]; then
        log_info "Blog content is newer than existing topics - regeneration needed"
        return 0
    fi
    
    log_info "Existing topics are up to date"
    return 1  # No regeneration needed
}

# Check if metadata regeneration is needed
should_regenerate_metadata() {
    if [ "$FORCE_REGENERATION" = true ]; then
        return 0  # Force regeneration
    fi
    
    # If metadata file doesn't exist, regeneration is needed
    if [ ! -f "$METADATA_FILE" ]; then
        return 0
    fi
    
    # Check if topics file is newer than metadata
    local topics_file="$MODELS_DIR/discovered_topics.json"
    if [ -f "$topics_file" ] && [ "$topics_file" -nt "$METADATA_FILE" ]; then
        log_info "Topics are newer than metadata - regeneration needed"
        return 0
    fi
    
    # Check if any blog posts are newer than metadata
    local newest_blog_file=$(find "$BLOG_FOLDER" -name "*.md" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)
    
    if [ -n "$newest_blog_file" ] && [ "$newest_blog_file" -nt "$METADATA_FILE" ]; then
        log_info "Blog content is newer than metadata - regeneration needed"
        return 0
    fi
    
    log_info "Existing metadata is up to date"
    return 1  # No regeneration needed
}

# Update topic configuration from blog content analysis
update_topic_config() {
    log_step "Updating topic configuration from blog content analysis..."
    
    source "$VENV_PATH/bin/activate"
    
    log_info "Analyzing blog content for enhanced topic configuration..."
    
    # Capture output to show statistics
    local output
    if output=$(python "$SCRIPTS_DIR/generate_topic_config.py" --blog-folder "$BLOG_FOLDER" --config-folder "$CONFIG_DIR" --replace --verbose 2>&1); then
        echo "$output" | grep -E "(Generated|Enhanced|Posts analyzed)" || true
        
        log_success "Topic configuration updated successfully"
        
        # Show what was enhanced
        if [ -f "$CONFIG_DIR/topic-extraction-data.json" ]; then
            log_info "Enhanced topic configuration with content-specific terms"
        fi
        
        return 0
    else
        log_error "Topic configuration update failed:"
        echo "$output"
        return 1
    fi
}

# Create backup of existing files
create_backups() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    
    # Backup topics file
    if [ -f "$MODELS_DIR/discovered_topics.json" ]; then
        local backup_file="$MODELS_DIR/discovered_topics_backup_$timestamp.json"
        cp "$MODELS_DIR/discovered_topics.json" "$backup_file"
        log_info "Backed up existing topics to $backup_file"
    fi
    
    # Backup metadata file
    if [ -f "$METADATA_FILE" ]; then
        local backup_file="${METADATA_FILE%.*}_backup_$timestamp.json"
        cp "$METADATA_FILE" "$backup_file"
        log_info "Backed up existing metadata to $backup_file"
    fi
}

# Run topic discovery
run_topic_discovery() {
    log_step "Running topic discovery..."
    
    source "$VENV_PATH/bin/activate"
    
    log_info "Analyzing blog corpus and discovering topics..."
    
    # Capture the output to show statistics
    local output
    if output=$(python "$SCRIPTS_DIR/topic_discovery.py" 2>&1); then
        echo "$output" | grep -E "(Discovered|Processed|Topic [0-9]+:)" || true
        
        # Verify output files were created
        if [ ! -f "$MODELS_DIR/discovered_topics.json" ]; then
            log_error "Topic discovery did not generate discovered_topics.json"
            return 1
        fi
        
        log_success "Topic discovery completed successfully"
        
        # Show summary
        local topic_count=$(python -c "import json; data=json.load(open('$MODELS_DIR/discovered_topics.json')); print(len(data.get('discoveredTopics', {})))")
        local doc_count=$(python -c "import json; data=json.load(open('$MODELS_DIR/discovered_topics.json')); print(len(data.get('documentAssignments', [])))")
        log_info "Discovered $topic_count topics from $doc_count documents"
        
        return 0
    else
        log_error "Topic discovery failed:"
        echo "$output"
        return 1
    fi
}

# Generate metadata
generate_metadata() {
    log_step "Generating enhanced metadata..."
    
    source "$VENV_PATH/bin/activate"
    
    log_info "Generating metadata with enhanced topic classification..."
    
    # Capture output to show statistics
    local output
    if output=$(python "$SCRIPTS_DIR/create_blog_metadata.py" 2>&1); then
        echo "$output" | grep -E "(Extracted topics|Total posts|Blog metadata creation)" || true
        
        log_success "Enhanced metadata generation completed"
        
        # Show statistics if metadata file exists
        if [ -f "$METADATA_FILE" ]; then
            local post_count=$(python -c "import json; data=json.load(open('$METADATA_FILE')); print(len(data))" 2>/dev/null || echo "unknown")
            local dynamic_count=$(python -c "import json; data=json.load(open('$METADATA_FILE')); print(len([p for p in data if p.get('classification-method') == 'dynamic']))" 2>/dev/null || echo "unknown")
            log_info "Processed $post_count posts ($dynamic_count with dynamic classification)"
        fi
        
        return 0
    else
        log_error "Metadata generation failed:"
        echo "$output"
        return 1
    fi
}

# Show completion summary
show_completion_summary() {
    echo ""
    echo -e "${GREEN}✅ Topic Update Completed Successfully!${NC}"
    echo ""
    
    # Show what was updated
    local updated_items=()
    
    if [ "$DISCOVERY_ONLY" != true ]; then
        updated_items+=("Enhanced metadata with dynamic topic classification")
    fi
    
    if [ "$METADATA_ONLY" != true ]; then
        updated_items+=("Dynamic topic models from blog corpus analysis")
    fi
    
    if [ ${#updated_items[@]} -gt 0 ]; then
        echo "Updated:"
        for item in "${updated_items[@]}"; do
            echo "• $item"
        done
        echo ""
    fi
    
    # Show file locations
    echo "Generated files:"
    if [ "$METADATA_ONLY" != true ] && [ -f "$MODELS_DIR/discovered_topics.json" ]; then
        echo "• $MODELS_DIR/discovered_topics.json"
        echo "• $MODELS_DIR/tfidf_vectorizer.pkl"
        echo "• $MODELS_DIR/topic_clusters.pkl"
    fi
    if [ "$DISCOVERY_ONLY" != true ] && [ -f "$METADATA_FILE" ]; then
        echo "• $METADATA_FILE"
    fi
    echo ""
    
    # Show next steps
    echo "Next steps:"
    echo "• Your website build process will now use the updated topic classifications"
    echo "• Run this script again after adding new blog posts"
    echo "• Use ${BLUE}./scripts/setup-topic-extraction.sh --force${NC} for complete regeneration"
    echo ""
}

# Main execution
main() {
    echo ""
    echo -e "${PURPLE}Enhanced Topic Extraction System - Quick Update${NC}"
    echo -e "${PURPLE}===============================================${NC}"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Create backups
    create_backups
    
    # Handle config update mode
    if [ "$UPDATE_CONFIG" = true ]; then
        update_topic_config || {
            log_error "Topic configuration update failed - aborting"
            exit 1
        }
        log_success "Topic configuration updated successfully"
        exit 0
    fi
    
    # Determine what to do
    local need_discovery=false
    local need_metadata=false
    
    if [ "$METADATA_ONLY" = true ]; then
        need_metadata=true
        log_info "Metadata-only mode - skipping topic discovery"
    elif [ "$DISCOVERY_ONLY" = true ]; then
        need_discovery=true
        log_info "Discovery-only mode - skipping metadata generation"
    else
        # Check what needs updating
        if should_regenerate_topics; then
            need_discovery=true
        fi
        
        if should_regenerate_metadata; then
            need_metadata=true
        fi
    fi
    
    # Exit early if nothing needs updating
    if [ "$need_discovery" = false ] && [ "$need_metadata" = false ]; then
        log_success "Everything is up to date - no regeneration needed"
        echo "Use --force flag to force regeneration"
        exit 0
    fi
    
    # Run topic discovery if needed
    if [ "$need_discovery" = true ]; then
        run_topic_discovery || {
            log_error "Topic discovery failed - aborting update"
            exit 1
        }
    fi
    
    # Run metadata generation if needed
    if [ "$need_metadata" = true ]; then
        generate_metadata || {
            log_error "Metadata generation failed - aborting update"
            exit 1
        }
    fi
    
    # Show completion summary
    show_completion_summary
}

# Error handling
trap 'log_error "Update failed at line $LINENO. Check the error message above."; exit 1' ERR

# Run main function
main "$@"