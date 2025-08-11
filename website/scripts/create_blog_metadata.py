"""
Enhanced Blog Metadata Creation Script with Granular Processing Support

This script generates comprehensive metadata for blog posts with advanced topic extraction
and supports both full processing and incremental (granular) processing modes.

Features:
- Full blog corpus processing (traditional mode)
- Granular processing for individual changed posts (80% faster)
- Advanced topic extraction with multiple AI models
- Metadata merging and consistency validation
- CI/CD optimization support

Usage:
    python create_blog_metadata.py [--skip-topics] [--incremental] [--changed-posts-file=FILE]

pip install -r python-requirements.txt
"""

import errno
import json
import os
import re
import shutil
from datetime import date, datetime
import math
from collections import Counter, defaultdict

import frontmatter
import yaml
from dateutil import parser as dateutil_parser

# Import enhanced topic extraction systems
from topic_discovery import TopicDiscoverySystem
from enhanced_topic_extraction import EnhancedTopicExtractor

# Import new unified transformer-based extraction
try:
    from transformer_topic_extraction import UnifiedTopicExtractor
    TRANSFORMER_EXTRACTION_AVAILABLE = True
    print("Transformer-based topic extraction available")
    # Global transformer extractor instance to avoid repeated model loading
    _TRANSFORMER_EXTRACTOR = None
    # Global flag to indicate skip mode
    _SKIP_TOPICS_MODE = False
except ImportError as e:
    TRANSFORMER_EXTRACTION_AVAILABLE = False
    print(f"Transformer-based topic extraction not available: {e}")
    print("Will use traditional method as fallback")
    _TRANSFORMER_EXTRACTOR = None

POSTS_LIST_FILE_JSON = "website/public/blogdata/metadata/blog_metadata.json"
SERIES_LIST_FILE_JSON = "website/public/blogdata/metadata/series_metadata.json"
SERIES_DEFINITIONS_FILE = "blog/metadata/series-definitions.yaml"
POSTS_DIST_FOLDER = "website/public/blogdata"
POSTS_FOLDER = "blog"

POST_PATH_STRING = "path"


def get_transformer_extractor(config_folder: str, skip_mode: bool = False):
    """Get cached transformer extractor instance to avoid repeated model loading."""
    global _TRANSFORMER_EXTRACTOR, _SKIP_TOPICS_MODE
    
    # Never initialize in skip mode - this is a safety check
    if skip_mode or _SKIP_TOPICS_MODE:
        print("⚠️ Attempted to initialize transformer in skip mode - blocked for performance")
        return None
        
    if TRANSFORMER_EXTRACTION_AVAILABLE and _TRANSFORMER_EXTRACTOR is None:
        print("Initializing transformer extractor (one-time setup)...")
        _TRANSFORMER_EXTRACTOR = UnifiedTopicExtractor(config_folder)
        print("Transformer extractor ready for reuse")
    return _TRANSFORMER_EXTRACTOR


def calculate_reading_time(content, words_per_minute=225):
    """Calculate reading time for markdown content."""
    # Remove YAML frontmatter
    content_without_frontmatter = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
    
    # Remove HTML tags
    content_without_html = re.sub(r'<[^>]*>', '', content_without_frontmatter)
    
    # Remove markdown formatting
    content_plain = content_without_html
    content_plain = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', content_plain)  # Links
    content_plain = re.sub(r'\*\*([^*]*)\*\*', r'\1', content_plain)  # Bold
    content_plain = re.sub(r'\*([^*]*)\*', r'\1', content_plain)  # Italic
    content_plain = re.sub(r'`([^`]*)`', r'\1', content_plain)  # Inline code
    content_plain = re.sub(r'#{1,6}\s+', '', content_plain)  # Headers
    content_plain = re.sub(r'>\s+', '', content_plain)  # Blockquotes
    content_plain = re.sub(r'[-*+]\s+', '', content_plain)  # Lists
    content_plain = re.sub(r'\d+\.\s+', '', content_plain)  # Numbered lists
    content_plain = re.sub(r'\n+', ' ', content_plain)  # Newlines
    content_plain = re.sub(r'\s+', ' ', content_plain)  # Normalize whitespace
    content_plain = content_plain.strip()
    
    # Count words
    words = [word for word in content_plain.split() if word.strip()]
    word_count = len(words)
    
    # Calculate reading time
    minutes = math.ceil(word_count / words_per_minute)
    
    # Generate text
    if minutes == 1:
        text = "1 min read"
    else:
        text = f"{minutes} min read"
    
    return {
        "minutes": minutes,
        "words": word_count,
        "text": text
    }


