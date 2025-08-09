#!/usr/bin/env python3
"""
Granular Post Processing Script - Process Individual Blog Posts

This script processes individual blog posts for topic extraction and metadata generation
as part of the granular post processing optimization. It's designed to work with the
main create_blog_metadata.py script to enable incremental processing.

Usage:
    python process_single_post.py <blog_post_path>

Features:
- Process single blog post for topic extraction
- Generate metadata for individual posts
- Designed for CI/CD optimization (80% processing time reduction)
- Compatible with existing topic extraction systems
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import frontmatter
from dateutil import parser as dateutil_parser

# Import topic extraction systems
from topic_discovery import TopicDiscoverySystem
from enhanced_topic_extraction import EnhancedTopicExtractor

# Import new unified transformer-based extraction
try:
    from transformer_topic_extraction import UnifiedTopicExtractor
    TRANSFORMER_EXTRACTION_AVAILABLE = True
    print("Transformer-based topic extraction available")
    _TRANSFORMER_EXTRACTOR = None
except ImportError as e:
    TRANSFORMER_EXTRACTION_AVAILABLE = False
    print(f"Transformer-based topic extraction not available: {e}")
    _TRANSFORMER_EXTRACTOR = None


def get_transformer_extractor(config_folder: str):
    """Get cached transformer extractor instance to avoid repeated model loading."""
    global _TRANSFORMER_EXTRACTOR
    if TRANSFORMER_EXTRACTION_AVAILABLE and _TRANSFORMER_EXTRACTOR is None:
        print("Initializing transformer extractor (one-time setup)...")
        _TRANSFORMER_EXTRACTOR = UnifiedTopicExtractor(config_folder)
    return _TRANSFORMER_EXTRACTOR


def extract_topics_from_content(content: str, title: str = "", use_enhanced: bool = True, config_folder: str = "config"):
    """Enhanced topic extraction from blog content using multiple methods."""
    try:
        # Method 1: Try unified transformer-based extraction (most accurate)
        if TRANSFORMER_EXTRACTION_AVAILABLE and use_enhanced:
            try:
                extractor = get_transformer_extractor(config_folder)
                if extractor:
                    result = extractor.extract_topics_from_content(content, title)
                    if result and result.get('topic-primary') != 'general':
                        print(f"✓ Transformer extraction successful for: {title}")
                        return result
                    else:
                        print(f"⚠ Transformer extraction returned generic result for: {title}")
            except Exception as e:
                print(f"⚠ Transformer extraction failed for {title}: {e}")

        # Method 2: Enhanced hybrid extraction (fallback)
        try:
            enhanced_extractor = EnhancedTopicExtractor(config_folder)
            result = enhanced_extractor.extract_topics_from_content(content, title)
            if result:
                print(f"✓ Enhanced extraction successful for: {title}")
                return result
            else:
                print(f"⚠ Enhanced extraction returned no result for: {title}")
        except Exception as e:
            print(f"⚠ Enhanced extraction failed for {title}: {e}")

        # Method 3: Basic fallback extraction
        try:
            discovery = TopicDiscoverySystem()
            result = discovery.extract_topics_from_content(content, title)
            if result:
                print(f"✓ Basic extraction successful for: {title}")
                return result
        except Exception as e:
            print(f"⚠ Basic extraction failed for {title}: {e}")

    except Exception as e:
        print(f"❌ All topic extraction methods failed for {title}: {e}")

    # Ultimate fallback - return default topic
    return {
        'topic-primary': 'general-technology',
        'topic-secondary': [],
        'content-entities': [],
        'topic-confidence': 0.0,
        'related-concepts': [],
        'content-complexity': 'intermediate',
        'target-audience': ['general-tech-audience'],
        'classification-method': 'fallback',
        'extraction-method': 'fallback'
    }


def calculate_reading_time(content: str) -> dict:
    """Calculate reading time for blog post content."""
    words_per_minute = 200
    word_count = len(content.split())
    reading_minutes = max(1, round(word_count / words_per_minute))
    
    return {
        'word-count': word_count,
        'reading-time-minutes': reading_minutes,
        'reading-time-text': f"{reading_minutes} min read"
    }


def process_single_blog_post(blog_post_path: str, config_folder: str = "config") -> dict:
    """
    Process a single blog post and extract metadata with topic information.
    
    Args:
        blog_post_path: Path to the blog post markdown file
        config_folder: Path to configuration folder for topic extraction
    
    Returns:
        Dictionary containing processed metadata for the post
    """
    print(f"🔄 Processing single post: {blog_post_path}")
    
    if not os.path.exists(blog_post_path):
        raise FileNotFoundError(f"Blog post not found: {blog_post_path}")
    
    # Load frontmatter
    try:
        with open(blog_post_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
    except Exception as e:
        raise Exception(f"Error loading blog post {blog_post_path}: {e}")
    
    # Check if post is published
    if not post.metadata.get('published', False):
        print(f"⏭️  Skipping unpublished post: {blog_post_path}")
        return None
    
    # Extract relative path for metadata
    blog_folder = Path("blog").resolve()
    post_path = Path(blog_post_path).resolve()
    
    try:
        relative_path = str(post_path.relative_to(blog_folder.parent))
        post.metadata['path'] = relative_path
    except ValueError:
        # Fallback if path is outside blog folder
        post.metadata['path'] = blog_post_path
    
    # Process dates
    try:
        post.metadata['first-published-on'] = dateutil_parser.parse(str(post.metadata['first-published-on']))
        post.metadata['last-updated-on'] = dateutil_parser.parse(str(post.metadata['last-updated-on']))
    except Exception as e:
        print(f"⚠️  Error processing dates for {blog_post_path}: {e}")
    
    # Calculate reading time
    content = post.content
    reading_time_data = calculate_reading_time(content)
    post.metadata.update(reading_time_data)
    
    # Extract topics from content
    title = post.metadata.get('title', '')
    print(f"🧠 Extracting topics for: {title}")
    
    try:
        topic_data = extract_topics_from_content(content, title, use_enhanced=True, config_folder=config_folder)
        
        # Apply topic data to post metadata
        for key, value in topic_data.items():
            post.metadata[key] = value
        
        method = topic_data.get('classification-method', 'unknown')
        primary_topic = topic_data.get('topic-primary', 'unknown')
        print(f"✅ Topic extraction completed: {primary_topic} ({method})")
        
    except Exception as e:
        print(f"❌ Error extracting topics for {title}: {e}")
        # Add fallback topic data
        fallback_data = {
            'topic-primary': 'general-technology',
            'topic-secondary': [],
            'content-entities': [],
            'topic-confidence': 0.0,
            'related-concepts': [],
            'content-complexity': 'intermediate',
            'target-audience': ['general-tech-audience'],
            'classification-method': 'fallback'
        }
        for key, value in fallback_data.items():
            post.metadata[key] = value
    
    # Add processing timestamp
    post.metadata['processed-at'] = datetime.utcnow().isoformat()
    post.metadata['processing-mode'] = 'granular'
    
    print(f"✅ Successfully processed: {title}")
    return post.metadata


def main():
    """Main function for command line usage."""
    parser = argparse.ArgumentParser(
        description="Process individual blog post for topic extraction and metadata generation"
    )
    parser.add_argument("blog_post_path", help="Path to the blog post markdown file")
    parser.add_argument("--config-folder", default="config", help="Path to configuration folder")
    parser.add_argument("--output", help="Output file for processed metadata (JSON)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    if args.verbose:
        print(f"Processing blog post: {args.blog_post_path}")
        print(f"Config folder: {args.config_folder}")
    
    try:
        # Process the single post
        metadata = process_single_blog_post(args.blog_post_path, args.config_folder)
        
        if metadata is None:
            print("Post was skipped (unpublished)")
            return 0
        
        # Output results
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2, default=str)
            print(f"Metadata written to: {args.output}")
        elif args.verbose:
            print("Processed metadata:")
            print(json.dumps(metadata, indent=2, default=str))
        
        print(f"✅ Post processing completed successfully")
        return 0
        
    except Exception as e:
        print(f"❌ Error processing post: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())