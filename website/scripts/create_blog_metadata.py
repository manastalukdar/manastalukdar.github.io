"""
Script to (1) get list of all blogs along with their metadata from the markdown frontmatter by parsing each markdown file.md from all subdirectories under ..\\blog\\ (2) copy all blog posts markdown files to under dist folder.
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
from dateutil import parser

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


def get_transformer_extractor(config_folder: str):
    """Get cached transformer extractor instance to avoid repeated model loading."""
    global _TRANSFORMER_EXTRACTOR
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


def extract_topics_from_content(content, title='', use_enhanced=True, prefer_transformer=True):
    """Main topic extraction function with unified transformer and enhanced dynamic analysis."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_folder = os.path.join(os.path.dirname(script_dir), 'config')
    
    # Try transformer-based extraction first if available and preferred
    if use_enhanced and prefer_transformer and TRANSFORMER_EXTRACTION_AVAILABLE:
        try:
            print(f"Using transformer-based topic extraction for: {title[:50]}...")
            extractor = get_transformer_extractor(config_folder)
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


def create_posts_list(files, run_topic_discovery=True):
    """Creates the list of posts with enhanced topic extraction."""
    count = 0
    data_all = []
    series_data = {}
    
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
            newPublishedDate = parser.parse(str(post['first-published-on']))
            post['first-published-on'] = newPublishedDate
            newUpdatedDate = parser.parse(str(post['last-updated-on']))
            post['last-updated-on'] = newUpdatedDate
            
            # Calculate reading time
            with open(item[1], 'r', encoding='utf-8') as f:
                content = f.read()
            reading_time = calculate_reading_time(content)
            post['reading-time'] = reading_time
            
            # Extract topics from content using enhanced method
            try:
                topic_data = extract_topics_from_content(content, post.metadata.get('title', ''), use_enhanced=True)
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
    
    # Save posts metadata
    json_data = json.dumps(data_all, default=json_serial)  #, indent=2)
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
    
    # Save series metadata
    json_data = json.dumps(series_list, default=json_serial)
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


def main(run_topic_discovery=True):
    """main method with enhanced topic extraction."""
    initialize()
    files = find_files()
    copy_blog_posts(POSTS_FOLDER, POSTS_DIST_FOLDER)
    create_posts_list(files, run_topic_discovery=run_topic_discovery)
    
    print("\nBlog metadata creation completed with enhanced topic extraction!")


if __name__ == '__main__':
    import sys
    
    # Simple argument parsing for --skip-topics flag
    skip_topics = False
    if '--skip-topics' in sys.argv:
        skip_topics = True
        print("Running with --skip-topics: minimal metadata generation without topic processing")
    
    # Invert the logic: run_topic_discovery = not skip_topics
    main(run_topic_discovery=not skip_topics)
