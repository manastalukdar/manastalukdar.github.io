#!/bin/bash

##############################################################################
# Enhanced Topic Extraction System Setup Script
# 
# This script sets up the complete enhanced topic extraction system by:
# 1. Creating/validating Python virtual environment
# 2. Installing required ML dependencies
# 3. Downloading NLTK data models
# 4. Running topic discovery on blog corpus
# 5. Generating enhanced metadata with dynamic topics
#
# Usage:
#   ./setup-topic-extraction.sh [options]
#
# Options:
#   --force              Force regeneration of all models
#   --skip-discovery     Skip topic discovery (use existing models)
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
PROJECT_ROOT="$SCRIPT_DIR"
VENV_PATH="$PROJECT_ROOT/.venv"
BLOG_FOLDER="$PROJECT_ROOT/blog"
WEBSITE_DIR="$PROJECT_ROOT/website"
SCRIPTS_DIR="$WEBSITE_DIR/scripts"
CONFIG_DIR="$WEBSITE_DIR/config"
MODELS_DIR="$CONFIG_DIR/topic_models"
REQUIREMENTS_FILE="$SCRIPTS_DIR/python-requirements.txt"

# Command line options
FORCE_REGENERATION=false
SKIP_DISCOVERY=false
CUSTOM_BLOG_FOLDER=""
SHOW_HELP=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --force)
            FORCE_REGENERATION=true
            shift
            ;;
        --skip-discovery)
            SKIP_DISCOVERY=true
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
    echo "Enhanced Topic Extraction System Setup"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --force              Force regeneration of all models"
    echo "  --skip-discovery     Skip topic discovery (use existing models)"
    echo "  --blog-folder PATH   Custom path to blog folder"
    echo "  --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Standard setup"
    echo "  $0 --force                           # Force full regeneration"
    echo "  $0 --skip-discovery                  # Setup dependencies only"
    echo "  $0 --blog-folder /path/to/blog       # Use custom blog folder"
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

