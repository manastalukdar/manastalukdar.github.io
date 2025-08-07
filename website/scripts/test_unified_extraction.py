#!/usr/bin/env python3
"""
Test script for the unified transformer-based topic extraction system.
Verifies that the new system works correctly and compares with existing approaches.
"""

import os
import sys
import traceback

# Add the scripts directory to Python path
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, script_dir)

def test_transformer_extraction():
    """Test transformer-based topic extraction."""
    print("=" * 60)
    print("TESTING TRANSFORMER-BASED TOPIC EXTRACTION")
    print("=" * 60)
    
    try:
        from transformer_topic_extraction import UnifiedTopicExtractor
        
        config_folder = os.path.join(os.path.dirname(script_dir), 'config')
        
        sample_content = """
        Machine learning has revolutionized the way we approach data science and artificial intelligence.
        In this comprehensive guide, we'll explore advanced transformer architectures, attention mechanisms,
        and their applications in natural language processing. We'll discuss how BERT, GPT, and other
        transformer models have enabled breakthrough performance in various AI tasks. The intersection
        of data engineering and machine learning infrastructure is crucial for building scalable AI systems
        that can handle production workloads effectively. Cloud computing platforms like AWS, Azure, and
        Google Cloud provide the necessary tools for deploying these sophisticated models at scale.
        Software architecture considerations become paramount when designing enterprise AI solutions.
        """
        
        sample_title = "Advanced Transformer Architectures for Enterprise AI Systems"
        
        print(f"Testing with title: {sample_title}")
        print(f"Content length: {len(sample_content)} characters")
        print()
        
        extractor = UnifiedTopicExtractor(config_folder)
        result = extractor.extract_topics_unified(sample_content, sample_title)
        
        print("TRANSFORMER EXTRACTION RESULTS:")
        print(f"✓ Primary Topic: {result['topic-primary']}")
        print(f"✓ Secondary Topics: {result['topic-secondary']}")
        print(f"✓ Confidence: {result['topic-confidence']}")
        print(f"✓ Classification Method: {result['classification-method']}")
        print(f"✓ Content Complexity: {result['content-complexity']}")
        print(f"✓ Target Audience: {', '.join(result['target-audience'][:3])}")
        print(f"✓ Related Concepts: {', '.join(result['related-concepts'][:5])}")
        print(f"✓ Keyword Count: {result['keyword-count']} (transformer: {result['transformer-keywords']})")
        
        return True
        
    except ImportError as e:
        print(f"❌ Transformer extraction not available: {e}")
        return False
    except Exception as e:
        print(f"❌ Error in transformer extraction: {e}")
        traceback.print_exc()
        return False

def test_enhanced_extraction():
    """Test enhanced topic extraction as fallback."""
    print("\n" + "=" * 60)
    print("TESTING ENHANCED TOPIC EXTRACTION (FALLBACK)")
    print("=" * 60)
    
    try:
        from enhanced_topic_extraction import EnhancedTopicExtractor
        
        config_folder = os.path.join(os.path.dirname(script_dir), 'config')
        
        sample_content = """
        Data engineering pipelines require careful consideration of scalability and performance.
        Apache Spark, Kafka, and Airflow are essential tools for building robust data infrastructure.
        Modern data lakes and warehouses leverage cloud technologies for efficient storage and processing.
        Machine learning workflows depend on reliable data pipelines to ensure model accuracy and performance.
        """
        
        sample_title = "Building Scalable Data Engineering Pipelines"
        
        print(f"Testing with title: {sample_title}")
        print(f"Content length: {len(sample_content)} characters")
        print()
        
        extractor = EnhancedTopicExtractor(config_folder)
        result = extractor.extract_topics_enhanced(sample_content, sample_title)
        
        print("ENHANCED EXTRACTION RESULTS:")
        print(f"✓ Primary Topic: {result['topic-primary']}")
        print(f"✓ Secondary Topics: {result['topic-secondary']}")
        print(f"✓ Confidence: {result['topic-confidence']}")
        print(f"✓ Classification Method: {result['classification-method']}")
        print(f"✓ Content Complexity: {result['content-complexity']}")
        print(f"✓ Target Audience: {', '.join(result['target-audience'][:3])}")
        print(f"✓ Related Concepts: {', '.join(result['related-concepts'][:5])}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error in enhanced extraction: {e}")
        traceback.print_exc()
        return False

def test_unified_integration():
    """Test the unified integration in create_blog_metadata.py."""
    print("\n" + "=" * 60)
    print("TESTING UNIFIED INTEGRATION")
    print("=" * 60)
    
    try:
        from create_blog_metadata import extract_topics_from_content
        
        sample_content = """
        Leadership in engineering organizations requires balancing technical excellence with people management.
        Effective engineering managers must understand both software architecture and team dynamics.
        Agile methodologies, when properly implemented, can significantly improve development velocity
        and team satisfaction. Building high-performing engineering teams involves continuous learning,
        mentoring, and creating an environment where innovation thrives.
        """
        
        sample_title = "Leadership Strategies for High-Performing Engineering Teams"
        
        print(f"Testing with title: {sample_title}")
        print(f"Content length: {len(sample_content)} characters")
        print()
        
        # Test with transformer preference
        print("Testing with transformer preference...")
        result = extract_topics_from_content(sample_content, sample_title, 
                                           use_enhanced=True, prefer_transformer=True)
        
        print("UNIFIED INTEGRATION RESULTS:")
        print(f"✓ Primary Topic: {result['topic-primary']}")
        print(f"✓ Secondary Topics: {result['topic-secondary']}")
        print(f"✓ Confidence: {result['topic-confidence']}")
        print(f"✓ Extraction Method: {result.get('extraction-method', 'not-specified')}")
        print(f"✓ Classification Method: {result.get('classification-method', 'not-specified')}")
        print(f"✓ Content Complexity: {result['content-complexity']}")
        print(f"✓ Target Audience: {', '.join(result['target-audience'][:3])}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error in unified integration: {e}")
        traceback.print_exc()
        return False

def main():
    """Run all tests."""
    print("UNIFIED TRANSFORMER TOPIC EXTRACTION TEST SUITE")
    print("=" * 60)
    print()
    
    results = {
        'transformer': test_transformer_extraction(),
        'enhanced': test_enhanced_extraction(),
        'unified': test_unified_integration()
    }
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    for test_name, success in results.items():
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{test_name.upper():15} {status}")
    
    passed = sum(results.values())
    total = len(results)
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The unified transformer system is ready.")
    else:
        print("⚠️  Some tests failed. Check the error messages above.")
    
    return passed == total

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)