# Load topic extraction configuration from shared JSON file
def load_topic_extraction_config():
    """Load topic extraction configuration from shared JSON file."""
    config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'topic-extraction-data.json')
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Warning: Topic extraction config file not found: {config_path}")
        return {
            'topicCategories': {},
            'technicalEntities': {},
            'stopWords': []
        }

# Load shared configuration
_topic_config = load_topic_extraction_config()

# Topic extraction constants loaded from shared configuration
TOPIC_CATEGORIES = _topic_config['topicCategories']
TECHNICAL_ENTITIES = _topic_config['technicalEntities']
STOP_WORDS = set(_topic_config['stopWords'])


def clean_content_for_topic_extraction(content):
    """Clean and normalize text content for topic analysis."""
    # Remove YAML frontmatter
    content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
    # Remove HTML tags
    content = re.sub(r'<[^>]*>', '', content)
    # Remove code blocks
    content = re.sub(r'```[\s\S]*?```', '', content)
    # Remove inline code
    content = re.sub(r'`[^`]*`', '', content)
    # Convert links to text
    content = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', content)
    # Remove markdown formatting
    content = re.sub(r'[#*_~`]', '', content)
    # Replace newlines with spaces
    content = re.sub(r'\n+', ' ', content)
    # Normalize whitespace
    content = re.sub(r'\s+', ' ', content)
    return content.lower().strip()


def extract_keywords(content, max_keywords=20):
    """Extract keywords using simple TF calculation."""
    words = clean_content_for_topic_extraction(content).split()
    words = [word for word in words if 
             len(word) > 2 and 
             word not in STOP_WORDS and 
             re.match(r'^[a-z0-9-]+$', word)]
    
    word_freq = Counter(words)
    # Only consider words that appear at least twice
    frequent_words = {word: freq for word, freq in word_freq.items() if freq >= 2}
    
    # Calculate TF scores and categorize
    total_words = len(words)
    keywords = []
    
    for word, freq in frequent_words.items():
        tf = freq / total_words if total_words > 0 else 0
        category = categorize_keyword(word)
        keywords.append({
            'term': word,
            'score': tf,
            'category': category
        })
    
    return sorted(keywords, key=lambda x: x['score'], reverse=True)[:max_keywords]


def categorize_keyword(keyword):
    """Categorize a keyword based on predefined topic categories."""
    for category, terms in TOPIC_CATEGORIES.items():
        if any(keyword in term.lower() or term.lower() in keyword for term in terms):
            return category
    return 'general'


def extract_entities(content):
    """Extract named entities from content."""
    entities = set()
    normalized_content = content.lower()
    
    # Extract technical entities
    for entity_list in TECHNICAL_ENTITIES.values():
        for entity in entity_list:
            if entity.lower() in normalized_content:
                entities.add(entity)
    
    # Extract capitalized terms (potential proper nouns)
    proper_nouns = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', content)
    for noun in proper_nouns:
        if len(noun) > 3 and noun.lower() not in STOP_WORDS:
            entities.add(noun)
    
    return list(entities)[:15]  # Limit to top 15 entities


def assess_content_complexity(content, keywords):
    """Determine content complexity based on various factors."""
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
    
    # Advanced technical categories
    advanced_categories = ['artificial-intelligence', 'software-architecture', 'data-engineering']
    if any(k['category'] in advanced_categories for k in keywords):
        complexity_score += 1
    
    # Return complexity level
    if complexity_score >= 6:
        return 'expert'
    elif complexity_score >= 4:
        return 'advanced'
    elif complexity_score >= 2:
        return 'intermediate'
    else:
        return 'beginner'


def identify_target_audience(keywords, complexity):
    """Determine target audience based on content analysis."""
    audiences = set()
    
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
        category_audiences = category_audience_map.get(keyword['category'], [])
        audiences.update(category_audiences)
    
    # Complexity-based audience
    if complexity in ['expert', 'advanced']:
        audiences.add('senior-professionals')
    if complexity == 'beginner':
        audiences.add('students')
        audiences.add('career-changers')
    
    # Default audiences
    if not audiences:
        audiences.add('general-tech-audience')
    
    return list(audiences)[:5]