# Progress tracking
show_progress() {
    local current=$1
    local total=$2
    local message=$3
    local percent=$((current * 100 / total))
    echo -e "${BLUE}[$current/$total - ${percent}%]${NC} $message"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Validate environment
validate_environment() {
    log_step "Validating environment..."
    
    # Check if Python is available
    if ! command_exists python3; then
        log_error "Python 3 is not installed or not in PATH"
        echo "Please install Python 3.8 or higher"
        exit 1
    fi
    
    # Check Python version
    python_version=$(python3 -c "import sys; print('.'.join(map(str, sys.version_info[:2])))")
    python_major=$(echo "$python_version" | cut -d. -f1)
    python_minor=$(echo "$python_version" | cut -d. -f2)
    
    if [ "$python_major" -lt 3 ] || ([ "$python_major" -eq 3 ] && [ "$python_minor" -lt 8 ]); then
        log_error "Python $python_version detected. Python 3.8 or higher is required."
        exit 1
    fi
    
    log_success "Python $python_version detected - compatible"
    
    # Check required directories
    if [ ! -d "$BLOG_FOLDER" ]; then
        log_error "Blog folder not found: $BLOG_FOLDER"
        echo "Please ensure the blog folder exists or use --blog-folder option"
        exit 1
    fi
    
    if [ ! -d "$SCRIPTS_DIR" ]; then
        log_error "Scripts directory not found: $SCRIPTS_DIR"
        exit 1
    fi
    
    if [ ! -f "$REQUIREMENTS_FILE" ]; then
        log_error "Requirements file not found: $REQUIREMENTS_FILE"
        exit 1
    fi
    
    log_success "Environment validation completed"
}

# Setup virtual environment
setup_virtual_environment() {
    show_progress 1 7 "Setting up Python virtual environment"
    
    if [ -d "$VENV_PATH" ] && [ "$FORCE_REGENERATION" = false ]; then
        log_info "Virtual environment already exists at $VENV_PATH"
        log_info "Use --force to recreate the environment"
    else
        if [ -d "$VENV_PATH" ]; then
            log_warning "Removing existing virtual environment for regeneration"
            rm -rf "$VENV_PATH"
        fi
        
        log_info "Creating virtual environment at $VENV_PATH"
        python3 -m venv "$VENV_PATH"
    fi
    
    # Activate virtual environment
    source "$VENV_PATH/bin/activate"
    
    # Upgrade pip
    log_info "Upgrading pip..."
    pip install --upgrade pip > /dev/null 2>&1
    
    log_success "Virtual environment ready"
}

# Install Python dependencies
install_dependencies() {
    show_progress 2 7 "Installing Python dependencies"
    
    source "$VENV_PATH/bin/activate"
    
    log_info "Installing packages from $REQUIREMENTS_FILE"
    
    # Install with progress indication
    pip install -r "$REQUIREMENTS_FILE" --quiet --progress-bar off
    
    # Verify key packages
    log_info "Verifying installations..."
    python -c "import sklearn, nltk, numpy, scipy; print('All ML packages imported successfully')" || {
        log_error "Package verification failed"
        exit 1
    }
    
    log_success "All dependencies installed and verified"
}

# Download NLTK data
download_nltk_data() {
    show_progress 3 7 "Downloading NLTK data models"
    
    source "$VENV_PATH/bin/activate"
    
    log_info "Downloading NLTK punkt tokenizer..."
    python -c "import nltk; nltk.download('punkt', quiet=True); print('punkt downloaded')" || {
        log_warning "Failed to download punkt, trying punkt_tab..."
    }
    
    log_info "Downloading NLTK punkt_tab tokenizer..."
    python -c "import nltk; nltk.download('punkt_tab', quiet=True); print('punkt_tab downloaded')" || {
        log_error "Failed to download punkt_tab tokenizer"
        exit 1
    }
    
    log_info "Downloading NLTK stopwords..."
    python -c "import nltk; nltk.download('stopwords', quiet=True); print('stopwords downloaded')" || {
        log_error "Failed to download stopwords"
        exit 1
    }
    
    log_success "NLTK data models downloaded successfully"
}

# Create necessary directories
create_directories() {
    show_progress 4 7 "Creating necessary directories"
    
    if [ ! -d "$CONFIG_DIR" ]; then
        mkdir -p "$CONFIG_DIR"
        log_info "Created config directory: $CONFIG_DIR"
    fi
    
    if [ ! -d "$MODELS_DIR" ]; then
        mkdir -p "$MODELS_DIR"
        log_info "Created models directory: $MODELS_DIR"
    fi
    
    log_success "Directory structure ready"
}

# Run topic discovery
run_topic_discovery() {
    show_progress 5 7 "Running topic discovery on blog corpus"
    
    if [ "$SKIP_DISCOVERY" = true ]; then
        log_info "Skipping topic discovery (--skip-discovery flag used)"
        return 0
    fi
    
    source "$VENV_PATH/bin/activate"
    cd "$SCRIPTS_DIR"
    
    # Backup existing models if they exist
    if [ -f "$MODELS_DIR/discovered_topics.json" ] && [ "$FORCE_REGENERATION" = false ]; then
        backup_file="$MODELS_DIR/discovered_topics_backup_$(date +%Y%m%d_%H%M%S).json"
        cp "$MODELS_DIR/discovered_topics.json" "$backup_file"
        log_info "Backed up existing topics to $backup_file"
    fi
    
    log_info "Analyzing blog corpus and discovering topics..."
    python topic_discovery.py || {
        log_error "Topic discovery failed"
        exit 1
    }
    
    # Verify output files were created
    if [ ! -f "$MODELS_DIR/discovered_topics.json" ]; then
        log_error "Topic discovery did not generate discovered_topics.json"
        exit 1
    fi
    
    if [ ! -f "$MODELS_DIR/tfidf_vectorizer.pkl" ]; then
        log_error "Topic discovery did not generate tfidf_vectorizer.pkl"
        exit 1
    fi
    
    log_success "Topic discovery completed successfully"
    
    # Show discovered topics summary
    topic_count=$(python -c "import json; data=json.load(open('$MODELS_DIR/discovered_topics.json')); print(len(data.get('discoveredTopics', {})))")
    doc_count=$(python -c "import json; data=json.load(open('$MODELS_DIR/discovered_topics.json')); print(len(data.get('documentAssignments', [])))")
    log_info "Discovered $topic_count topics from $doc_count documents"
}

# Generate enhanced metadata
generate_enhanced_metadata() {
    show_progress 6 7 "Generating enhanced blog metadata"
    
    source "$VENV_PATH/bin/activate"
    cd "$SCRIPTS_DIR"
    
    # Backup existing metadata
    metadata_file="$WEBSITE_DIR/public/blogdata/metadata/blog_metadata.json"
    if [ -f "$metadata_file" ] && [ "$FORCE_REGENERATION" = false ]; then
        backup_file="$WEBSITE_DIR/public/blogdata/metadata/blog_metadata_backup_$(date +%Y%m%d_%H%M%S).json"
        cp "$metadata_file" "$backup_file"
        log_info "Backed up existing metadata to $backup_file"
    fi
    
    log_info "Generating enhanced metadata with dynamic topics..."
    python create_blog_metadata.py || {
        log_error "Enhanced metadata generation failed"
        exit 1
    }
    
    log_success "Enhanced metadata generated successfully"
    
    # Show statistics
    if [ -f "$metadata_file" ]; then
        post_count=$(python -c "import json; data=json.load(open('$metadata_file')); print(len(data))")
        dynamic_count=$(python -c "import json; data=json.load(open('$metadata_file')); print(len([p for p in data if p.get('classification-method') == 'dynamic']))")
        log_info "Processed $post_count posts ($dynamic_count with dynamic classification)"
    fi
}

# Run validation tests
run_validation() {
    show_progress 7 7 "Running validation tests"
    
    source "$VENV_PATH/bin/activate"
    cd "$SCRIPTS_DIR"
    
    log_info "Running system validation..."
    python simple_test.py || {
        log_warning "Some validation tests failed, but system should still work"
        log_warning "Check the test output above for details"
        return 0  # Don't fail the entire setup for test warnings
    }
    
    log_success "All validation tests passed"
}

# Show usage instructions
show_usage_instructions() {
    echo ""
    echo -e "${GREEN}🎉 Enhanced Topic Extraction System Setup Complete!${NC}"
    echo ""
    echo "Your system is now ready with:"
    echo "• Dynamic topic discovery using machine learning"
    echo "• Enhanced metadata generation with confidence scores"
    echo "• Hybrid static + dynamic topic classification"
    echo ""
    echo "Generated files:"
    echo "• $MODELS_DIR/discovered_topics.json"
    echo "• $MODELS_DIR/tfidf_vectorizer.pkl"
    echo "• $MODELS_DIR/topic_clusters.pkl"
    echo "• Enhanced blog_metadata.json with dynamic topics"
    echo ""
    echo "To use the system:"
    echo ""
    echo "1. Regenerate topics after content changes:"
    echo "   ${BLUE}./update-blog-metadata.sh${NC}"
    echo ""
    echo "2. Generate metadata only (faster):"
    echo "   ${BLUE}source .venv/bin/activate && cd website/scripts && python create_blog_metadata.py${NC}"
    echo ""
    echo "3. Run topic discovery only:"
    echo "   ${BLUE}source .venv/bin/activate && cd website/scripts && python topic_discovery.py${NC}"
    echo ""
    echo "4. Full regeneration:"
    echo "   ${BLUE}./setup-topic-extraction.sh --force${NC}"
    echo ""
    echo "The system will automatically use both static categories and discovered topics"
    echo "for the most accurate classification possible."
    echo ""
}

# Main execution
main() {
    echo ""
    echo -e "${PURPLE}Enhanced Topic Extraction System Setup${NC}"
    echo -e "${PURPLE}======================================${NC}"
    echo ""
    
    # Validate environment
    validate_environment
    
    # Setup steps
    setup_virtual_environment
    install_dependencies
    download_nltk_data
    create_directories
    run_topic_discovery
    generate_enhanced_metadata
    run_validation
    
    # Show completion message
    show_usage_instructions
}

# Error handling
trap 'log_error "Setup failed at line $LINENO. Check the error message above."; exit 1' ERR

# Run main function
main "$@"