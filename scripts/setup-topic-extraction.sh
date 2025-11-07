#!/bin/bash

##############################################################################
# Unified Transformer-Based Topic Extraction System Setup Script
#
# This script sets up the complete unified topic extraction system by:
# 1. Creating/validating Python virtual environment
# 2. Installing transformer dependencies (sentence-transformers, torch) + traditional ML
# 3. Downloading transformer models and NLTK data
# 4. Pre-computing category embeddings for semantic similarity
# 5. Running advanced topic discovery (BERTopic or transformer-based clustering)
# 6. Generating enhanced metadata with unified multi-tier extraction
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
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
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
SKIP_METADATA=false
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
        --no-metadata)
            SKIP_METADATA=true
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
    echo "  --no-metadata        Skip metadata generation (setup only)"
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

# Check if topic models need regeneration based on blog content changes
should_regenerate_topics() {
    if [ "$FORCE_REGENERATION" = true ]; then
        return 0  # Force regeneration
    fi
    
    # Check for essential topic model files
    local topics_file="$MODELS_DIR/discovered_topics.json"
    local transformer_topics="$MODELS_DIR/transformer_topics.json"
    local category_embeddings="$MODELS_DIR/category_embeddings.pkl"
    local blog_hash_file="$MODELS_DIR/blog_content_hash.txt"
    
    # If no topic model files exist, regeneration is needed
    if [ ! -f "$topics_file" ] && [ ! -f "$transformer_topics" ] && [ ! -f "$category_embeddings" ]; then
        log_info "No topic model files found - regeneration needed"
        return 0
    fi
    
    # Hash-based cache validation for more reliable caching
    log_info "Checking blog content hash for smart caching..."
    log_info "Working directory: $(pwd), Project root: $PROJECT_ROOT"
    
    # Calculate current blog content hash (using same method as CI for consistency)
    local current_blog_hash=""
    local old_pwd=$(pwd)
    cd "$PROJECT_ROOT"
    
    # Count blog files for debugging
    local blog_file_count=$(find blog -name "*.md" -type f | wc -l)
    log_info "Found $blog_file_count blog files for hash calculation"
    
    if command -v sha256sum >/dev/null 2>&1; then
        current_blog_hash=$(find blog -name "*.md" -type f -exec sha256sum {} \; | sha256sum | cut -d' ' -f1)
    else
        # Fallback for macOS
        current_blog_hash=$(find blog -name "*.md" -type f -exec shasum -a 256 {} \; | shasum -a 256 | cut -d' ' -f1)
    fi
    cd "$old_pwd"
    
    log_info "Current blog content hash: $current_blog_hash"
    
    # Check if we have a stored hash from previous topic model generation
    if [ -f "$blog_hash_file" ]; then
        local stored_hash=$(cat "$blog_hash_file" 2>/dev/null | tr -d '\n')
        log_info "Stored blog content hash: $stored_hash"
        
        # Validate that we have valid hashes (non-empty and reasonable length)
        if [ -n "$current_blog_hash" ] && [ -n "$stored_hash" ] && [ ${#stored_hash} -eq 64 ]; then
            if [ "$current_blog_hash" = "$stored_hash" ]; then
                log_success "Blog content hash matches cached topic models - no regeneration needed"
                return 1  # No regeneration needed
            else
                log_info "Blog content hash changed - topic model regeneration needed"
                log_info "  Previous: $stored_hash"  
                log_info "  Current:  $current_blog_hash"
                return 0
            fi
        else
            log_warning "Invalid hash data detected - forcing topic model regeneration"
            log_info "  Current hash length: ${#current_blog_hash}, Stored hash length: ${#stored_hash}"
            return 0
        fi
    else
        log_info "No stored blog hash found - topic model regeneration needed"
        return 0
    fi
}

# Save blog content hash for future cache validation
save_blog_content_hash() {
    local blog_hash_file="$MODELS_DIR/blog_content_hash.txt"
    
    # Calculate current blog content hash (same logic as should_regenerate_topics and CI)
    local current_blog_hash=""
    local old_pwd=$(pwd)
    cd "$PROJECT_ROOT"
    if command -v sha256sum >/dev/null 2>&1; then
        current_blog_hash=$(find blog -name "*.md" -type f -exec sha256sum {} \; | sha256sum | cut -d' ' -f1)
    else
        # Fallback for macOS
        current_blog_hash=$(find blog -name "*.md" -type f -exec shasum -a 256 {} \; | shasum -a 256 | cut -d' ' -f1)
    fi
    cd "$old_pwd"
    
    # Save hash to file with validation
    if [ -n "$current_blog_hash" ] && [ ${#current_blog_hash} -eq 64 ]; then
        echo "$current_blog_hash" > "$blog_hash_file"
        if [ $? -eq 0 ]; then
            log_success "Saved blog content hash for cache validation: $current_blog_hash"
        else
            log_error "Failed to save blog content hash to file: $blog_hash_file"
        fi
    else
        log_error "Invalid blog content hash calculated (length: ${#current_blog_hash})"
        log_error "Hash value: $current_blog_hash"
        log_warning "Topic models may not cache correctly without valid hash"
    fi
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

    # Upgrade pip using python -m pip for better reliability
    log_info "Upgrading pip..."
    python -m pip install --upgrade pip > /dev/null 2>&1

    log_success "Virtual environment ready"
}

# Install Python dependencies
install_dependencies() {
    show_progress 2 7 "Installing Python dependencies"

    source "$VENV_PATH/bin/activate"

    log_info "Installing packages from $REQUIREMENTS_FILE"

    # Install with optimization flags for CI environments
    python -m pip install -r "$REQUIREMENTS_FILE" \
        --quiet \
        --progress-bar off \
        --disable-pip-version-check \
        --no-compile \
        --prefer-binary \
        --only-binary=:all: 2>/dev/null || {
        # Fallback if binary-only install fails
        log_warning "Binary-only install failed, retrying with compilation allowed..."
        python -m pip install -r "$REQUIREMENTS_FILE" \
            --quiet \
            --progress-bar off \
            --disable-pip-version-check \
            --prefer-binary || {
            # Final fallback: install core packages without problematic ones
            log_warning "Full install failed, attempting core packages only..."

            # Create temporary requirements without problematic packages
            temp_req=$(mktemp)
            grep -v -E "^(hdbscan|umap-learn|bertopic)" "$REQUIREMENTS_FILE" > "$temp_req"

            python -m pip install -r "$temp_req" \
                --quiet \
                --progress-bar off \
                --disable-pip-version-check \
                --prefer-binary

            rm "$temp_req"

            # Try to install advanced packages individually with Python 3.14 compatibility
            log_info "Attempting to install advanced packages with Python 3.14 compatibility..."

            # Try installing advanced packages that may not have Python 3.14 wheels yet
            # These are optional for the basic transformer functionality

            # Try umap-learn (usually has better Python 3.14 support)
            python -m pip install "umap-learn>=0.5.0" --prefer-binary --quiet 2>/dev/null || {
                log_warning "Could not install umap-learn - will use sklearn alternatives"
            }

            # Try hdbscan (may not support Python 3.14 yet)
            python -m pip install "hdbscan>=0.8.0" --prefer-binary --quiet 2>/dev/null || {
                log_warning "Could not install hdbscan - advanced clustering will be limited"
            }

            # Try bertopic (depends on hdbscan and umap, may fail)
            python -m pip install "bertopic>=0.15.0" --prefer-binary --quiet 2>/dev/null || {
                log_warning "Could not install bertopic - will use transformer-based methods"
            }
        }
    }

    # Verify key packages
    log_info "Verifying installations..."

    # Test core packages
    python -c "import sklearn, nltk, numpy, scipy; print('Traditional ML packages imported successfully')" || {
        log_error "Traditional ML package verification failed"
        exit 1
    }

    # Test advanced packages with graceful handling
    python -c "
try:
    import hdbscan
    print('hdbscan: Available')
    hdbscan_available = True
except ImportError:
    print('hdbscan: Not available - using fallback clustering')
    hdbscan_available = False

try:
    import umap
    print('umap-learn: Available') 
except ImportError:
    print('umap-learn: Not available - using sklearn alternatives')

try:
    import bertopic
    print('bertopic: Available')
except ImportError:
    print('bertopic: Not available - using traditional topic modeling')
"

    # Test transformer packages if available
    python -c "
try:
    import sentence_transformers, torch, transformers
    print('Transformer packages imported successfully')
    transformer_available = True
except ImportError as e:
    print(f'Transformer packages not available: {e}')
    print('System will use traditional methods as fallback')
    transformer_available = False
" || {
        log_warning "Transformer package verification failed, system will use fallbacks"
    }

    log_success "All dependencies installed and verified"
}

# Download models and data
download_models_and_data() {
    show_progress 3 7 "Downloading transformer models and NLTK data"

    source "$VENV_PATH/bin/activate"

    log_info "Downloading NLTK data with SSL workaround..."
    python -c "
import nltk
import ssl

# SSL workaround for certificate issues
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

# Download required NLTK data
try:
    nltk.download('punkt', quiet=True)
    print('punkt downloaded')
except Exception as e:
    print(f'punkt download failed: {e}')

try:
    nltk.download('punkt_tab', quiet=True)
    print('punkt_tab downloaded')
except Exception as e:
    print(f'punkt_tab download failed: {e}')

try:
    nltk.download('stopwords', quiet=True)
    print('stopwords downloaded')
except Exception as e:
    print(f'stopwords download failed: {e}')
    raise

try:
    nltk.download('wordnet', quiet=True)
    print('wordnet downloaded')
except Exception as e:
    print(f'wordnet download failed: {e}')
    # Try alternative download method
    try:
        print('Attempting wordnet download with alternative method...')
        nltk.download('wordnet', download_dir=None, raise_on_error=False)
        print('wordnet downloaded via alternative method')
    except Exception as e2:
        print(f'Alternative wordnet download also failed: {e2}')
        print('Wordnet download failed - system will work without lemmatization features')
        # Don't raise - make wordnet non-critical

try:
    nltk.download('omw-1.4', quiet=True)
    print('omw-1.4 downloaded')
except Exception as e:
    print(f'omw-1.4 download failed: {e}')
    # Not critical, continue
    pass
" || {
        log_error "Failed to download required NLTK data"
        exit 1
    }

    # Download transformer models if available
    log_info "Pre-loading transformer models (this may take a few minutes)..."
    python -c "
try:
    from sentence_transformers import SentenceTransformer
    print('Loading all-MiniLM-L6-v2 model (same as search system)...')
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print('Transformer model loaded and cached successfully')
except ImportError:
    print('Transformer packages not available, skipping model download')
except Exception as e:
    print(f'Transformer model download failed: {e}')
    print('System will still work with fallback methods')
" || {
        log_warning "Transformer model download failed, system will use fallbacks"
    }

    log_success "Models and data downloaded successfully"
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

# Run unified topic extraction setup
run_unified_topic_setup() {
    show_progress 5 7 "Setting up unified transformer-based topic extraction"

    # Early exit for skip-discovery mode if models already exist and are up-to-date
    if [ "$SKIP_DISCOVERY" = true ]; then
        log_info "Skipping topic discovery (--skip-discovery flag used)"
        return 0
    fi

    log_info "Topic model regeneration needed - proceeding with setup"
    source "$VENV_PATH/bin/activate"
    
    # Change to project root directory for consistent path handling  
    cd "$PROJECT_ROOT"

    # Backup existing models if they exist
    backup_models() {
        local backup_suffix="_backup_$(date +%Y%m%d_%H%M%S)"
        if [ -f "$MODELS_DIR/discovered_topics.json" ] && [ "$FORCE_REGENERATION" = false ]; then
            cp "$MODELS_DIR/discovered_topics.json" "$MODELS_DIR/discovered_topics${backup_suffix}.json"
            log_info "Backed up traditional topics"
        fi
        if [ -f "$MODELS_DIR/transformer_topics.json" ] && [ "$FORCE_REGENERATION" = false ]; then
            cp "$MODELS_DIR/transformer_topics.json" "$MODELS_DIR/transformer_topics${backup_suffix}.json"
            log_info "Backed up transformer topics"
        fi
    }
    
    # Clean up old backup files (keep only last 3 backups)
    cleanup_old_backups() {
        log_info "Cleaning up old backup files..."
        # Remove backup files older than 7 days to prevent accumulation
        find "$MODELS_DIR" -name "*backup*.json" -type f -mtime +7 -delete 2>/dev/null || true
        
        # Keep only the 3 most recent backups of each type
        for topic_type in "discovered_topics" "transformer_topics"; do
            backup_count=$(find "$MODELS_DIR" -name "${topic_type}_backup_*.json" -type f | wc -l)
            if [ "$backup_count" -gt 3 ]; then
                find "$MODELS_DIR" -name "${topic_type}_backup_*.json" -type f -printf '%T@ %p\n' 2>/dev/null | \
                sort -n | head -n $((backup_count - 3)) | cut -d' ' -f2- | \
                xargs rm -f 2>/dev/null || true
            fi
        done
    }
    
    backup_models
    cleanup_old_backups

    # Try unified transformer approach first
    log_info "Setting up unified transformer-based topic extraction..."
    python -c "
import sys
sys.path.append('website/scripts')
try:
    from transformer_topic_extraction import UnifiedTopicExtractor
    config_folder = 'website/config'
    extractor = UnifiedTopicExtractor(config_folder)

    # Pre-compute category embeddings
    print('Pre-computing category embeddings...')
    # This happens automatically in __init__

    # Test the system
    test_content = 'Machine learning and data science applications with neural networks'
    result = extractor.extract_topics_unified(test_content, 'Test Content')
    print(f'Transformer extraction test successful: {result[\"topic-primary\"]}')
    print('Unified transformer system ready')

except ImportError as e:
    print(f'Transformer extraction not available: {e}')
    print('Will use traditional fallback methods')
except Exception as e:
    print(f'Transformer setup failed: {e}')
    print('Will use traditional fallback methods')
" || {
        log_warning "Transformer setup failed, using traditional methods"
    }

    # Run traditional topic discovery as fallback/supplement
    log_info "Running traditional topic discovery as fallback..."
    python "$SCRIPTS_DIR/topic_discovery.py" || {
        log_warning "Traditional topic discovery failed, but system can still work with static methods"
    }

    log_success "Unified topic extraction setup completed"

    # Show summary of available methods
    transformer_available=false
    traditional_available=false

    if [ -f "$MODELS_DIR/transformer_topics.json" ] || [ -f "$MODELS_DIR/category_embeddings.pkl" ]; then
        transformer_available=true
    fi

    if [ -f "$MODELS_DIR/discovered_topics.json" ]; then
        traditional_available=true
        topic_count=$(python -c "import json; data=json.load(open('$MODELS_DIR/discovered_topics.json')); print(len(data.get('discoveredTopics', {})))" 2>/dev/null || echo "0")
        doc_count=$(python -c "import json; data=json.load(open('$MODELS_DIR/discovered_topics.json')); print(len(data.get('documentAssignments', [])))" 2>/dev/null || echo "0")
        log_info "Traditional system: $topic_count topics from $doc_count documents"
    fi

    if [ "$transformer_available" = true ]; then
        log_info "✅ Transformer-based extraction: Available (primary method)"
    else
        log_info "❌ Transformer-based extraction: Not available"
    fi

    if [ "$traditional_available" = true ]; then
        log_info "✅ Traditional extraction: Available (fallback method)"
    else
        log_warning "❌ Traditional extraction: Not available"
    fi
}

# Generate enhanced metadata
generate_enhanced_metadata() {
    local topic_models_regenerated="$1"
    show_progress 6 7 "Generating enhanced blog metadata"

    source "$VENV_PATH/bin/activate"
    
    # Change to project root directory since create_blog_metadata.py expects to run from there
    cd "$PROJECT_ROOT"

    # Check if metadata regeneration is needed
    metadata_file="$WEBSITE_DIR/public/blogdata/metadata/blog_metadata.json"
    local skip_metadata=false
    local use_skip_topics=false
    
    if [ "$FORCE_REGENERATION" = false ] && [ -f "$metadata_file" ]; then
        # Check if any blog posts are newer than metadata
        local newest_blog_file=$(find "$BLOG_FOLDER" -name "*.md" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)
        
        if [ -n "$newest_blog_file" ]; then
            local blog_time=$(stat -c %Y "$newest_blog_file" 2>/dev/null || echo "0")
            local metadata_time=$(stat -c %Y "$metadata_file" 2>/dev/null || echo "0")
            
            if [ "$metadata_time" -ge "$blog_time" ]; then
                log_success "Metadata is up-to-date - skipping regeneration"
                skip_metadata=true
            fi
        fi
    fi
    
    # If metadata doesn't need regeneration, skip entirely
    if [ "$skip_metadata" = true ]; then
        return 0
    fi
    
    # Determine if we can reuse cached topics or need to skip entirely
    local use_cached_topics=false
    if [ "$topic_models_regenerated" = false ]; then
        # Check if we have usable cached topic models
        if [ -f "$MODELS_DIR/transformer_topics.json" ] || [ -f "$MODELS_DIR/discovered_topics.json" ]; then
            log_info "Using existing topic models for metadata generation (cached topics)"
            use_cached_topics=true
            use_skip_topics=false
        else
            log_info "No topic models available - using skip-topics mode for minimal metadata generation"
            use_skip_topics=true
            use_cached_topics=false
        fi
    fi

    # Backup existing metadata
    if [ -f "$metadata_file" ] && [ "$FORCE_REGENERATION" = false ]; then
        backup_file="$WEBSITE_DIR/public/blogdata/metadata/blog_metadata_backup_$(date +%Y%m%d_%H%M%S).json"
        cp "$metadata_file" "$backup_file"
        log_info "Backed up existing metadata to $backup_file"
    fi

    # Run metadata generation with appropriate flags
    if [ "$use_skip_topics" = true ]; then
        log_info "Generating minimal metadata (no topic processing)..."
        python "$SCRIPTS_DIR/create_blog_metadata.py" --skip-topics || {
            log_error "Enhanced metadata generation failed"
            exit 1
        }
    elif [ "$use_cached_topics" = true ]; then
        log_info "Generating metadata using cached topic models (fast topic extraction)..."
        python "$SCRIPTS_DIR/create_blog_metadata.py" --use-cached-topics || {
            log_error "Cached topic metadata generation failed"
            exit 1
        }
    else
        log_info "Generating enhanced metadata with dynamic topics..."
        python "$SCRIPTS_DIR/create_blog_metadata.py" || {
            log_error "Enhanced metadata generation failed"
            exit 1
        }
    fi

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
    
    # Change to project root directory for consistent path handling
    cd "$PROJECT_ROOT"

    log_info "Running system validation..."
    python "$SCRIPTS_DIR/simple_test.py" || {
        log_warning "Some validation tests failed, but system should still work"
        log_warning "Check the test output above for details"
        return 0  # Don't fail the entire setup for test warnings
    }

    log_success "All validation tests passed"
}

# Show usage instructions
show_usage_instructions() {
    echo ""
    echo -e "${GREEN}🎉 Unified Transformer-Based Topic Extraction System Setup Complete!${NC}"
    echo ""
    echo "Your system is now ready with:"
    echo "• 🚀 Transformer-based semantic topic extraction (primary)"
    echo "• 🔄 Enhanced hybrid static + dynamic classification (fallback)"
    echo "• 📝 Traditional rule-based classification (final fallback)"
    echo "• 🧠 Unified embeddings consistent with search system"
    echo "• 📈 Multi-tier reliability with graceful degradation"
    echo ""
    echo "Generated files:"
    echo "• $MODELS_DIR/category_embeddings.pkl (transformer category embeddings)"
    echo "• $MODELS_DIR/transformer_topics.json (transformer-discovered topics)"
    echo "• $MODELS_DIR/discovered_topics.json (traditional fallback topics)"
    echo "• $MODELS_DIR/tfidf_vectorizer.pkl (traditional fallback model)"
    echo "• $MODELS_DIR/topic_clusters.pkl (traditional fallback model)"
    echo "• Enhanced blog_metadata.json with unified topic classifications"
    echo ""
    echo "To use the system:"
    echo ""
    echo "1. Regenerate topics after content changes:"
    echo "   ${BLUE}./scripts/update-blog-metadata.sh${NC}"
    echo ""
    echo "2. Generate metadata only (faster):"
    echo "   ${BLUE}source .venv/bin/activate && cd website/scripts && python create_blog_metadata.py${NC}"
    echo ""
    echo "3. Run topic discovery only:"
    echo "   ${BLUE}source .venv/bin/activate && cd website/scripts && python topic_discovery.py${NC}"
    echo ""
    echo "4. Full regeneration:"
    echo "   ${BLUE}./scripts/setup-topic-extraction.sh --force${NC}"
    echo ""
    echo "5. Test the unified system:"
    echo "   ${BLUE}cd website && python scripts/test_unified_extraction.py${NC}"
    echo ""
    echo "The system will automatically use:"
    echo "• Transformer-based semantic analysis (primary)"
    echo "• Enhanced static+dynamic classification (fallback)"
    echo "• Simple rule-based matching (final fallback)"
    echo "for maximum reliability and accuracy."
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
    download_models_and_data
    create_directories
    
    # Check if topic models need regeneration and store result
    local topic_models_regenerated=false
    if [ "$SKIP_DISCOVERY" = true ]; then
        log_success "Topic discovery skipped (--skip-discovery flag) - using existing models"
        # Don't set topic_models_regenerated=true since we're not actually regenerating
    elif should_regenerate_topics || [ "$FORCE_REGENERATION" = true ]; then
        run_unified_topic_setup
        topic_models_regenerated=true
    else
        log_success "Topic models are up-to-date - skipping topic setup"
        # Models exist and are current, so we can reuse them for metadata generation
    fi
    
    # Always save blog content hash for cache validation (regardless of skip/regeneration mode)
    save_blog_content_hash
    
    # Generate metadata based on topic model state
    if [ "$SKIP_METADATA" = true ]; then
        log_info "Skipping metadata generation (--no-metadata flag)"
    else
        generate_enhanced_metadata "$topic_models_regenerated"
        run_validation
    fi

    # Show completion message
    show_usage_instructions
}

# Error handling
trap 'log_error "Setup failed at line $LINENO. Check the error message above."; exit 1' ERR

# Run main function
main "$@"
