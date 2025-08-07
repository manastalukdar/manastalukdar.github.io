"""
Enhanced Topic Extraction System
Combines traditional static topic classification with dynamic topic discovery.
Provides improved accuracy and adaptability for content classification.
"""

import json
import os
import pickle
import re
from collections import defaultdict, Counter
from typing import Dict, List, Tuple, Any, Optional

import numpy as np
from scipy import sparse
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer


class EnhancedTopicExtractor:
    def __init__(self, config_folder: str):
        self.config_folder = config_folder
        self.models_folder = os.path.join(config_folder, 'topic_models')
        
        # Initialize NLTK components
        self.stemmer = PorterStemmer()
        
        # Load configurations
        self.static_config = self._load_static_config()
        self.dynamic_topics = self._load_dynamic_topics()
        
        # Load trained models
        self.vectorizer = self._load_vectorizer()
        self.clustering_model = self._load_clustering_model()
        
        # Initialize stop words
        self.stop_words = set(stopwords.words('english'))
        self.stop_words.update(self.static_config.get('stopWords', []))
    
    def _load_static_config(self) -> Dict:
        """Load existing static topic extraction configuration."""
        config_path = os.path.join(self.config_folder, 'topic-extraction-data.json')
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Static config not found at {config_path}")
            return {'topicCategories': {}, 'technicalEntities': {}, 'stopWords': []}
    
    def _load_dynamic_topics(self) -> Dict:
        """Load discovered dynamic topics."""
        topics_path = os.path.join(self.models_folder, 'discovered_topics.json')
        try:
            with open(topics_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Dynamic topics not found at {topics_path}")
            return {'discoveredTopics': {}, 'topicStats': {}, 'documentAssignments': []}
    
    def _load_vectorizer(self) -> Optional[TfidfVectorizer]:
        """Load trained TF-IDF vectorizer."""
        vectorizer_path = os.path.join(self.models_folder, 'tfidf_vectorizer.pkl')
        try:
            with open(vectorizer_path, 'rb') as f:
                return pickle.load(f)
        except FileNotFoundError:
            print(f"Warning: Vectorizer not found at {vectorizer_path}")
            return None
    
    def _load_clustering_model(self):
        """Load trained clustering model."""
        clustering_path = os.path.join(self.models_folder, 'topic_clusters.pkl')
        try:
            with open(clustering_path, 'rb') as f:
                return pickle.load(f)
        except FileNotFoundError:
            print(f"Warning: Clustering model not found at {clustering_path}")
            return None
    
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text for analysis."""
        # Remove YAML frontmatter
        text = re.sub(r'^---\n.*?\n---\n', '', text, flags=re.DOTALL)
        # Remove HTML tags
        text = re.sub(r'<[^>]*>', '', text)
        # Remove code blocks
        text = re.sub(r'```[\s\S]*?```', '', text)
        text = re.sub(r'`[^`]*`', '', text)
        # Convert links to text
        text = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', text)
        # Remove markdown formatting
        text = re.sub(r'[#*_~`]', '', text)
        # Remove special characters
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        return text.lower().strip()
    
    def tokenize_and_stem(self, text: str) -> List[str]:
        """Tokenize text and apply stemming."""
        tokens = word_tokenize(text)
        filtered_tokens = []
        
        for token in tokens:
            if (len(token) > 2 and 
                token.lower() not in self.stop_words and
                re.match(r'^[a-z0-9]+$', token.lower()) and
                not token.isdigit()):
                stemmed = self.stemmer.stem(token.lower())
                filtered_tokens.append(stemmed)
        
        return filtered_tokens
    
    def extract_keywords_static(self, content: str, max_keywords: int = 20) -> List[Dict]:
        """Extract keywords using traditional TF method."""
        words = self.preprocess_text(content).split()
        words = [word for word in words if 
                 len(word) > 2 and 
                 word not in self.stop_words and 
                 re.match(r'^[a-z0-9-]+$', word)]
        
        word_freq = Counter(words)
        frequent_words = {word: freq for word, freq in word_freq.items() if freq >= 2}
        
        total_words = len(words)
        keywords = []
        
        for word, freq in frequent_words.items():
            tf = freq / total_words if total_words > 0 else 0
            category = self.categorize_keyword_static(word)
            keywords.append({
                'term': word,
                'score': tf,
                'category': category,
                'method': 'static'
            })
        
        return sorted(keywords, key=lambda x: x['score'], reverse=True)[:max_keywords]
    
    def categorize_keyword_static(self, keyword: str) -> str:
        """Categorize a keyword using static topic categories."""
        topic_categories = self.static_config.get('topicCategories', {})
        
        for category, terms in topic_categories.items():
            if any(keyword in term.lower() or term.lower() in keyword for term in terms):
                return category
        return 'general'
    
    def extract_keywords_dynamic(self, content: str, title: str = '') -> List[Dict]:
        """Extract keywords using dynamic topic discovery."""
        if not self.vectorizer or not self.clustering_model:
            return []
        
        # Prepare text for vectorization
        combined_text = f"{title} {title} {content}"
        preprocessed_text = self.preprocess_text(combined_text)
        
        try:
            # Transform text using trained vectorizer
            tfidf_vector = self.vectorizer.transform([preprocessed_text])
            
            # Predict topic cluster
            predicted_cluster = self.clustering_model.predict(tfidf_vector)[0]
            distances = self.clustering_model.transform(tfidf_vector)[0]
            
            # Calculate confidence
            distance_to_center = distances[predicted_cluster]
            confidence = 1.0 / (1.0 + distance_to_center)
            
            # Get topic information
            discovered_topics = self.dynamic_topics.get('discoveredTopics', {})
            topic_info = discovered_topics.get(str(predicted_cluster), {})
            
            # Extract keywords from topic
            keywords = []
            for kw_info in topic_info.get('keywords', [])[:15]:
                keywords.append({
                    'term': kw_info['term'],
                    'score': kw_info['score'],
                    'category': f"dynamic-{topic_info.get('label', 'unknown')}",
                    'method': 'dynamic',
                    'cluster_id': predicted_cluster,
                    'confidence': confidence
                })
            
            return keywords
            
        except Exception as e:
            print(f"Error in dynamic keyword extraction: {e}")
            return []
    
    def merge_keywords(self, static_keywords: List[Dict], dynamic_keywords: List[Dict]) -> List[Dict]:
        """Merge and deduplicate keywords from both methods."""
        merged = {}
        
        # Add static keywords
        for kw in static_keywords:
            term = kw['term']
            merged[term] = kw
        
        # Add or update with dynamic keywords
        for kw in dynamic_keywords:
            term = kw['term']
            if term in merged:
                # Combine scores and mark as hybrid
                existing = merged[term]
                merged[term] = {
                    'term': term,
                    'score': (existing['score'] + kw['score']) / 2,
                    'category': existing['category'],  # Prefer static category
                    'dynamic_category': kw['category'],
                    'method': 'hybrid',
                    'static_score': existing['score'],
                    'dynamic_score': kw['score'],
                    'confidence': kw.get('confidence', 0)
                }
            else:
                merged[term] = kw
        
        # Return sorted by score
        return sorted(merged.values(), key=lambda x: x['score'], reverse=True)
    
    def classify_topic_static(self, keywords: List[Dict]) -> Tuple[str, List[str], float]:
        """Classify topic using static categories."""
        category_scores = defaultdict(float)
        
        for keyword in keywords:
            if keyword.get('method') in ['static', 'hybrid'] and keyword['category'] != 'general':
                category_scores[keyword['category']] += keyword['score']
        
        if not category_scores:
            return 'general-technology', [], 0.0
        
        sorted_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
        primary_topic = sorted_categories[0][0]
        secondary_topics = [cat for cat, _ in sorted_categories[1:4]]
        
        # Calculate confidence
        total_score = sum(category_scores.values())
        confidence = category_scores[primary_topic] / total_score if total_score > 0 else 0
        
        return primary_topic, secondary_topics, confidence
    
    def classify_topic_dynamic(self, content: str, title: str = '') -> Tuple[Optional[str], float, Dict]:
        """Classify topic using dynamic discovery."""
        if not self.vectorizer or not self.clustering_model:
            return None, 0.0, {}
        
        combined_text = f"{title} {title} {content}"
        preprocessed_text = self.preprocess_text(combined_text)
        
        try:
            tfidf_vector = self.vectorizer.transform([preprocessed_text])
            predicted_cluster = self.clustering_model.predict(tfidf_vector)[0]
            distances = self.clustering_model.transform(tfidf_vector)[0]
            
            distance_to_center = distances[predicted_cluster]
            confidence = 1.0 / (1.0 + distance_to_center)
            
            discovered_topics = self.dynamic_topics.get('discoveredTopics', {})
            topic_info = discovered_topics.get(str(predicted_cluster), {})
            
            return (
                topic_info.get('label', f'cluster-{predicted_cluster}'),
                confidence,
                {
                    'cluster_id': int(predicted_cluster),
                    'mapped_category': topic_info.get('mapped_category'),
                    'top_keywords': topic_info.get('keywords', [])[:5]
                }
            )
            
        except Exception as e:
            print(f"Error in dynamic topic classification: {e}")
            return None, 0.0, {}
    
    def extract_entities(self, content: str) -> List[str]:
        """Extract named entities from content using both static and dynamic methods."""
        entities = set()
        normalized_content = content.lower()
        
        # Static entity extraction
        technical_entities = self.static_config.get('technicalEntities', {})
        for entity_list in technical_entities.values():
            for entity in entity_list:
                if entity.lower() in normalized_content:
                    entities.add(entity)
        
        # Extract proper nouns
        proper_nouns = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', content)
        for noun in proper_nouns:
            if len(noun) > 3 and noun.lower() not in self.stop_words:
                entities.add(noun)
        
        return list(entities)[:15]
    
    def assess_content_complexity(self, content: str, keywords: List[Dict]) -> str:
        """Assess content complexity using enhanced metrics."""
        word_count = len(content.split())
        technical_terms = len([k for k in keywords if k['category'] != 'general'])
        sentences = len(re.split(r'[.!?]+', content))
        avg_words_per_sentence = word_count / sentences if sentences > 0 else 0
        
        complexity_score = 0
        
        # Word count factor
        if word_count > 2000:
            complexity_score += 2
        elif word_count > 1000:
            complexity_score += 1
        
        # Technical terms factor
        if technical_terms > 15:
            complexity_score += 3
        elif technical_terms > 10:
            complexity_score += 2
        elif technical_terms > 5:
            complexity_score += 1
        
        # Sentence complexity factor
        if avg_words_per_sentence > 25:
            complexity_score += 2
        elif avg_words_per_sentence > 20:
            complexity_score += 1
        
        # Advanced categories (both static and dynamic)
        advanced_categories = ['artificial-intelligence', 'software-architecture', 'data-engineering']
        has_advanced_static = any(k['category'] in advanced_categories for k in keywords)
        has_advanced_dynamic = any('dynamic' in k.get('category', '') for k in keywords)
        
        if has_advanced_static or has_advanced_dynamic:
            complexity_score += 1
        
        # Dynamic topic complexity boost
        dynamic_keywords = [k for k in keywords if k.get('method') == 'dynamic']
        if len(dynamic_keywords) > 5:
            complexity_score += 1
        
        # Return complexity level
        if complexity_score >= 7:
            return 'expert'
        elif complexity_score >= 5:
            return 'advanced'
        elif complexity_score >= 2:
            return 'intermediate'
        else:
            return 'beginner'
    
    def identify_target_audience(self, keywords: List[Dict], complexity: str) -> List[str]:
        """Identify target audience using enhanced classification."""
        audiences = set()
        
        # Static category mappings
        category_audience_map = {
            'artificial-intelligence': ['data-scientists', 'ml-engineers', 'researchers'],
            'data-engineering': ['data-engineers', 'software-engineers', 'architects'],
            'software-architecture': ['architects', 'senior-engineers', 'technical-leads'],
            'leadership-management': ['engineering-managers', 'technical-leads', 'executives'],
            'software-development': ['software-engineers', 'developers'],
            'data-science': ['data-scientists', 'analysts', 'researchers'],
            'cloud-computing': ['devops-engineers', 'cloud-architects', 'software-engineers']
        }
        
        # Process static categories
        for keyword in keywords:
            category = keyword.get('category', '')
            if category in category_audience_map:
                audiences.update(category_audience_map[category])
        
        # Process dynamic categories
        dynamic_keywords = [k for k in keywords if k.get('method') == 'dynamic']
        if dynamic_keywords:
            # Add specialized audiences for dynamic topics
            audiences.add('specialized-professionals')
            if any('data' in k.get('category', '').lower() for k in dynamic_keywords):
                audiences.update(['data-professionals', 'analytics-specialists'])
            if any('develop' in k.get('category', '').lower() for k in dynamic_keywords):
                audiences.update(['software-developers', 'engineers'])
        
        # Complexity-based audiences
        if complexity in ['expert', 'advanced']:
            audiences.add('senior-professionals')
        if complexity == 'beginner':
            audiences.update(['students', 'career-changers'])
        
        # Default audience
        if not audiences:
            audiences.add('general-tech-audience')
        
        return list(audiences)[:6]
    
    def extract_topics_enhanced(self, content: str, title: str = '') -> Dict[str, Any]:
        """Main enhanced topic extraction function."""
        # Extract keywords using both methods
        static_keywords = self.extract_keywords_static(content)
        dynamic_keywords = self.extract_keywords_dynamic(content, title)
        
        # Merge keywords
        merged_keywords = self.merge_keywords(static_keywords, dynamic_keywords)
        
        # Classify topics using both methods
        static_primary, static_secondary, static_confidence = self.classify_topic_static(merged_keywords)
        dynamic_topic, dynamic_confidence, dynamic_info = self.classify_topic_dynamic(content, title)
        
        # Choose primary topic based on confidence
        if dynamic_topic and dynamic_confidence > static_confidence + 0.1:
            primary_topic = dynamic_topic
            classification_method = 'dynamic'
            topic_confidence = dynamic_confidence
        else:
            primary_topic = static_primary
            classification_method = 'static'
            topic_confidence = static_confidence
        
        # Extract entities
        entities = self.extract_entities(content)
        
        # Assess complexity
        complexity = self.assess_content_complexity(content, merged_keywords)
        
        # Identify target audience
        target_audience = self.identify_target_audience(merged_keywords, complexity)
        
        # Related concepts (top keywords)
        related_concepts = [k['term'] for k in merged_keywords[:8]]
        
        result = {
            'topic-primary': primary_topic,
            'topic-secondary': static_secondary,
            'content-entities': entities,
            'topic-confidence': round(topic_confidence, 2),
            'related-concepts': related_concepts,
            'content-complexity': complexity,
            'target-audience': target_audience,
            'classification-method': classification_method,
            'keyword-count': len(merged_keywords),
            'static-keywords': len(static_keywords),
            'dynamic-keywords': len(dynamic_keywords)
        }
        
        # Add dynamic topic info if available
        if dynamic_topic and dynamic_info:
            result['dynamic-topic-info'] = {
                'label': dynamic_topic,
                'confidence': dynamic_confidence,
                'cluster-id': dynamic_info.get('cluster_id'),
                'mapped-category': dynamic_info.get('mapped_category')
            }
        
        return result


def create_enhanced_extractor(config_folder: str) -> EnhancedTopicExtractor:
    """Factory function to create enhanced topic extractor."""
    return EnhancedTopicExtractor(config_folder)


# Standalone testing function
def test_extraction(config_folder: str, sample_content: str, sample_title: str = ''):
    """Test the enhanced topic extraction on sample content."""
    extractor = EnhancedTopicExtractor(config_folder)
    result = extractor.extract_topics_enhanced(sample_content, sample_title)
    
    print("Enhanced Topic Extraction Results:")
    print(f"Primary Topic: {result['topic-primary']}")
    print(f"Secondary Topics: {result['topic-secondary']}")
    print(f"Complexity: {result['content-complexity']}")
    print(f"Confidence: {result['topic-confidence']}")
    print(f"Classification Method: {result['classification-method']}")
    print(f"Keywords: {result['keyword-count']} ({result['static-keywords']} static, {result['dynamic-keywords']} dynamic)")
    print(f"Related Concepts: {', '.join(result['related-concepts'][:5])}")
    print(f"Target Audience: {', '.join(result['target-audience'][:3])}")
    
    return result


if __name__ == '__main__':
    # Test with sample content
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_folder = os.path.join(os.path.dirname(script_dir), 'website', 'config')
    
    sample_content = """
    Machine learning has revolutionized the way we approach data science and artificial intelligence.
    In this comprehensive guide, we'll explore the fundamentals of neural networks, deep learning algorithms,
    and their applications in computer vision and natural language processing.
    """
    
    sample_title = "Introduction to Machine Learning and Deep Learning"
    
    test_extraction(config_folder, sample_content, sample_title)