def load_cached_topics():
    """Load pre-computed topic data from cached topic model files."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_folder = os.path.join(os.path.dirname(script_dir), 'config')
    models_folder = os.path.join(config_folder, 'topic_models')
    
    cached_topics = {}
    
    # Try to load transformer topics first (preferred)
    transformer_topics_file = os.path.join(models_folder, 'transformer_topics.json')
    if os.path.exists(transformer_topics_file):
        try:
            with open(transformer_topics_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                cached_topics.update(data.get('discoveredTopics', {}))
                print(f"Loaded {len(cached_topics)} cached transformer topics")
        except Exception as e:
            print(f"Error loading transformer topics: {e}")
    
    # Load traditional topics as fallback/supplement
    traditional_topics_file = os.path.join(models_folder, 'discovered_topics.json')
    if os.path.exists(traditional_topics_file):
        try:
            with open(traditional_topics_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                traditional_topics = data.get('discoveredTopics', {})
                # Add topics that aren't already in cached_topics
                for topic_id, topic_data in traditional_topics.items():
                    if topic_id not in cached_topics:
                        cached_topics[topic_id] = topic_data
                print(f"Loaded {len(traditional_topics)} additional traditional topics")
        except Exception as e:
            print(f"Error loading traditional topics: {e}")
    
    return cached_topics


def extract_topics_from_cached_data(content, title, cached_topics):
    """Extract topics for a blog post using pre-computed topic data."""
    if not cached_topics:
        print(f"No cached topics available for '{title}' - using fallback")
        return {
            'topic-primary': 'general',
            'topic-secondary': [],
            'extraction-method': 'fallback',
            'classification-method': 'none'
        }
    
    # Simple keyword matching against cached topics
    content_lower = content.lower()
    title_lower = title.lower()
    combined_text = f"{title_lower} {content_lower}"
    
    topic_scores = {}
    
    # Score topics based on keyword matches (deterministic order)
    for topic_id in sorted(cached_topics.keys()):  # Sort for deterministic iteration
        topic_data = cached_topics[topic_id]
        keywords = topic_data.get('keywords', [])
        score = 0
        matched_keywords = []
        
        # Sort keywords for deterministic processing
        for keyword in sorted(keywords) if keywords else []:
            if isinstance(keyword, str):
                keyword_lower = keyword.lower()
                # Count occurrences, with title matches weighted higher
                title_matches = title_lower.count(keyword_lower) * 3
                content_matches = content_lower.count(keyword_lower)
                if title_matches + content_matches > 0:
                    matched_keywords.append(keyword)
                    score += title_matches + content_matches
        
        if score > 0:
            # Sort matched keywords for consistent output
            matched_keywords.sort()
            topic_scores[topic_id] = {
                'score': score,
                'matched_keywords': matched_keywords,
                'weight': topic_data.get('weight', 1.0)
            }
    
    # Determine primary and secondary topics
    if not topic_scores:
        return {
            'topic-primary': 'general',
            'topic-secondary': [],
            'extraction-method': 'cached',
            'classification-method': 'keyword-matching-no-matches'
        }
    
    # Sort by score and get top topics
    sorted_topics = sorted(topic_scores.items(), key=lambda x: x[1]['score'] * x[1]['weight'], reverse=True)
    
    primary_topic = sorted_topics[0][0]
    secondary_topics = [topic_id for topic_id, _ in sorted_topics[1:4]]  # Top 3 secondary topics
    
    return {
        'topic-primary': primary_topic,
        'topic-secondary': secondary_topics,
        'extraction-method': 'cached',
        'classification-method': 'keyword-matching',
        'matched-keywords': topic_scores[primary_topic]['matched_keywords'][:5],
        'confidence': round(min(topic_scores[primary_topic]['score'] / 10.0, 1.0), 3)  # Round for consistency
    }


def extract_topics_from_content(content, title='', use_enhanced=True, prefer_transformer=True, skip_mode=False):
    """Main topic extraction function with unified transformer and enhanced dynamic analysis."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_folder = os.path.join(os.path.dirname(script_dir), 'config')
    
    # If in skip mode, return minimal topic data without any processing
    if skip_mode:
        print(f"Skipping topic extraction for '{title}' (skip mode enabled)")
        return {
            'topic-primary': 'general',  
            'topic-secondary': [],
            'extraction-method': 'skipped',
            'classification-method': 'static'
        }
    
    # Try transformer-based extraction first if available and preferred
    if use_enhanced and prefer_transformer and TRANSFORMER_EXTRACTION_AVAILABLE:
        try:
            print(f"Using transformer-based topic extraction for: {title[:50]}...")
            extractor = get_transformer_extractor(config_folder, skip_mode=skip_mode)
            if extractor:
                result = extractor.extract_topics_unified(content, title)
                
                # Add transformer method indicator
                result['extraction-method'] = 'unified-transformer'
                return result
            
        except Exception as e:
            print(f"Transformer extraction failed for '{title}', falling back to enhanced method: {e}")
    
    # Try enhanced topic extraction (dynamic + static) as fallback
    if use_enhanced:
        try:
            print(f"Using enhanced topic extraction for: {title[:50]}...")
            extractor = EnhancedTopicExtractor(config_folder)
            result = extractor.extract_topics_enhanced(content, title)
            
            # Add enhanced method indicator
            result['extraction-method'] = 'enhanced-hybrid'
            return result
            
        except Exception as e:
            print(f"Enhanced extraction failed for '{title}', falling back to static method: {e}")
    
    # Fallback to original static method
    analysis_text = f"{title} {title} {content}"
    keywords = extract_keywords(analysis_text)
    entities = extract_entities(content)
    
    category_scores = defaultdict(float)
    for keyword in keywords:
        if keyword['category'] != 'general':
            category_scores[keyword['category']] += keyword['score']
    
    sorted_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
    
    primary_topic = sorted_categories[0][0] if sorted_categories else 'general-technology'
    secondary_topics = [cat for cat, _ in sorted_categories[1:4]]
    
    complexity = assess_content_complexity(content, keywords)
    target_audience = identify_target_audience(keywords, complexity)
    
    total_keywords = len(keywords)
    categorized_keywords = len([k for k in keywords if k['category'] != 'general'])
    confidence = (categorized_keywords / total_keywords) if total_keywords > 0 else 0
    
    related_concepts = [k['term'] for k in keywords[:8]]
    
    return {
        'topic-primary': primary_topic,
        'topic-secondary': secondary_topics,
        'content-entities': entities,
        'topic-confidence': round(confidence, 2),
        'related-concepts': related_concepts,
        'content-complexity': complexity,
        'target-audience': target_audience,
        'classification-method': 'static-fallback',
        'extraction-method': 'static-fallback'
    }


