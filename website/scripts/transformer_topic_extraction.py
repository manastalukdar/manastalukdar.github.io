"""
Unified Transformer-Based Topic Extraction System
Uses the same embedding model as the search system for consistent semantic understanding.
Combines static topic categories with transformer-based semantic analysis.
"""

import json
import os
import pickle
import re
import time
from collections import defaultdict, Counter
from typing import Dict, List, Tuple, Any, Optional

import numpy as np
import torch
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import silhouette_score
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import frontmatter

# Force CPU usage for transformers to avoid CUDA compatibility issues
os.environ['CUDA_VISIBLE_DEVICES'] = ''
torch.set_default_device('cpu')

def load_sentence_transformer_with_retry(model_name: str, max_retries: int = 3, base_delay: float = 2.0):
    """Load sentence transformer with retry logic for network issues."""
    for attempt in range(max_retries):
        try:
            print(f"Loading sentence transformer model: {model_name} (CPU mode), attempt {attempt + 1}/{max_retries}")
            model = SentenceTransformer(model_name, device='cpu')
            print(f"Successfully loaded {model_name}")
            return model
        except Exception as e:
            if "429" in str(e) or "rate limit" in str(e).lower():
                if attempt < max_retries - 1:
                    delay = base_delay * (2 ** attempt)  # Exponential backoff
                    print(f"Rate limit hit, retrying in {delay} seconds...")
                    time.sleep(delay)
                    continue
                else:
                    print(f"Failed to load model after {max_retries} attempts due to rate limiting")
            raise e
    return None

# Try to import optional advanced topic modeling
try:
    from bertopic import BERTopic
    from umap import UMAP
    from hdbscan import HDBSCAN
    ADVANCED_TOPIC_MODELING_AVAILABLE = True
except ImportError:
    ADVANCED_TOPIC_MODELING_AVAILABLE = False
    print("Advanced topic modeling (BERTopic) not available. Using basic transformer approach.")


