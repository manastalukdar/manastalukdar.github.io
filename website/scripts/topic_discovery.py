"""
Dynamic Topic Discovery System
Analyzes the entire blog corpus to discover topics using unsupervised machine learning.
Uses TF-IDF vectorization, K-means clustering, and LSA for topic discovery.
"""

import json
import os
import pickle
import re
from collections import defaultdict, Counter
from typing import Dict, List, Tuple, Any

import numpy as np
from scipy import sparse
from sklearn.cluster import KMeans
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import silhouette_score
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import PorterStemmer
import frontmatter


class TopicDiscoverySystem:
    def __init__(self, blog_folder: str, config_folder: str):
        self.blog_folder = blog_folder
        self.config_folder = config_folder
        self.models_folder = os.path.join(config_folder, 'topic_models')
        
        # Create models directory
        os.makedirs(self.models_folder, exist_ok=True)
        
        # Initialize NLTK components
        self._ensure_nltk_data()
        self.stemmer = PorterStemmer()
        
        # Load existing topic configuration
        self.existing_config = self._load_existing_config()
        
        # Initialize stop words
        self.stop_words = set(stopwords.words('english'))
        self.stop_words.update(self.existing_config.get('stopWords', []))
        
        # Add technical stop words
        self.stop_words.update(['code', 'example', 'function', 'method', 'class', 'variable', 
                               'parameter', 'return', 'value', 'string', 'number', 'object', 
                               'array', 'boolean', 'null', 'undefined', 'true', 'false',
                               'blog', 'post', 'article', 'tutorial', 'guide', 'introduction'])
    
    def _ensure_nltk_data(self):
        """Ensure required NLTK data is downloaded."""
        try:
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
        except LookupError:
            print("Downloading required NLTK data...")
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
    
    def _load_existing_config(self) -> Dict:
        """Load existing topic extraction configuration."""
        config_path = os.path.join(self.config_folder, 'topic-extraction-data.json')
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Existing config not found at {config_path}")
            return {'topicCategories': {}, 'technicalEntities': {}, 'stopWords': []}
    
    def collect_corpus(self) -> List[Dict[str, Any]]:
        """Collect all published blog posts into a corpus."""
        corpus = []
        
        for root, dirs, files in os.walk(self.blog_folder):
            dirs.sort()
            for file in files:
                if file.endswith('.md'):
                    file_path = os.path.join(root, file)
                    try:
                        post = frontmatter.load(file_path)
                        if post.metadata.get('published', False):
                            # Read full content
                            with open(file_path, 'r', encoding='utf-8') as f:
                                content = f.read()
                            
                            corpus.append({
                                'title': post.metadata.get('title', ''),
                                'content': post.content,
                                'full_content': content,
                                'path': os.path.relpath(file_path, self.blog_folder),
                                'metadata': post.metadata
                            })
                    except Exception as e:
                        print(f"Error processing {file_path}: {e}")
        
        print(f"Collected {len(corpus)} published posts for analysis")
        return corpus
    
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
        
        # Remove special characters, keep alphanumeric and spaces
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        
        return text.lower().strip()
    
    def tokenize_and_stem(self, text: str) -> List[str]:
        """Tokenize text and apply stemming."""
        # Tokenize
        tokens = word_tokenize(text)
        
        # Filter tokens
        filtered_tokens = []
        for token in tokens:
            if (len(token) > 2 and 
                token.lower() not in self.stop_words and
                re.match(r'^[a-z0-9]+$', token.lower()) and
                not token.isdigit()):
                # Apply stemming
                stemmed = self.stemmer.stem(token.lower())
                filtered_tokens.append(stemmed)
        
        return filtered_tokens
    
    def build_tfidf_vectors(self, corpus: List[Dict]) -> Tuple[sparse.csr_matrix, TfidfVectorizer, List[str]]:
        """Build TF-IDF vectors for the corpus."""
        print("Building TF-IDF vectors...")
        
        # Prepare documents
        documents = []
        doc_ids = []
        
        for post in corpus:
            # Combine title (weighted) and content
            title = post['title']
            content = post['content']
            
            # Weight title by repeating it 3 times
            combined_text = f"{title} {title} {title} {content}"
            
            # Preprocess text
            preprocessed = self.preprocess_text(combined_text)
            documents.append(preprocessed)
            doc_ids.append(post['path'])
        
        # Configure TF-IDF vectorizer
        vectorizer = TfidfVectorizer(
            max_features=5000,  # Limit vocabulary size
            min_df=2,           # Ignore terms that appear in less than 2 documents
            max_df=0.8,         # Ignore terms that appear in more than 80% of documents
            ngram_range=(1, 2), # Include unigrams and bigrams
            tokenizer=self.tokenize_and_stem,
            lowercase=True,
            stop_words=None     # We handle stop words in tokenizer
        )
        
        # Fit and transform documents
        tfidf_matrix = vectorizer.fit_transform(documents)
        
        print(f"Created TF-IDF matrix with shape: {tfidf_matrix.shape}")
        
        # Save vectorizer
        vectorizer_path = os.path.join(self.models_folder, 'tfidf_vectorizer.pkl')
        with open(vectorizer_path, 'wb') as f:
            pickle.dump(vectorizer, f)
        
        return tfidf_matrix, vectorizer, doc_ids
    
    def find_optimal_clusters(self, tfidf_matrix: sparse.csr_matrix, max_k: int = 15) -> int:
        """Find optimal number of clusters using silhouette analysis."""
        print("Finding optimal number of clusters...")
        
        # Limit max_k to reasonable values
        n_samples = tfidf_matrix.shape[0]
        max_k = min(max_k, n_samples // 2, 15)
        
        if max_k < 2:
            return 2
        
        best_score = -1
        best_k = 5  # Default fallback
        
        # Convert to dense for silhouette analysis (if not too large)
        if tfidf_matrix.shape[0] < 1000 and tfidf_matrix.shape[1] < 1000:
            dense_matrix = tfidf_matrix.toarray()
            use_dense = True
        else:
            dense_matrix = tfidf_matrix
            use_dense = False
        
        for k in range(2, max_k + 1):
            try:
                kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
                cluster_labels = kmeans.fit_predict(tfidf_matrix)
                
                # Calculate silhouette score
                if use_dense:
                    score = silhouette_score(dense_matrix, cluster_labels)
                else:
                    # For large matrices, sample subset for silhouette analysis
                    sample_size = min(500, len(cluster_labels))
                    indices = np.random.choice(len(cluster_labels), sample_size, replace=False)
                    score = silhouette_score(tfidf_matrix[indices], cluster_labels[indices])
                
                print(f"K={k}: silhouette score = {score:.3f}")
                
                if score > best_score:
                    best_score = score
                    best_k = k
                    
            except Exception as e:
                print(f"Error with k={k}: {e}")
                continue
        
        print(f"Optimal number of clusters: {best_k} (score: {best_score:.3f})")
        return best_k
    
    def perform_clustering(self, tfidf_matrix: sparse.csr_matrix, n_clusters: int) -> KMeans:
        """Perform K-means clustering on TF-IDF vectors."""
        print(f"Performing clustering with {n_clusters} clusters...")
        
        kmeans = KMeans(
            n_clusters=n_clusters,
            random_state=42,
            n_init=10,
            max_iter=300
        )
        
        kmeans.fit(tfidf_matrix)
        
        # Save clustering model
        clustering_path = os.path.join(self.models_folder, 'topic_clusters.pkl')
        with open(clustering_path, 'wb') as f:
            pickle.dump(kmeans, f)
        
        return kmeans
    
    def extract_topic_keywords(self, 
                             vectorizer: TfidfVectorizer, 
                             kmeans: KMeans, 
                             top_k: int = 15) -> Dict[int, List[Tuple[str, float]]]:
        """Extract top keywords for each topic cluster."""
        print("Extracting topic keywords...")
        
        feature_names = vectorizer.get_feature_names_out()
        topic_keywords = {}
        
        for cluster_id in range(kmeans.n_clusters):
            # Get cluster center
            center = kmeans.cluster_centers_[cluster_id]
            
            # Get top keywords for this cluster
            top_indices = center.argsort()[-top_k:][::-1]
            keywords = [(feature_names[i], center[i]) for i in top_indices]
            
            topic_keywords[cluster_id] = keywords
            
            # Print topic summary
            keyword_names = [kw[0] for kw in keywords[:8]]
            print(f"Topic {cluster_id}: {', '.join(keyword_names)}")
        
        return topic_keywords
    
    def generate_topic_labels(self, topic_keywords: Dict[int, List[Tuple[str, float]]]) -> Dict[int, str]:
        """Generate human-readable labels for discovered topics."""
        topic_labels = {}
        
        for cluster_id, keywords in topic_keywords.items():
            # Take top 3 keywords to form label
            top_words = [kw[0] for kw in keywords[:3]]
            
            # Clean up stemmed words for label
            cleaned_words = []
            for word in top_words:
                # Simple heuristic to reconstruct common words
                if word.endswith('i'):  # Likely plural -> singular
                    cleaned_words.append(word + 's')
                elif word in ['develop', 'program', 'manag']:
                    cleaned_words.append(word + 'ment')
                elif word in ['learn', 'machin']:
                    if word == 'learn':
                        cleaned_words.append('learning')
                    else:
                        cleaned_words.append('machine')
                else:
                    cleaned_words.append(word)
            
            # Create label
            label = '-'.join(cleaned_words)
            topic_labels[cluster_id] = label
        
        return topic_labels
    
    def map_to_existing_categories(self, topic_keywords: Dict[int, List[Tuple[str, float]]]) -> Dict[int, str]:
        """Map discovered topics to existing categories where possible."""
        existing_categories = self.existing_config.get('topicCategories', {})
        topic_mapping = {}
        
        for cluster_id, keywords in topic_keywords.items():
            cluster_words = set(kw[0] for kw in keywords)
            best_match = None
            best_score = 0
            
            # Check overlap with existing categories
            for category, terms in existing_categories.items():
                category_words = set(term.lower() for term in terms)
                # Stem category words for comparison
                stemmed_category_words = set(self.stemmer.stem(word) for word in category_words)
                
                # Calculate overlap score
                overlap = len(cluster_words.intersection(stemmed_category_words))
                score = overlap / len(cluster_words) if cluster_words else 0
                
                if score > best_score and score > 0.2:  # At least 20% overlap
                    best_match = category
                    best_score = score
            
            topic_mapping[cluster_id] = best_match
        
        return topic_mapping
    
    def discover_topics(self, min_clusters: int = 3, max_clusters: int = 12) -> Dict[str, Any]:
        """Main method to discover topics from the corpus."""
        print("Starting topic discovery...")
        
        # Step 1: Collect corpus
        corpus = self.collect_corpus()
        if len(corpus) < 3:
            print("Warning: Too few posts for meaningful topic discovery")
            return self._create_fallback_topics()
        
        # Step 2: Build TF-IDF vectors
        tfidf_matrix, vectorizer, doc_ids = self.build_tfidf_vectors(corpus)
        
        # Step 3: Find optimal number of clusters
        optimal_k = self.find_optimal_clusters(tfidf_matrix, max_clusters)
        optimal_k = max(min_clusters, min(optimal_k, max_clusters))
        
        # Step 4: Perform clustering
        kmeans = self.perform_clustering(tfidf_matrix, optimal_k)
        
        # Step 5: Extract topic keywords
        topic_keywords = self.extract_topic_keywords(vectorizer, kmeans, top_k=15)
        
        # Step 6: Generate topic labels
        topic_labels = self.generate_topic_labels(topic_keywords)
        
        # Step 7: Map to existing categories
        category_mapping = self.map_to_existing_categories(topic_keywords)
        
        # Step 8: Assign documents to topics
        doc_topics = self.assign_documents_to_topics(kmeans, tfidf_matrix, doc_ids, corpus)
        
        # Step 9: Create discovered topics structure
        discovered_topics = self._create_discovered_topics_structure(
            topic_keywords, topic_labels, category_mapping, doc_topics
        )
        
        # Step 10: Save results
        self._save_discovered_topics(discovered_topics)
        
        print(f"Topic discovery completed! Discovered {len(discovered_topics['discoveredTopics'])} topics")
        return discovered_topics
    
    def assign_documents_to_topics(self, kmeans, tfidf_matrix, doc_ids, corpus):
        """Assign documents to their closest topics with confidence scores."""
        cluster_assignments = kmeans.predict(tfidf_matrix)
        distances = kmeans.transform(tfidf_matrix)
        
        doc_topics = []
        for i, (cluster_id, doc_id) in enumerate(zip(cluster_assignments, doc_ids)):
            # Calculate confidence (inverse of distance to cluster center)
            distance_to_center = distances[i][cluster_id]
            confidence = 1.0 / (1.0 + distance_to_center)
            
            doc_topics.append({
                'path': doc_id,
                'title': corpus[i]['title'],
                'topic_id': int(cluster_id),
                'confidence': float(confidence),
                'distance': float(distance_to_center)
            })
        
        return doc_topics
    
    def _create_discovered_topics_structure(self, topic_keywords, topic_labels, category_mapping, doc_topics):
        """Create the final discovered topics data structure."""
        discovered_topics = {
            'discoveredTopics': {},
            'topicStats': {},
            'documentAssignments': doc_topics
        }
        
        for cluster_id, keywords in topic_keywords.items():
            # Get posts assigned to this topic
            topic_docs = [doc for doc in doc_topics if doc['topic_id'] == cluster_id]
            
            discovered_topics['discoveredTopics'][cluster_id] = {
                'label': topic_labels[cluster_id],
                'keywords': [{'term': kw[0], 'score': float(kw[1])} for kw in keywords],
                'mapped_category': category_mapping.get(cluster_id),
                'document_count': len(topic_docs),
                'avg_confidence': np.mean([doc['confidence'] for doc in topic_docs]) if topic_docs else 0
            }
            
            discovered_topics['topicStats'][cluster_id] = {
                'total_posts': len(topic_docs),
                'avg_confidence': float(np.mean([doc['confidence'] for doc in topic_docs])) if topic_docs else 0,
                'top_keywords': [kw[0] for kw in keywords[:5]]
            }
        
        return discovered_topics
    
    def _create_fallback_topics(self):
        """Create fallback topic structure when discovery fails."""
        return {
            'discoveredTopics': {},
            'topicStats': {},
            'documentAssignments': [],
            'fallback': True
        }
    
    def _save_discovered_topics(self, discovered_topics):
        """Save discovered topics to JSON file."""
        output_path = os.path.join(self.models_folder, 'discovered_topics.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(discovered_topics, f, indent=2, ensure_ascii=False)
        
        print(f"Saved discovered topics to {output_path}")


def main():
    """Main function to run topic discovery."""
    # Paths relative to script location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    website_dir = os.path.dirname(script_dir)  # website/
    project_root = os.path.dirname(website_dir)  # project root
    blog_folder = os.path.join(project_root, 'blog')
    config_folder = os.path.join(website_dir, 'config')
    
    # Create and run topic discovery
    discovery_system = TopicDiscoverySystem(blog_folder, config_folder)
    discovered_topics = discovery_system.discover_topics()
    
    print(f"\nTopic Discovery Summary:")
    print(f"- Discovered {len(discovered_topics.get('discoveredTopics', {}))} topics")
    print(f"- Processed {len(discovered_topics.get('documentAssignments', []))} documents")
    
    return discovered_topics


if __name__ == '__main__':
    main()