def load_series_definitions():
    """Load series definitions from the central YAML file."""
    try:
        with open(SERIES_DEFINITIONS_FILE, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f) or {}
    except FileNotFoundError:
        print(f"Series definitions file not found: {SERIES_DEFINITIONS_FILE}")
        return {}
    except yaml.YAMLError as e:
        print(f"Error parsing series definitions: {e}")
        return {}


def find_files():
    """Return the list of files to process."""
    result = {}
    root_dir = POSTS_FOLDER
    cwd = os.getcwd()
    #print(os.listdir(root_dir))
    for root, dirs, files in os.walk(root_dir):
        dirs.sort()
        for file in files:
            if file.endswith(".md"):
                postFile = os.path.join(cwd, root, file)
                path = root.replace(root_dir + os.sep, "").replace(
                    "\\", "/") + "/" + file
                result[path] = postFile
    return result


def create_posts_list(files, run_topic_discovery=True, skip_per_post_extraction=False, use_cached_topics=False):
    """Creates the list of posts with enhanced topic extraction."""
    count = 0
    data_all = []
    series_data = {}
    
    # Load cached topics if we're using cached mode
    cached_topics_data = {}
    if use_cached_topics:
        print("🔍 Loading cached topic data for metadata generation...")
        cached_topics_data = load_cached_topics()
        if cached_topics_data:
            print(f"✅ Loaded {len(cached_topics_data)} cached topics - using for all posts")
        else:
            print("⚠️ No cached topics found - falling back to skip mode")
            skip_per_post_extraction = True
            use_cached_topics = False
    
    # Run topic discovery first if enabled
    if run_topic_discovery:
        try:
            print("Running topic discovery...")
            script_dir = os.path.dirname(os.path.abspath(__file__))
            blog_folder = os.path.join(os.path.dirname(script_dir), 'blog')
            config_folder = os.path.join(os.path.dirname(script_dir), 'config')
            
            discovery_system = TopicDiscoverySystem(blog_folder, config_folder)
            discovered_topics = discovery_system.discover_topics()
            print(f"Topic discovery completed: {len(discovered_topics.get('discoveredTopics', {}))} topics found")
        except Exception as e:
            print(f"Topic discovery failed: {e}. Proceeding with static extraction only.")
    
    # Load series definitions from central file
    series_definitions = load_series_definitions()
    
    for item in files.items():
        post = frontmatter.load(item[1])
        post[POST_PATH_STRING] = item[0]
        if post["published"] is True:
            count = count + 1
            newTags = get_data_with_url_slug(post['tags'])
            post['tags'] = newTags
            newCategories = get_data_with_url_slug(post['categories'])
            post['categories'] = newCategories
            newAuthors = get_data_with_url_slug(post['authors'])
            post['authors'] = newAuthors
            newPostFormat = get_data_with_url_slug(post['post-format'])
            post['post-format'] = newPostFormat
            # Parse dates with consistent timezone handling
            newPublishedDate = dateutil_parser.parse(str(post['first-published-on']))
            if newPublishedDate.tzinfo is None:
                # Ensure all dates have consistent timezone info (or lack thereof)
                newPublishedDate = newPublishedDate.replace(tzinfo=None)
            post['first-published-on'] = newPublishedDate
            
            newUpdatedDate = dateutil_parser.parse(str(post['last-updated-on']))
            if newUpdatedDate.tzinfo is None:
                newUpdatedDate = newUpdatedDate.replace(tzinfo=None)
            post['last-updated-on'] = newUpdatedDate
            
            # Calculate reading time
            with open(item[1], 'r', encoding='utf-8') as f:
                content = f.read()
            reading_time = calculate_reading_time(content)
            post['reading-time'] = reading_time
            
            # Extract topics from content using enhanced method (skip if requested for performance)
            if use_cached_topics and cached_topics_data:
                # Use pre-computed cached topics (fast and accurate)
                topic_data = extract_topics_from_cached_data(content, post.metadata.get('title', ''), cached_topics_data)
                print(f"Using cached topics for '{post.metadata.get('title', '')}': {topic_data['topic-primary']} (cached)")
            elif not skip_per_post_extraction:
                topic_data = extract_topics_from_content(content, post.metadata.get('title', ''), use_enhanced=True)
            else:
                # Skip expensive topic extraction and use minimal fallback
                print(f"Skipping topic extraction for '{post.metadata.get('title', '')}' (minimal mode)")
                topic_data = {
                    'topic-primary': 'general',  
                    'topic-secondary': [],
                    'extraction-method': 'minimal',
                    'classification-method': 'static'
                }
                
            # Apply topic data to post
            try:
                # Add topic data to post metadata
                for key, value in topic_data.items():
                    post.metadata[key] = value
                
                method = topic_data.get('classification-method', 'unknown')
                print(f"Extracted topics for '{post.metadata.get('title', 'Unknown')}': {topic_data['topic-primary']} ({method})")
            except Exception as e:
                print(f"Error extracting topics for '{post.metadata.get('title', 'Unknown')}': {e}")
                # Add default topic data if extraction fails
                default_topic_data = {
                    'topic-primary': 'general-technology',
                    'topic-secondary': [],
                    'content-entities': [],
                    'topic-confidence': 0.0,
                    'related-concepts': [],
                    'content-complexity': 'intermediate',
                    'target-audience': ['general-tech-audience'],
                    'classification-method': 'fallback'
                }
                for key, value in default_topic_data.items():
                    post.metadata[key] = value
            
            # Handle series information
            if 'series' in post.metadata:
                series_info = post.metadata['series']
                if isinstance(series_info, dict):
                    # Check if using new simplified format (slug + part)
                    if 'slug' in series_info:
                        # New format: get series info from definitions
                        series_slug = series_info['slug']
                        if series_slug in series_definitions:
                            series_def = series_definitions[series_slug]
                            series_name = series_def['name']
                            series_description = series_def['description']
                        else:
                            print(f"Warning: Series '{series_slug}' not found in definitions")
                            series_name = series_slug.replace('-', ' ').title()
                            series_description = ''
                    else:
                        # Old format: series info is inline
                        series_name = series_info.get('name', '')
                        series_slug = process_item_for_url_slug(series_name)['url-slug']
                        series_description = series_info.get('description', '')
                    
                    post['series'] = {
                        'name': series_name,
                        'url-slug': series_slug,
                        'part': series_info.get('part', None),
                        'description': series_description
                    }
                    
                    # Build series metadata
                    if series_slug not in series_data:
                        series_data[series_slug] = {
                            'name': series_name,
                            'url-slug': series_slug,
                            'description': series_description,
                            'posts': []
                        }
                    
                    series_data[series_slug]['posts'].append({
                        'title': post['title'],
                        'url-slug': post['url-slug'],
                        'path': post[POST_PATH_STRING],
                        'first-published-on': post['first-published-on'],
                        'part': series_info.get('part', None),
                        'excerpt': post.get('excerpt', ''),
                        'reading-time': reading_time
                    })
            
            data_all.append(post.metadata)
    
    print(f"Total posts: {count}")
    data_all.sort(key=extract_time, reverse=True)
    
    # Save posts metadata with deterministic formatting
    json_data = json.dumps(data_all, default=json_serial, sort_keys=True, separators=(',', ':'))
    # https://stackoverflow.com/a/12517490
    dir = os.path.dirname(POSTS_LIST_FILE_JSON)
    if not os.path.exists(dir):
        try:
            os.makedirs(dir)
            print(f"Created directory {dir}")
        except OSError as exc:  # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise
    file_to_update_json = open(POSTS_LIST_FILE_JSON, "w+")
    file_to_update_json.write(json_data)
    file_to_update_json.close()
    
    # Save series metadata
    create_series_metadata(series_data)