class UnifiedTopicExtractor:
    """
    Unified topic extraction using sentence transformers.
    Compatible with the search system's embedding approach.
    """
    
    def __init__(self, config_folder: str, model_name: str = 'all-MiniLM-L6-v2'):
        self.config_folder = config_folder
        self.models_folder = os.path.join(config_folder, 'topic_models')
        self.model_name = model_name
        
        # Create models directory
        os.makedirs(self.models_folder, exist_ok=True)
        
        # Initialize sentence transformer (same as search system) with CPU device and retry logic
        self.sentence_model = load_sentence_transformer_with_retry(model_name)
        
        if self.sentence_model is None:
            raise RuntimeError(f"Failed to load sentence transformer model: {model_name}")
        
        # Load configurations
        self.static_config = self._load_static_config()
        self.dynamic_topics = self._load_dynamic_topics()
        
        # Initialize NLTK components for fallback
        self._ensure_nltk_data()
        self.stop_words = set(stopwords.words('english'))
        self.stop_words.update(self.static_config.get('stopWords', []))
        
        # Cache for category embeddings
        self.category_embeddings = None
        self.category_names = None
        
        # Load or create category embeddings
        self._initialize_category_embeddings()
    
    def _ensure_nltk_data(self):
        """Ensure required NLTK data is downloaded."""
        try:
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
        except LookupError:
            print("Downloading required NLTK data...")
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
    
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
        topics_path = os.path.join(self.models_folder, 'transformer_topics.json')
        try:
            with open(topics_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Info: Transformer topics not found at {topics_path} (will be created)")
            # Create minimal transformer topics file from static categories
            minimal_topics = self._create_minimal_transformer_topics()
            self._save_transformer_topics(minimal_topics)
            return minimal_topics
    
    def _initialize_category_embeddings(self):
        """Create or load embeddings for static categories."""
        embeddings_path = os.path.join(self.models_folder, 'category_embeddings.pkl')
        
        try:
            with open(embeddings_path, 'rb') as f:
                data = pickle.load(f)
                self.category_embeddings = data['embeddings']
                self.category_names = data['names']
                print(f"Loaded category embeddings for {len(self.category_names)} categories")
                return
        except FileNotFoundError:
            pass
        
        # Create category embeddings
        print("Creating category embeddings...")
        topic_categories = self.static_config.get('topicCategories', {})
        
        if not topic_categories:
            print("No topic categories found in config")
            self.category_embeddings = np.array([])
            self.category_names = []
            return
        
        self.category_names = list(topic_categories.keys())
        category_texts = []
        
        for category, terms in topic_categories.items():
            # Create descriptive text for the category
            category_text = f"{category.replace('-', ' ')} {' '.join(terms)}"
            category_texts.append(category_text)
        
        # Generate embeddings
        self.category_embeddings = self.sentence_model.encode(
            category_texts, 
            convert_to_numpy=True,
            show_progress_bar=True
        )
        
        # Save embeddings
        with open(embeddings_path, 'wb') as f:
            pickle.dump({
                'embeddings': self.category_embeddings,
                'names': self.category_names
            }, f)
        
        print(f"Created and saved embeddings for {len(self.category_names)} categories")
    
    def _create_minimal_transformer_topics(self) -> Dict:
        """Create minimal transformer topics from static categories."""
        minimal_topics = {
            'discoveredTopics': {},
            'topicStats': {},
            'documentAssignments': [],
            'metadata': {
                'method': 'static-categories',
                'created': 'initialization',
                'categories_count': len(self.static_config.get('topicCategories', {}))
            }
        }
        
        # Convert static categories to transformer topics format
        categories = self.static_config.get('topicCategories', {})
        for category_name, keywords in categories.items():
            if isinstance(keywords, list) and keywords:
                minimal_topics['discoveredTopics'][category_name] = {
                    'keywords': keywords[:10],  # Limit to top 10
                    'weight': 1.0,
                    'method': 'static-category',
                    'confidence': 1.0
                }
                minimal_topics['topicStats'][category_name] = {
                    'document_count': 0,
                    'avg_confidence': 1.0,
                    'keyword_count': len(keywords[:10])
                }
        
        return minimal_topics
    
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
        return text.strip()
    
    def classify_topic_semantic(self, content: str, title: str = '') -> Tuple[str, float, List[str]]:
        """Classify topic using semantic similarity to category embeddings."""
        if self.category_embeddings.size == 0:
            return 'general-technology', 0.0, []
        
        # Combine title and content with title weighting
        combined_text = f"{title} {title} {content}"
        processed_text = self.preprocess_text(combined_text)
        
        # Generate embedding for the content
        content_embedding = self.sentence_model.encode([processed_text])
        
        # Calculate similarities to all categories
        similarities = cosine_similarity(content_embedding, self.category_embeddings)[0]
        
        # Get sorted indices
        sorted_indices = np.argsort(similarities)[::-1]
        
        # Primary topic (highest similarity)
        primary_idx = sorted_indices[0]
        primary_topic = self.category_names[primary_idx]
        confidence = similarities[primary_idx]
        
        # Secondary topics (next highest similarities above threshold)
        secondary_topics = []
        for idx in sorted_indices[1:4]:
            if similarities[idx] > 0.3:  # Threshold for secondary topics
                secondary_topics.append(self.category_names[idx])
        
        return primary_topic, confidence, secondary_topics
    
    def extract_keywords_semantic(self, content: str, max_keywords: int = 15) -> List[Dict]:
        """Extract keywords using transformer-based approach with fallback to traditional TF."""
        # Preprocess content
        processed_content = self.preprocess_text(content)
        
        # Split into sentences for analysis
        sentences = [s.strip() for s in processed_content.split('.') if len(s.strip()) > 20]
        
        if not sentences:
            return self._extract_keywords_fallback(content, max_keywords)
        
        # Generate embeddings for sentences
        try:
            sentence_embeddings = self.sentence_model.encode(sentences)
        except Exception as e:
            print(f"Error generating sentence embeddings: {e}")
            return self._extract_keywords_fallback(content, max_keywords)
        
        # Extract keywords from high-importance sentences
        # Use centroid approach: sentences close to the document centroid are most representative
        doc_centroid = np.mean(sentence_embeddings, axis=0)
        sentence_similarities = cosine_similarity([doc_centroid], sentence_embeddings)[0]
        
        # Get top sentences
        top_sentence_indices = np.argsort(sentence_similarities)[-5:]  # Top 5 sentences
        important_sentences = [sentences[i] for i in top_sentence_indices]
        
        # Extract keywords from important sentences
        keywords = []
        for sentence in important_sentences:
            words = [word.lower() for word in word_tokenize(sentence) 
                    if len(word) > 2 and word.lower() not in self.stop_words 
                    and re.match(r'^[a-z0-9-]+$', word.lower())]
            
            word_freq = Counter(words)
            for word, freq in word_freq.items():
                category = self._categorize_keyword_semantic(word)
                keywords.append({
                    'term': word,
                    'score': freq * sentence_similarities[top_sentence_indices[0]] if len(top_sentence_indices) > 0 else freq,
                    'category': category,
                    'method': 'transformer-semantic'
                })
        
        # Deduplicate and sort
        keyword_dict = {}
        for kw in keywords:
            term = kw['term']
            if term in keyword_dict:
                keyword_dict[term]['score'] += kw['score']
            else:
                keyword_dict[term] = kw
        
        return sorted(keyword_dict.values(), key=lambda x: x['score'], reverse=True)[:max_keywords]
    
    def _extract_keywords_fallback(self, content: str, max_keywords: int) -> List[Dict]:
        """Fallback keyword extraction using simple TF method."""
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
            category = self._categorize_keyword_semantic(word)
            keywords.append({
                'term': word,
                'score': tf,
                'category': category,
                'method': 'fallback-tf'
            })
        
        return sorted(keywords, key=lambda x: x['score'], reverse=True)[:max_keywords]
    
    def _categorize_keyword_semantic(self, keyword: str) -> str:
        """Categorize keyword using semantic similarity if possible."""
        if self.category_embeddings.size == 0:
            return 'general'
        
        try:
            # Generate embedding for keyword
            keyword_embedding = self.sentence_model.encode([keyword])
            
            # Find most similar category
            similarities = cosine_similarity(keyword_embedding, self.category_embeddings)[0]
            best_category_idx = np.argmax(similarities)
            
            # Only assign to category if similarity is above threshold
            if similarities[best_category_idx] > 0.4:
                return self.category_names[best_category_idx]
            
        except Exception:
            pass
        
        return 'general'
    
    def extract_entities_enhanced(self, content: str) -> List[str]:
        """Enhanced entity extraction using transformers for context understanding."""
        entities = set()
        
        # Traditional entity extraction from static config
        normalized_content = content.lower()
        technical_entities = self.static_config.get('technicalEntities', {})
        for entity_list in technical_entities.values():
            for entity in entity_list:
                if entity.lower() in normalized_content:
                    entities.add(entity)
        
        # Extract proper nouns and technical terms
        proper_nouns = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', content)
        for noun in proper_nouns:
            if len(noun) > 3 and noun.lower() not in self.stop_words:
                entities.add(noun)
        
        # TODO: Add transformer-based NER when needed
        
        return list(entities)[:15]
    
    def assess_content_complexity_enhanced(self, content: str, keywords: List[Dict]) -> str:
        """Enhanced complexity assessment using transformer insights."""
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
        
        # Technical terms factor with transformer method bonus
        transformer_keywords = len([k for k in keywords if k.get('method', '').startswith('transformer')])
        if technical_terms > 15:
            complexity_score += 3
        elif technical_terms > 10:
            complexity_score += 2
        elif technical_terms > 5:
            complexity_score += 1
        
        # Bonus for transformer-detected complexity
        if transformer_keywords > 10:
            complexity_score += 1
        
        # Sentence complexity factor
        if avg_words_per_sentence > 25:
            complexity_score += 2
        elif avg_words_per_sentence > 20:
            complexity_score += 1
        
        # Advanced categories
        advanced_categories = ['artificial-intelligence', 'software-architecture', 'data-engineering']
        has_advanced = any(k['category'] in advanced_categories for k in keywords)
        if has_advanced:
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
    
    def identify_target_audience_enhanced(self, keywords: List[Dict], complexity: str) -> List[str]:
        """Enhanced audience identification with transformer context."""
        audiences = set()
        
        # Category-based audience mapping
        category_audience_map = {
            'artificial-intelligence': ['data-scientists', 'ml-engineers', 'researchers'],
            'data-engineering': ['data-engineers', 'software-engineers', 'architects'],
            'software-architecture': ['architects', 'senior-engineers', 'technical-leads'],
            'leadership-management': ['engineering-managers', 'technical-leads', 'executives'],
            'software-development': ['software-engineers', 'developers'],
            'data-science': ['data-scientists', 'analysts', 'researchers'],
            'cloud-computing': ['devops-engineers', 'cloud-architects', 'software-engineers']
        }
        
        for keyword in keywords:
            category = keyword.get('category', '')
            if category in category_audience_map:
                audiences.update(category_audience_map[category])
        
        # Complexity-based audiences
        if complexity in ['expert', 'advanced']:
            audiences.add('senior-professionals')
        if complexity == 'beginner':
            audiences.update(['students', 'career-changers'])
        
        # Transformer method bonus audiences
        transformer_keywords = [k for k in keywords if k.get('method', '').startswith('transformer')]
        if len(transformer_keywords) > 5:
            audiences.add('technology-enthusiasts')
        
        # Default audience
        if not audiences:
            audiences.add('general-tech-audience')
        
        return list(audiences)[:6]
    
    def extract_topics_unified(self, content: str, title: str = '') -> Dict[str, Any]:
        """Main unified topic extraction function using transformers."""
        try:
            # Semantic topic classification
            primary_topic, confidence, secondary_topics = self.classify_topic_semantic(content, title)
            
            # Extract keywords using transformer approach
            keywords = self.extract_keywords_semantic(content)
            
            # Extract entities
            entities = self.extract_entities_enhanced(content)
            
            # Assess complexity
            complexity = self.assess_content_complexity_enhanced(content, keywords)
            
            # Identify target audience
            target_audience = self.identify_target_audience_enhanced(keywords, complexity)
            
            # Related concepts (top keywords)
            related_concepts = [k['term'] for k in keywords[:8]]
            
            result = {
                'topic-primary': primary_topic,
                'topic-secondary': secondary_topics,
                'content-entities': entities,
                'topic-confidence': round(confidence, 2),
                'related-concepts': related_concepts,
                'content-complexity': complexity,
                'target-audience': target_audience,
                'classification-method': 'transformer-semantic',
                'keyword-count': len(keywords),
                'transformer-keywords': len([k for k in keywords if k.get('method', '').startswith('transformer')])
            }
            
            return result
            
        except Exception as e:
            print(f"Error in unified topic extraction: {e}")
            # Fallback to basic extraction
            return self._extract_topics_fallback(content, title)
    
    def _extract_topics_fallback(self, content: str, title: str) -> Dict[str, Any]:
        """Fallback topic extraction when transformer approach fails."""
        print("Using fallback topic extraction method")
        
        keywords = self._extract_keywords_fallback(content, 15)
        entities = self.extract_entities_enhanced(content)
        complexity = self.assess_content_complexity_enhanced(content, keywords)
        target_audience = self.identify_target_audience_enhanced(keywords, complexity)
        
        # Simple topic classification
        category_scores = defaultdict(float)
        for keyword in keywords:
            if keyword['category'] != 'general':
                category_scores[keyword['category']] += keyword['score']
        
        primary_topic = max(category_scores, key=category_scores.get) if category_scores else 'general-technology'
        secondary_topics = list(category_scores.keys())[:3] if len(category_scores) > 1 else []
        
        return {
            'topic-primary': primary_topic,
            'topic-secondary': secondary_topics,
            'content-entities': entities,
            'topic-confidence': 0.5,  # Low confidence for fallback
            'related-concepts': [k['term'] for k in keywords[:8]],
            'content-complexity': complexity,
            'target-audience': target_audience,
            'classification-method': 'fallback',
            'keyword-count': len(keywords),
            'transformer-keywords': 0
        }
    
    def discover_topics_advanced(self, blog_folder: str) -> Dict[str, Any]:
        """Advanced topic discovery using transformer-based clustering."""
        if not ADVANCED_TOPIC_MODELING_AVAILABLE:
            print("Advanced topic modeling not available. Using basic approach.")
            return self.discover_topics_basic(blog_folder)
        
        print("Starting advanced topic discovery with BERTopic...")
        
        # Collect corpus
        corpus = self._collect_corpus(blog_folder)
        if len(corpus) < 10:
            print("Warning: Too few posts for advanced topic discovery")
            return self.discover_topics_basic(blog_folder)
        
        # Prepare documents
        documents = []
        doc_metadata = []
        
        for post in corpus:
            combined_text = f"{post['title']} {post['content']}"
            processed_text = self.preprocess_text(combined_text)
            documents.append(processed_text)
            doc_metadata.append(post)
        
        try:
            # Initialize BERTopic with our sentence transformer
            umap_model = UMAP(n_neighbors=10, n_components=5, min_dist=0.0, metric='cosine', random_state=42)
            hdbscan_model = HDBSCAN(min_cluster_size=3, metric='euclidean', cluster_selection_method='eom')
            
            topic_model = BERTopic(
                embedding_model=self.sentence_model,
                umap_model=umap_model,
                hdbscan_model=hdbscan_model,
                language='english',
                calculate_probabilities=True,
                verbose=True
            )
            
            # Fit the model
            topics, probs = topic_model.fit_transform(documents)
            
            # Get topic information
            topic_info = topic_model.get_topic_info()
            
            # Create discovered topics structure
            discovered_topics = {
                'discoveredTopics': {},
                'topicStats': {},
                'documentAssignments': []
            }
            
            for _, row in topic_info.iterrows():
                topic_id = row['Topic']
                if topic_id == -1:  # Skip outlier topic
                    continue
                
                topic_keywords = topic_model.get_topic(topic_id)
                
                discovered_topics['discoveredTopics'][topic_id] = {
                    'label': f"topic-{topic_id}",
                    'keywords': [{'term': word, 'score': score} for word, score in topic_keywords],
                    'mapped_category': None,  # TODO: Map to existing categories
                    'document_count': row['Count'],
                    'avg_confidence': float(np.mean([probs[i] for i, t in enumerate(topics) if t == topic_id]))
                }
            
            # Document assignments
            for i, (topic, prob) in enumerate(zip(topics, probs)):
                if topic != -1:
                    discovered_topics['documentAssignments'].append({
                        'path': doc_metadata[i]['path'],
                        'title': doc_metadata[i]['title'],
                        'topic_id': int(topic),
                        'confidence': float(prob),
                        'method': 'bertopic'
                    })
            
            # Save the results
            self._save_transformer_topics(discovered_topics)
            
            print(f"Advanced topic discovery completed! Discovered {len(discovered_topics['discoveredTopics'])} topics")
            return discovered_topics
            
        except Exception as e:
            print(f"Error in advanced topic discovery: {e}")
            return self.discover_topics_basic(blog_folder)
    
    def discover_topics_basic(self, blog_folder: str) -> Dict[str, Any]:
        """Basic topic discovery using sentence transformers + K-means."""
        print("Starting basic transformer-based topic discovery...")
        
        # Collect corpus
        corpus = self._collect_corpus(blog_folder)
        if len(corpus) < 5:
            print("Warning: Too few posts for topic discovery")
            return {'discoveredTopics': {}, 'topicStats': {}, 'documentAssignments': []}
        
        # Prepare documents and generate embeddings
        documents = []
        embeddings = []
        doc_metadata = []
        
        for post in corpus:
            combined_text = f"{post['title']} {post['content']}"
            processed_text = self.preprocess_text(combined_text)
            
            if len(processed_text.split()) < 10:  # Skip very short posts
                continue
            
            documents.append(processed_text)
            doc_metadata.append(post)
        
        if not documents:
            return {'discoveredTopics': {}, 'topicStats': {}, 'documentAssignments': []}
        
        # Generate embeddings
        print(f"Generating embeddings for {len(documents)} documents...")
        embeddings = self.sentence_model.encode(documents, show_progress_bar=True)
        
        # Determine optimal number of clusters
        optimal_k = self._find_optimal_clusters_embeddings(embeddings)
        
        # Perform clustering
        print(f"Performing K-means clustering with {optimal_k} clusters...")
        kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
        cluster_labels = kmeans.fit_predict(embeddings)
        
        # Extract topic keywords for each cluster
        discovered_topics = {
            'discoveredTopics': {},
            'topicStats': {},
            'documentAssignments': []
        }
        
        for cluster_id in range(optimal_k):
            cluster_docs = [documents[i] for i, label in enumerate(cluster_labels) if label == cluster_id]
            cluster_metadata = [doc_metadata[i] for i, label in enumerate(cluster_labels) if label == cluster_id]
            
            # Extract representative keywords for this cluster
            keywords = self._extract_cluster_keywords(cluster_docs)
            
            discovered_topics['discoveredTopics'][cluster_id] = {
                'label': f"transformer-cluster-{cluster_id}",
                'keywords': keywords,
                'mapped_category': None,  # TODO: Map to existing categories
                'document_count': len(cluster_docs),
                'avg_confidence': 0.8  # Fixed confidence for basic clustering
            }
            
            # Add document assignments
            for i, label in enumerate(cluster_labels):
                if label == cluster_id:
                    discovered_topics['documentAssignments'].append({
                        'path': doc_metadata[i]['path'],
                        'title': doc_metadata[i]['title'],
                        'topic_id': int(cluster_id),
                        'confidence': 0.8,
                        'method': 'transformer-kmeans'
                    })
        
        # Save the results
        self._save_transformer_topics(discovered_topics)
        
        print(f"Basic topic discovery completed! Discovered {len(discovered_topics['discoveredTopics'])} topics")
        return discovered_topics
    
    def _collect_corpus(self, blog_folder: str) -> List[Dict]:
        """Collect published blog posts."""
        corpus = []
        
        for root, dirs, files in os.walk(blog_folder):
            dirs.sort()
            for file in files:
                if file.endswith('.md'):
                    file_path = os.path.join(root, file)
                    try:
                        post = frontmatter.load(file_path)
                        if post.metadata.get('published', False):
                            corpus.append({
                                'title': post.metadata.get('title', ''),
                                'content': post.content,
                                'path': os.path.relpath(file_path, blog_folder),
                                'metadata': post.metadata
                            })
                    except Exception as e:
                        print(f"Error processing {file_path}: {e}")
        
        print(f"Collected {len(corpus)} published posts for analysis")
        return corpus
    
    def _find_optimal_clusters_embeddings(self, embeddings: np.ndarray, max_k: int = 10) -> int:
        """Find optimal number of clusters for embeddings using silhouette analysis."""
        n_samples = len(embeddings)
        max_k = min(max_k, n_samples // 2, 15)
        
        if max_k < 2:
            return min(3, n_samples)
        
        best_score = -1
        best_k = min(5, max_k)  # Default fallback
        
        for k in range(2, max_k + 1):
            try:
                kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
                cluster_labels = kmeans.fit_predict(embeddings)
                
                score = silhouette_score(embeddings, cluster_labels)
                print(f"K={k}: silhouette score = {score:.3f}")
                
                if score > best_score:
                    best_score = score
                    best_k = k
                    
            except Exception as e:
                print(f"Error with k={k}: {e}")
                continue
        
        print(f"Optimal number of clusters: {best_k} (score: {best_score:.3f})")
        return best_k
    
    def _extract_cluster_keywords(self, cluster_docs: List[str]) -> List[Dict]:
        """Extract representative keywords for a document cluster."""
        # Combine all documents in the cluster
        combined_text = ' '.join(cluster_docs)
        
        # Extract keywords using transformer approach
        keywords = self.extract_keywords_semantic(combined_text, max_keywords=10)
        
        return keywords
    
    def _save_transformer_topics(self, discovered_topics: Dict):
        """Save discovered topics to JSON file."""
        output_path = os.path.join(self.models_folder, 'transformer_topics.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(discovered_topics, f, indent=2, ensure_ascii=False)
        
        print(f"Saved transformer topics to {output_path}")


def create_unified_extractor(config_folder: str) -> UnifiedTopicExtractor:
    """Factory function to create unified topic extractor."""
    return UnifiedTopicExtractor(config_folder)


def test_unified_extraction(config_folder: str, sample_content: str, sample_title: str = ''):
    """Test the unified topic extraction on sample content."""
    extractor = UnifiedTopicExtractor(config_folder)
    result = extractor.extract_topics_unified(sample_content, sample_title)
    
    print("Unified Transformer Topic Extraction Results:")
    print(f"Primary Topic: {result['topic-primary']}")
    print(f"Secondary Topics: {result['topic-secondary']}")
    print(f"Complexity: {result['content-complexity']}")
    print(f"Confidence: {result['topic-confidence']}")
    print(f"Classification Method: {result['classification-method']}")
    print(f"Keywords: {result['keyword-count']} (transformer: {result['transformer-keywords']})")
    print(f"Related Concepts: {', '.join(result['related-concepts'][:5])}")
    print(f"Target Audience: {', '.join(result['target-audience'][:3])}")
    
    return result


if __name__ == '__main__':
    # Test with sample content
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_folder = os.path.join(os.path.dirname(script_dir), 'config')
    
    sample_content = """
    Machine learning has revolutionized the way we approach data science and artificial intelligence.
    In this comprehensive guide, we'll explore the fundamentals of neural networks, deep learning algorithms,
    and their applications in computer vision and natural language processing. We'll discuss transformer
    architectures, attention mechanisms, and how they've enabled breakthrough models like BERT and GPT.
    The intersection of data engineering and machine learning infrastructure is crucial for building
    scalable AI systems that can handle production workloads effectively.
    """
    
    sample_title = "Advanced Machine Learning with Transformers: A Comprehensive Guide"
    
    test_unified_extraction(config_folder, sample_content, sample_title)