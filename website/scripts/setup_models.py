#!/usr/bin/env python3
"""
Enhanced Topic Extraction System - Python Setup Helper

This module provides utilities for setting up and validating the ML components
of the enhanced topic extraction system. It handles NLTK data downloads,
package verification, and model setup validation.

Usage:
    python setup_models.py [--action ACTION] [--verbose]

Actions:
    download_nltk    Download required NLTK data models
    verify_deps      Verify all dependencies are installed
    test_system      Run basic functionality tests
    all              Run all setup actions (default)
"""

import sys
import os
import json
import tempfile
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)


class SetupError(Exception):
    """Custom exception for setup-related errors."""
    pass


class ModelSetupHelper:
    """Helper class for setting up ML models and dependencies."""
    
    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        if verbose:
            logging.getLogger().setLevel(logging.DEBUG)
        
        # Path configuration
        self.script_dir = Path(__file__).parent
        self.website_dir = self.script_dir.parent
        self.project_root = self.website_dir.parent
        self.config_dir = self.website_dir / 'config'
        self.models_dir = self.config_dir / 'topic_models'
        
        logger.info(f"Setup helper initialized for project at {self.project_root}")
    
    def download_nltk_data(self) -> bool:
        """Download required NLTK data models."""
        logger.info("Downloading NLTK data models...")
        
        try:
            import nltk
        except ImportError:
            raise SetupError("NLTK is not installed. Please install dependencies first.")
        
        # Required NLTK datasets
        datasets = [
            ('punkt', 'Punkt sentence tokenizer'),
            ('punkt_tab', 'Punkt tab sentence tokenizer'),
            ('stopwords', 'Stop words corpus')
        ]
        
        success_count = 0
        
        for dataset_name, description in datasets:
            try:
                logger.info(f"Downloading {description}...")
                nltk.download(dataset_name, quiet=not self.verbose)
                logger.info(f"✓ Successfully downloaded {dataset_name}")
                success_count += 1
                
            except Exception as e:
                logger.error(f"✗ Failed to download {dataset_name}: {e}")
                # For punkt, try punkt_tab as fallback
                if dataset_name == 'punkt':
                    logger.info("Punkt download failed, but punkt_tab should work as fallback")
                    continue
                # For critical datasets, this is an error
                if dataset_name in ['stopwords']:
                    raise SetupError(f"Failed to download critical dataset: {dataset_name}")
        
        logger.info(f"NLTK data download completed: {success_count}/{len(datasets)} successful")
        return success_count >= 2  # Need at least tokenizer and stopwords
    
    def verify_dependencies(self) -> Dict[str, bool]:
        """Verify all required dependencies are installed and importable."""
        logger.info("Verifying Python dependencies...")
        
        # Required packages with their import names and minimum versions
        required_packages = {
            'numpy': ('numpy', '1.24.0'),
            'scipy': ('scipy', '1.10.0'),
            'scikit-learn': ('sklearn', '1.3.0'),
            'nltk': ('nltk', '3.8'),
            'frontmatter': ('frontmatter', None),
            'dateutil': ('dateutil', None),
            'yaml': ('yaml', None)
        }
        
        results = {}
        
        for package_name, (import_name, min_version) in required_packages.items():
            try:
                # Import the package
                module = __import__(import_name)
                
                # Check version if specified
                version_ok = True
                if min_version and hasattr(module, '__version__'):
                    installed_version = module.__version__
                    version_ok = self._compare_versions(installed_version, min_version) >= 0
                    logger.debug(f"{package_name}: {installed_version} (required: {min_version})")
                
                if version_ok:
                    logger.info(f"✓ {package_name} - OK")
                    results[package_name] = True
                else:
                    logger.error(f"✗ {package_name} - Version {installed_version} < {min_version}")
                    results[package_name] = False
                    
            except ImportError as e:
                logger.error(f"✗ {package_name} - Not installed: {e}")
                results[package_name] = False
            except Exception as e:
                logger.error(f"✗ {package_name} - Error: {e}")
                results[package_name] = False
        
        success_count = sum(results.values())
        total_count = len(results)
        logger.info(f"Dependency verification: {success_count}/{total_count} packages OK")
        
        return results
    
    def _compare_versions(self, version1: str, version2: str) -> int:
        """Compare two version strings. Returns -1, 0, or 1."""
        def normalize_version(v):
            return [int(x) for x in v.split('.')]
        
        v1_parts = normalize_version(version1)
        v2_parts = normalize_version(version2)
        
        # Pad shorter version with zeros
        max_len = max(len(v1_parts), len(v2_parts))
        v1_parts.extend([0] * (max_len - len(v1_parts)))
        v2_parts.extend([0] * (max_len - len(v2_parts)))
        
        if v1_parts < v2_parts:
            return -1
        elif v1_parts > v2_parts:
            return 1
        else:
            return 0
    
    def test_basic_functionality(self) -> Dict[str, bool]:
        """Test basic functionality of the topic extraction system."""
        logger.info("Testing basic topic extraction functionality...")
        
        tests = {}
        
        # Test 1: NLTK tokenization
        try:
            import nltk
            from nltk.tokenize import word_tokenize
            
            test_text = "This is a test sentence for tokenization."
            tokens = word_tokenize(test_text)
            
            if len(tokens) > 5:
                logger.info("✓ NLTK tokenization - OK")
                tests['nltk_tokenization'] = True
            else:
                logger.error("✗ NLTK tokenization - Insufficient tokens")
                tests['nltk_tokenization'] = False
                
        except Exception as e:
            logger.error(f"✗ NLTK tokenization - Error: {e}")
            tests['nltk_tokenization'] = False
        
        # Test 2: Stopwords
        try:
            from nltk.corpus import stopwords
            
            stop_words = set(stopwords.words('english'))
            
            if len(stop_words) > 100:
                logger.info("✓ NLTK stopwords - OK")
                tests['nltk_stopwords'] = True
            else:
                logger.error("✗ NLTK stopwords - Insufficient words")
                tests['nltk_stopwords'] = False
                
        except Exception as e:
            logger.error(f"✗ NLTK stopwords - Error: {e}")
            tests['nltk_stopwords'] = False
        
        # Test 3: TF-IDF Vectorizer
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            
            docs = ["This is document one.", "This is document two.", "And another document."]
            vectorizer = TfidfVectorizer(max_features=100)
            tfidf_matrix = vectorizer.fit_transform(docs)
            
            if tfidf_matrix.shape[0] == 3 and tfidf_matrix.shape[1] > 0:
                logger.info("✓ TF-IDF vectorization - OK")
                tests['tfidf_vectorization'] = True
            else:
                logger.error("✗ TF-IDF vectorization - Invalid matrix shape")
                tests['tfidf_vectorization'] = False
                
        except Exception as e:
            logger.error(f"✗ TF-IDF vectorization - Error: {e}")
            tests['tfidf_vectorization'] = False
        
        # Test 4: K-means clustering
        try:
            from sklearn.cluster import KMeans
            import numpy as np
            
            # Create sample data
            data = np.random.rand(10, 5)
            kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
            labels = kmeans.fit_predict(data)
            
            if len(set(labels)) <= 3 and len(labels) == 10:
                logger.info("✓ K-means clustering - OK")
                tests['kmeans_clustering'] = True
            else:
                logger.error("✗ K-means clustering - Invalid results")
                tests['kmeans_clustering'] = False
                
        except Exception as e:
            logger.error(f"✗ K-means clustering - Error: {e}")
            tests['kmeans_clustering'] = False
        
        # Test 5: Topic extraction imports
        try:
            sys.path.append(str(self.script_dir))
            
            # Test static imports
            from create_blog_metadata import (
                clean_content_for_topic_extraction,
                extract_keywords,
                categorize_keyword
            )
            
            # Test dynamic imports (might fail if not fully set up)
            try:
                from topic_discovery import TopicDiscoverySystem
                logger.info("✓ Topic extraction imports (with dynamic) - OK")
                tests['topic_extraction_imports'] = True
            except ImportError:
                logger.info("✓ Topic extraction imports (static only) - OK")
                tests['topic_extraction_imports'] = True
                
        except Exception as e:
            logger.error(f"✗ Topic extraction imports - Error: {e}")
            tests['topic_extraction_imports'] = False
        
        # Test 6: Configuration files
        try:
            config_file = self.config_dir / 'topic-extraction-data.json'
            
            if config_file.exists():
                with open(config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                
                required_keys = ['topicCategories', 'technicalEntities', 'stopWords']
                if all(key in config for key in required_keys):
                    logger.info("✓ Configuration files - OK")
                    tests['configuration_files'] = True
                else:
                    logger.error("✗ Configuration files - Missing required keys")
                    tests['configuration_files'] = False
            else:
                logger.error("✗ Configuration files - topic-extraction-data.json not found")
                tests['configuration_files'] = False
                
        except Exception as e:
            logger.error(f"✗ Configuration files - Error: {e}")
            tests['configuration_files'] = False
        
        success_count = sum(tests.values())
        total_count = len(tests)
        logger.info(f"Functionality tests: {success_count}/{total_count} passed")
        
        return tests
    
    def create_directories(self) -> bool:
        """Create necessary directories for the system."""
        logger.info("Creating necessary directories...")
        
        try:
            # Create config directory
            self.config_dir.mkdir(exist_ok=True, parents=True)
            logger.info(f"✓ Config directory: {self.config_dir}")
            
            # Create models directory
            self.models_dir.mkdir(exist_ok=True, parents=True)
            logger.info(f"✓ Models directory: {self.models_dir}")
            
            # Create public directories if needed
            public_dir = self.website_dir / 'public' / 'blogdata' / 'metadata'
            public_dir.mkdir(exist_ok=True, parents=True)
            logger.info(f"✓ Public metadata directory: {public_dir}")
            
            return True
            
        except Exception as e:
            logger.error(f"✗ Failed to create directories: {e}")
            return False
    
    def validate_blog_corpus(self, blog_folder: Optional[str] = None) -> Dict[str, Any]:
        """Validate the blog corpus for topic extraction."""
        if blog_folder:
            blog_path = Path(blog_folder)
        else:
            blog_path = self.project_root / 'blog'
        
        logger.info(f"Validating blog corpus at {blog_path}...")
        
        if not blog_path.exists():
            raise SetupError(f"Blog folder not found: {blog_path}")
        
        # Count markdown files
        md_files = list(blog_path.rglob('*.md'))
        
        # Count published posts (basic check)
        published_count = 0
        for md_file in md_files:
            try:
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'published: true' in content:
                        published_count += 1
            except Exception:
                continue
        
        validation_result = {
            'blog_path': str(blog_path),
            'total_md_files': len(md_files),
            'published_posts': published_count,
            'valid': published_count > 0
        }
        
        if validation_result['valid']:
            logger.info(f"✓ Blog corpus validation: {published_count} published posts found")
        else:
            logger.error("✗ Blog corpus validation: No published posts found")
        
        return validation_result
    
    def run_all_setup(self, blog_folder: Optional[str] = None) -> Dict[str, Any]:
        """Run all setup procedures."""
        logger.info("Running complete setup validation...")
        
        results = {
            'directories': False,
            'dependencies': {},
            'nltk_data': False,
            'functionality': {},
            'blog_corpus': {},
            'overall_success': False
        }
        
        try:
            # Create directories
            results['directories'] = self.create_directories()
            
            # Verify dependencies
            results['dependencies'] = self.verify_dependencies()
            
            # Download NLTK data
            results['nltk_data'] = self.download_nltk_data()
            
            # Test functionality
            results['functionality'] = self.test_basic_functionality()
            
            # Validate blog corpus
            results['blog_corpus'] = self.validate_blog_corpus(blog_folder)
            
            # Determine overall success
            deps_ok = all(results['dependencies'].values())
            funcs_ok = sum(results['functionality'].values()) >= 4  # At least 4/6 tests
            corpus_ok = results['blog_corpus'].get('valid', False)
            
            results['overall_success'] = (
                results['directories'] and
                deps_ok and
                results['nltk_data'] and
                funcs_ok and
                corpus_ok
            )
            
            if results['overall_success']:
                logger.info("🎉 All setup procedures completed successfully!")
            else:
                logger.warning("⚠️  Setup completed with some issues. System may still work.")
            
        except Exception as e:
            logger.error(f"Setup failed: {e}")
            results['error'] = str(e)
        
        return results


def main():
    """Main function for command-line usage."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Enhanced Topic Extraction System - Python Setup Helper"
    )
    parser.add_argument(
        '--action',
        choices=['download_nltk', 'verify_deps', 'test_system', 'all'],
        default='all',
        help='Setup action to perform'
    )
    parser.add_argument(
        '--blog-folder',
        help='Path to blog folder (optional)'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Enable verbose output'
    )
    
    args = parser.parse_args()
    
    try:
        helper = ModelSetupHelper(verbose=args.verbose)
        
        if args.action == 'download_nltk':
            success = helper.download_nltk_data()
            sys.exit(0 if success else 1)
            
        elif args.action == 'verify_deps':
            results = helper.verify_dependencies()
            success = all(results.values())
            sys.exit(0 if success else 1)
            
        elif args.action == 'test_system':
            results = helper.test_basic_functionality()
            success = sum(results.values()) >= 4
            sys.exit(0 if success else 1)
            
        elif args.action == 'all':
            results = helper.run_all_setup(args.blog_folder)
            sys.exit(0 if results['overall_success'] else 1)
    
    except Exception as e:
        logger.error(f"Setup failed: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()