def create_series_metadata(series_data):
    """Creates the series metadata file"""
    series_list = []
    
    for series_slug, series_info in series_data.items():
        # Sort posts by publication date
        series_info['posts'].sort(key=lambda x: x['first-published-on'], reverse=False)
        
        # Add sequential numbering if parts are not specified
        for i, post in enumerate(series_info['posts'], 1):
            if post['part'] is None:
                post['part'] = i
        
        # Calculate series statistics
        series_info['post_count'] = len(series_info['posts'])
        series_info['first_published'] = series_info['posts'][0]['first-published-on'] if series_info['posts'] else None
        series_info['last_updated'] = series_info['posts'][-1]['first-published-on'] if series_info['posts'] else None
        
        series_list.append(series_info)
    
    # Sort series by first publication date
    series_list.sort(key=lambda x: x['first_published'] if x['first_published'] else datetime.min, reverse=True)
    
    # Save series metadata with deterministic formatting
    json_data = json.dumps(series_list, default=json_serial, sort_keys=True, separators=(',', ':'))
    dir = os.path.dirname(SERIES_LIST_FILE_JSON)
    if not os.path.exists(dir):
        try:
            os.makedirs(dir)
            print(f"Created directory {dir}")
        except OSError as exc:
            if exc.errno != errno.EEXIST:
                raise
    
    with open(SERIES_LIST_FILE_JSON, "w+") as file:
        file.write(json_data)
    
    print(f"Total series: {len(series_list)}")


