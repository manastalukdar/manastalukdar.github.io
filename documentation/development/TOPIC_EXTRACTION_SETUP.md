# Enhanced Topic Extraction System Setup Guide

This guide explains how to set up and use the enhanced dynamic topic extraction system for your blog. The system combines traditional rule-based topic classification with machine learning-based topic discovery for the most accurate content categorization.

## Overview

The enhanced topic extraction system provides:

- **Dynamic Topic Discovery**: Uses machine learning to discover topics naturally present in your blog content
- **Hybrid Classification**: Combines static categories with discovered topics for best accuracy
- **Confidence Scoring**: Provides reliability scores for topic assignments
- **Automated Setup**: One-command setup with comprehensive error handling
- **Incremental Updates**: Fast updates when content changes

## Quick Start

### 1. First-Time Setup

Run the main setup script to install everything:

```bash
./setup-topic-extraction.sh
```

This will:

- Create/validate Python virtual environment
- Install ML dependencies (scikit-learn, nltk, numpy, scipy)
- Download required NLTK data models
- Analyze your blog corpus and discover topics
- Generate enhanced metadata with dynamic classifications

### 2. Regular Updates

After adding new blog posts, update the topic classifications:

```bash
./update-blog-metadata.sh
```

This intelligently determines what needs updating and only regenerates necessary files.

## Detailed Usage

### Main Setup Script

**File**: `setup-topic-extraction.sh`

**Purpose**: Complete system setup and configuration

**Usage**:

```bash
./setup-topic-extraction.sh [options]
```

**Options**:

- `--force` - Force regeneration of all models (ignores existing files)
- `--skip-discovery` - Skip topic discovery, only setup dependencies
- `--blog-folder PATH` - Use custom blog folder location
- `--help` - Show detailed help

**Examples**:

```bash
# Standard first-time setup
./setup-topic-extraction.sh

# Force complete regeneration
./setup-topic-extraction.sh --force

# Setup dependencies only (useful for CI/CD)
./setup-topic-extraction.sh --skip-discovery

# Use custom blog folder
./setup-topic-extraction.sh --blog-folder /path/to/my/blog
```

### Quick Update Script

**File**: `update-blog-metadata.sh`

**Purpose**: Fast updates after content changes

**Usage**:

```bash
./update-blog-metadata.sh [options]
```

**Options**:

- `--metadata-only` - Only regenerate metadata (faster, uses existing topic models)
- `--discovery-only` - Only run topic discovery (skip metadata generation)
- `--force` - Force regeneration even if files appear up-to-date
- `--blog-folder PATH` - Use custom blog folder location
- `--help` - Show detailed help

**Examples**:

```bash
# Smart update (only updates what's needed)
./update-blog-metadata.sh

# Fast metadata update only
./update-blog-metadata.sh --metadata-only

# Regenerate topics only
./update-blog-metadata.sh --discovery-only

# Force complete regeneration
./update-blog-metadata.sh --force
```

### Python Setup Helper

**File**: `website/scripts/setup_models.py`

**Purpose**: Detailed validation and testing of ML components

**Usage**:

```bash
source .venv/bin/activate
python website/scripts/setup_models.py [options]
```

**Options**:

- `--action {download_nltk,verify_deps,test_system,all}` - Specific action to perform
- `--blog-folder PATH` - Custom blog folder location
- `--verbose` - Enable detailed output

**Examples**:

```bash
# Run all setup procedures with detailed output
python website/scripts/setup_models.py --verbose

# Only verify dependencies
python website/scripts/setup_models.py --action verify_deps

# Test system functionality
python website/scripts/setup_models.py --action test_system

# Download NLTK data only
python website/scripts/setup_models.py --action download_nltk
```

## System Architecture

### Generated Files

After setup, the following files are created:

```
project-root/
├── .venv/                              # Python virtual environment
│   └── [ML packages]                  # scikit-learn, nltk, numpy, scipy
└── website/
    ├── config/
    │   ├── topic-extraction-data.json  # Static topic categories (existing)
    │   └── topic_models/               # Generated ML models
    │       ├── discovered_topics.json  # Dynamic topic definitions
    │       ├── tfidf_vectorizer.pkl    # Trained TF-IDF model
    │       └── topic_clusters.pkl      # K-means clustering model
    └── public/blogdata/metadata/
        └── blog_metadata.json         # Enhanced metadata with topics
```

### Topic Classification Methods

The system uses three classification methods:

1. **Static**: Traditional rule-based using predefined categories
2. **Dynamic**: ML-based using discovered topic clusters
3. **Hybrid**: Combines both methods, choosing the highest confidence

### Enhanced Metadata Fields

Each blog post now includes additional fields:

```json
{
  "classification-method": "dynamic",
  "keyword-count": 25,
  "static-keywords": 10,
  "dynamic-keywords": 15,
  "dynamic-topic-info": {
    "label": "machine-learning-ai",
    "confidence": 0.85,
    "cluster-id": 2,
    "mapped-category": "artificial-intelligence"
  }
}
```

