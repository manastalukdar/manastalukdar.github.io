"""
Simple test for the enhanced topic extraction system without heavy dependencies.
This test validates the integration and basic functionality.
"""

import os
import sys
import json
from pathlib import Path

# Add the scripts directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_static_topic_extraction():
    """Test the static topic extraction components that don't require ML libraries."""
    print("Testing static topic extraction components...")
    
    # Test configuration loading
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_folder = os.path.join(os.path.dirname(script_dir), 'config')
    topic_config_path = os.path.join(config_folder, 'topic-extraction-data.json')
    
    print(f"Looking for config at: {topic_config_path}")
    
    if os.path.exists(topic_config_path):
        with open(topic_config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        print(f"✓ Loaded static config with {len(config.get('topicCategories', {}))} topic categories")
        print(f"✓ Found {len(config.get('technicalEntities', {}))} technical entity groups")
        print(f"✓ Loaded {len(config.get('stopWords', []))} stop words")
    else:
        print("✗ Static topic config not found")
        return False
    
    return True

def test_fallback_extraction():
    """Test the fallback topic extraction logic."""
    print("\nTesting fallback topic extraction...")
    
    # Import the old functions that don't require ML libraries
    try:
        from create_blog_metadata import (
            clean_content_for_topic_extraction,
            extract_keywords,
            categorize_keyword,
            extract_entities,
            assess_content_complexity,
            identify_target_audience
        )
        
        # Test sample content
        sample_content = """
        Machine learning has revolutionized the way we approach data science and artificial intelligence.
        In this comprehensive guide, we'll explore the fundamentals of neural networks, deep learning algorithms,
        and their applications in computer vision and natural language processing.
        Python and TensorFlow are essential tools for implementing these solutions.
        """
        
        # Test content cleaning
        cleaned = clean_content_for_topic_extraction(sample_content)
        print(f"✓ Content cleaning works: {len(cleaned)} chars after cleaning")
        
        # Test keyword extraction
        keywords = extract_keywords(sample_content, max_keywords=10)
        print(f"✓ Keyword extraction works: found {len(keywords)} keywords")
        if keywords:
            print(f"  Top keywords: {', '.join([kw['term'] for kw in keywords[:5]])}")
        
        # Test entity extraction
        entities = extract_entities(sample_content)
        print(f"✓ Entity extraction works: found {len(entities)} entities")
        if entities:
            print(f"  Entities: {', '.join(entities[:5])}")
        
        # Test complexity assessment
        complexity = assess_content_complexity(sample_content, keywords)
        print(f"✓ Complexity assessment works: {complexity}")
        
        # Test audience identification
        audience = identify_target_audience(keywords, complexity)
        print(f"✓ Audience identification works: {', '.join(audience[:3])}")
        
        return True
        
    except Exception as e:
        print(f"✗ Fallback extraction test failed: {e}")
        return False

def test_integration():
    """Test the integration with the main metadata creation script."""
    print("\nTesting integration with metadata creation...")
    
    try:
        from create_blog_metadata import extract_topics_from_content
        
        sample_content = """
        # Introduction to Machine Learning
        
        Machine learning is a subset of artificial intelligence that focuses on algorithms
        and statistical models. This tutorial covers Python implementation using
        scikit-learn and TensorFlow for building neural networks.
        """
        
        sample_title = "Introduction to Machine Learning with Python"
        
        # Test the enhanced extraction (should fallback to static if ML libs not available)
        result = extract_topics_from_content(sample_content, sample_title, use_enhanced=True)
        
        print("✓ Integration test successful!")
        print(f"  Primary Topic: {result['topic-primary']}")
        print(f"  Secondary Topics: {', '.join(result['topic-secondary'][:3])}")
        print(f"  Complexity: {result['content-complexity']}")
        print(f"  Confidence: {result['topic-confidence']}")
        print(f"  Classification Method: {result.get('classification-method', 'unknown')}")
        
        # Verify expected fields are present
        required_fields = [
            'topic-primary', 'topic-secondary', 'content-entities',
            'topic-confidence', 'related-concepts', 'content-complexity',
            'target-audience'
        ]
        
        missing_fields = [field for field in required_fields if field not in result]
        if missing_fields:
            print(f"✗ Missing required fields: {', '.join(missing_fields)}")
            return False
        
        print("✓ All required fields present in result")
        return True
        
    except Exception as e:
        print(f"✗ Integration test failed: {e}")
        return False

def test_directory_structure():
    """Test that the directory structure is set up correctly."""
    print("\nTesting directory structure...")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_folder = os.path.join(os.path.dirname(script_dir), 'config')
    models_folder = os.path.join(config_folder, 'topic_models')
    
    # Check if directories exist
    if not os.path.exists(config_folder):
        print(f"✗ Config folder missing: {config_folder}")
        return False
    
    print(f"✓ Config folder exists: {config_folder}")
    
    # Models folder should be created by topic discovery
    print(f"  Models folder: {models_folder} {'exists' if os.path.exists(models_folder) else 'will be created'}")
    
    return True

def main():
    """Run all tests."""
    print("Enhanced Topic Extraction System Test")
    print("=" * 40)
    
    tests = [
        ("Directory Structure", test_directory_structure),
        ("Static Topic Extraction", test_static_topic_extraction),
        ("Fallback Extraction", test_fallback_extraction),
        ("Integration", test_integration)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        print("-" * len(test_name))
        
        try:
            if test_func():
                passed += 1
                print(f"✓ {test_name} PASSED")
            else:
                print(f"✗ {test_name} FAILED")
        except Exception as e:
            print(f"✗ {test_name} ERROR: {e}")
    
    print("\n" + "=" * 40)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The enhanced topic extraction system is ready.")
        print("\nNext steps:")
        print("1. Install ML dependencies (scikit-learn, nltk, etc.) for full functionality")
        print("2. Run 'python scripts/topic_discovery.py' to discover topics from your blog corpus")
        print("3. Run 'python scripts/create_blog_metadata.py' to generate enhanced metadata")
    else:
        print("⚠️  Some tests failed. Please review the errors above.")
    
    return passed == total

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)