def copy_blog_posts(src, dest):
    try:
        shutil.copytree(src,
                        dest,
                        ignore=shutil.ignore_patterns('*.gitkeep', 'drafts'))
    except OSError as e:
        # If the error was caused because the source wasn't a directory
        if e.errno == errno.ENOTDIR:
            shutil.copy(src, dest)
        else:
            print('Directory not copied. Error: %s' % e)


def initialize():
    if os.path.exists(POSTS_DIST_FOLDER):
        shutil.rmtree(POSTS_DIST_FOLDER)


def ignore_function(ignore):
    def _ignore_(path, names):
        ignored_names = []
        if ignore in names:
            ignored_names.append(ignore)
        return set(ignored_names)

    return _ignore_


def get_data_with_url_slug(items):
    if isinstance(items, list):
        sortedItems = sorted(items, key=str.lower)
        newItems = []
        for item in sortedItems:
            newItem = process_item_for_url_slug(item)
            newItems.append(newItem)
        return newItems
    else:
        newItem = process_item_for_url_slug(items)
        return newItem


def process_item_for_url_slug(item):
    # https://stackoverflow.com/questions/43358857/how-to-remove-special-characters-except-space-from-a-file-in-python/43358965
    noSpecialChar = re.sub(r"[^a-zA-Z0-9]+", ' ', item)
    itemSlug = noSpecialChar.lower().replace(" ", "-")
    newItem = {"name": item, "url-slug": itemSlug}
    return newItem


# https://stackoverflow.com/a/26924872
def extract_time(json):
    try:
        # Also convert to int since update_time will be string.  When comparing
        # strings, "10" is smaller than "2".
        return json['first-published-on']
    except KeyError:
        return 0