## Workflow Examples

### Daily Content Workflow

1. **Write new blog post** - Add markdown file to blog folder
2. **Update topics** - Run `./update-blog-metadata.sh`
3. **Build website** - Your existing build process uses enhanced metadata

### Weekly Maintenance

1. **Check for updates** - Run `./update-blog-metadata.sh` (smart update)
2. **Review topic accuracy** - Check `discovered_topics.json` for new patterns
3. **Update static categories** - Add new terms to `topic-extraction-data.json` if needed

### Monthly Deep Maintenance

1. **Full regeneration** - Run `./setup-topic-extraction.sh --force`
2. **Validate system** - Run `python website/scripts/setup_models.py --action test_system`
3. **Review performance** - Check topic confidence scores in metadata

## Integration with Build Process

### CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Update Topic Classifications
  run: |
    ./setup-topic-extraction.sh --skip-discovery  # Setup dependencies
    ./update-blog-metadata.sh --metadata-only             # Fast metadata update
```

### Makefile Integration

Add to your `Makefile`:

```makefile
# Setup topic extraction system
setup-topics:
 ./setup-topic-extraction.sh

# Update topics after content changes  
update-topics:
 ./update-blog-metadata.sh

# Quick metadata regeneration
update-metadata:
 ./update-blog-metadata.sh --metadata-only
```

## Troubleshooting

### Common Issues

**"Virtual environment not found"**

- Run `./setup-topic-extraction.sh` first

**"Required Python packages not found"**

- Run `./setup-topic-extraction.sh --force` to reinstall dependencies

**"Blog folder not found"**

- Use `--blog-folder /path/to/blog` option
- Ensure blog posts have `published: true` in frontmatter

**"Topic discovery failed"**

- Check that you have at least 3 published blog posts
- Ensure posts contain sufficient text content
- Run with `--verbose` flag for detailed error messages

### Performance Considerations

**Large Blog Collections (>500 posts)**:

- Topic discovery may take 5-10 minutes
- Consider using `--metadata-only` for regular updates
- Use `--discovery-only` when you want new topic analysis

**Memory Usage**:

- Peak usage: ~500MB during topic discovery
- Steady state: ~50MB for metadata generation

### Debugging

Enable detailed logging:

```bash
# For shell scripts
export DEBUG=1
./setup-topic-extraction.sh

# For Python components  
python website/scripts/setup_models.py --verbose
```

## Advanced Configuration

### Custom Topic Categories

Edit `website/config/topic-extraction-data.json` to add custom categories:

```json
{
  "topicCategories": {
    "my-custom-topic": [
      "keyword1",
      "keyword2", 
      "related term"
    ]
  }
}
```

### Tuning ML Parameters

Modify parameters in `website/scripts/topic_discovery.py`:

```python
# Adjust clustering parameters
kmeans = KMeans(
    n_clusters=n_clusters,
    random_state=42,
    n_init=10,           # Increase for better convergence
    max_iter=500         # Increase for complex datasets
)

# Adjust TF-IDF parameters
vectorizer = TfidfVectorizer(
    max_features=5000,   # Increase for larger vocabularies
    min_df=2,           # Minimum document frequency
    max_df=0.8,         # Maximum document frequency
    ngram_range=(1, 2)  # Include bigrams
)
```

## System Requirements

### Dependencies

- **Python**: 3.8+ (3.13+ recommended)
- **Virtual Environment**: Automatically managed
- **Disk Space**: ~200MB for all dependencies and models
- **Memory**: ~500MB during topic discovery

### Python Packages

Automatically installed:

- `scikit-learn>=1.3.0` - Machine learning algorithms
- `nltk>=3.8` - Natural language processing
- `numpy>=1.24.0` - Numerical operations
- `scipy>=1.10.0` - Sparse matrix operations
- `python-frontmatter` - Markdown parsing
- `python-dateutil` - Date parsing
- `PyYAML` - YAML configuration

## Support

### Getting Help

1. **Check logs** - Scripts provide detailed error messages
2. **Run diagnostics** - Use `python website/scripts/setup_models.py --action test_system`
3. **Review configuration** - Ensure `topic-extraction-data.json` is valid
4. **Check file permissions** - Ensure scripts are executable (`chmod +x`)

### Backup and Recovery

The system automatically creates backups:

- `discovered_topics_backup_YYYYMMDD_HHMMSS.json`
- `blog_metadata_backup_YYYYMMDD_HHMMSS.json`

To restore from backup:

```bash
# Restore topics
cp website/config/topic_models/discovered_topics_backup_20250101_120000.json \
   website/config/topic_models/discovered_topics.json

# Restore metadata  
cp website/public/blogdata/metadata/blog_metadata_backup_20250101_120000.json \
   website/public/blogdata/metadata/blog_metadata.json
```

---

**Next Steps**: After setup, the blog posts will automatically use enhanced topic classification with both static categories and dynamically discovered topics for the most accurate content categorization possible.