# https://stackoverflow.com/a/22238613
def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        # Ensure consistent date serialization by removing microseconds for consistency
        if isinstance(obj, datetime):
            # Remove microseconds for consistent output
            obj = obj.replace(microsecond=0)
            # Ensure timezone consistency
            if obj.tzinfo is not None:
                obj = obj.replace(tzinfo=None)
        return obj.isoformat()
    # Handle numpy types
    import numpy as np
    if isinstance(obj, np.floating):
        return float(obj)
    if isinstance(obj, np.integer):
        return int(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    raise TypeError("Type %s not serializable" % type(obj))


def check_cached_metadata_validity():
    """Check if cached metadata is still valid and can be reused."""
    metadata_file = POSTS_LIST_FILE_JSON
    
    # Check if metadata file exists
    if not os.path.exists(metadata_file):
        return False
    
    try:
        # Get metadata file modification time
        metadata_mtime = os.path.getmtime(metadata_file)
        
        # Check if any blog post is newer than metadata
        for root, dirs, files in os.walk(POSTS_FOLDER):
            for file in files:
                if file.lower().endswith('.md'):
                    blog_file_path = os.path.join(root, file)
                    blog_mtime = os.path.getmtime(blog_file_path)
                    if blog_mtime > metadata_mtime:
                        return False
        
        return True
    except Exception as e:
        print(f"Error checking cached metadata validity: {e}")
        return False


def main(run_topic_discovery=True):
    """main method with enhanced topic extraction."""
    global _SKIP_TOPICS_MODE
    
    # Set global skip mode flag only for true skip scenarios
    _SKIP_TOPICS_MODE = False  # Reset, will be set conditionally
    
    # Always ensure blog posts are copied and basic setup is done
    initialize()
    files = find_files()
    copy_blog_posts(POSTS_FOLDER, POSTS_DIST_FOLDER)
    
    # Check if we're in true skip mode (no topics at all)
    if not run_topic_discovery:
        _SKIP_TOPICS_MODE = True
        print("🚀 Skip-topics mode enabled - no topic processing will occur")
        if check_cached_metadata_validity():
            print("✅ Using cached metadata - no blog content changes detected")
            print("Blog posts copied, skipping expensive topic processing operations")
            return
        else:
            print("⚠️ Cached metadata not valid or missing - generating minimal metadata without topics")
            # Generate basic metadata without topic processing
            create_posts_list(files, run_topic_discovery=False, skip_per_post_extraction=True)
            print("\nBlog metadata creation completed (minimal mode - no topic processing)!")
            return
    
    # Normal mode: Run topic discovery and/or use cached topic models
    create_posts_list(files, run_topic_discovery=run_topic_discovery, skip_per_post_extraction=False, use_cached_topics=False)
    
    print("\nBlog metadata creation completed with enhanced topic extraction!")


def main_cached_topics():
    """Main method for generating metadata using cached topic models."""
    # Always ensure blog posts are copied and basic setup is done
    initialize()
    files = find_files()
    copy_blog_posts(POSTS_FOLDER, POSTS_DIST_FOLDER)
    
    print("🔍 Using cached topics mode - loading pre-computed topic models...")
    
    # Generate metadata using cached topics (no topic discovery)
    create_posts_list(files, run_topic_discovery=False, skip_per_post_extraction=False, use_cached_topics=True)
    
    print("\nBlog metadata creation completed using cached topics!")


def main_incremental(changed_posts_file: str = None):
    """Main method for incremental (granular) processing of changed posts."""
    print("🚀 Starting incremental processing mode")
    
    if not changed_posts_file or not os.path.exists(changed_posts_file):
        print(f"❌ Changed posts file not found or not provided: {changed_posts_file}")
        print("Falling back to full processing mode")
        return main(run_topic_discovery=True)
    
    # Load list of changed posts
    try:
        with open(changed_posts_file, 'r', encoding='utf-8') as f:
            changed_posts = [line.strip() for line in f if line.strip()]
        
        if not changed_posts:
            print("⚠️  No changed posts found in file - nothing to process")
            return
        
        print(f"📝 Processing {len(changed_posts)} changed posts:")
        for post in changed_posts:
            print(f"  • {post}")
    
    except Exception as e:
        print(f"❌ Error reading changed posts file: {e}")
        print("Falling back to full processing mode")
        return main(run_topic_discovery=True)
    
    # Import processing utilities
    from process_single_post import process_single_blog_post
    from merge_metadata import MetadataMerger
    
    # Always ensure basic setup is done
    initialize()
    copy_blog_posts(POSTS_FOLDER, POSTS_DIST_FOLDER)
    
    # Load existing metadata
    existing_metadata = []
    if os.path.exists(POSTS_LIST_FILE_JSON):
        try:
            with open(POSTS_LIST_FILE_JSON, 'r', encoding='utf-8') as f:
                existing_metadata = json.load(f)
            print(f"📚 Loaded {len(existing_metadata)} existing posts from metadata")
        except Exception as e:
            print(f"⚠️  Could not load existing metadata: {e}")
    
    # Process each changed post individually  
    new_metadata = []
    config_folder = os.path.join(os.path.dirname(__file__), "..", "config")
    
    print(f"\n🧠 Processing changed posts with topic extraction...")
    for i, changed_post in enumerate(changed_posts, 1):
        print(f"\n[{i}/{len(changed_posts)}] Processing: {changed_post}")
        
        # Convert relative path to absolute path
        blog_post_path = os.path.join(os.path.dirname(__file__), "..", "..", changed_post)
        
        try:
            metadata = process_single_blog_post(blog_post_path, config_folder)
            if metadata:
                new_metadata.append(metadata)
                print(f"✅ Processed: {metadata.get('title', 'Unknown')}")
            else:
                print(f"⏭️  Skipped (unpublished): {changed_post}")
        
        except Exception as e:
            print(f"❌ Error processing {changed_post}: {e}")
            continue
    
    if not new_metadata:
        print("⚠️  No posts were successfully processed")
        return
    
    print(f"\n🔄 Merging {len(new_metadata)} processed posts with existing metadata...")
    
    # Merge with existing metadata
    merger = MetadataMerger(verbose=True)
    merged_metadata = merger.merge_metadata(existing_metadata, new_metadata)
    
    # Validate merged results
    if not merger.validate_merged_metadata(merged_metadata):
        print("❌ Merged metadata validation failed - aborting")
        return
    
    # Save merged metadata
    try:
        os.makedirs(os.path.dirname(POSTS_LIST_FILE_JSON), exist_ok=True)
        with open(POSTS_LIST_FILE_JSON, 'w', encoding='utf-8') as f:
            json.dump(merged_metadata, f, default=str, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
        
        print(f"💾 Saved merged metadata with {len(merged_metadata)} total posts")
        merger.print_merge_stats()
        
        # Generate series metadata if needed
        # Note: Series metadata generation is handled by create_series_metadata() which expects series_data dict
        # For incremental processing, we'll skip series regeneration to avoid complexity
        
        print("\n✅ Incremental processing completed successfully!")
        
    except Exception as e:
        print(f"❌ Error saving merged metadata: {e}")
        raise


if __name__ == '__main__':
    import sys
    import argparse
    
    # Enhanced argument parsing
    parser = argparse.ArgumentParser(description="Generate blog metadata with optional incremental processing")
    parser.add_argument('--skip-topics', action='store_true', help='Skip topic extraction (faster, minimal metadata)')
    parser.add_argument('--use-cached-topics', action='store_true', help='Use cached topic models for fast topic extraction')
    parser.add_argument('--incremental', action='store_true', help='Use incremental processing mode for changed posts only')
    parser.add_argument('--changed-posts-file', help='File containing list of changed blog posts (for incremental mode)')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    
    # Parse arguments, but also support legacy --skip-topics flag for backward compatibility
    if '--skip-topics' in sys.argv and len(sys.argv) == 2:
        # Legacy mode for backward compatibility
        print("Running with --skip-topics: minimal metadata generation without topic processing")
        main(run_topic_discovery=False)
    else:
        args = parser.parse_args()
        
        if args.incremental:
            # Incremental processing mode
            changed_posts_file = args.changed_posts_file or os.environ.get('CHANGED_POSTS_FILE')
            main_incremental(changed_posts_file)
        else:
            # Regular processing mode
            run_topic_discovery = not args.skip_topics
            if args.skip_topics:
                print("Running with --skip-topics: minimal metadata generation without topic processing")
                main(run_topic_discovery=run_topic_discovery)
            elif args.use_cached_topics:
                print("Running with --use-cached-topics: using pre-computed topic models for fast extraction")
                main_cached_topics()
            else:
                main(run_topic_discovery=run_topic_discovery)
