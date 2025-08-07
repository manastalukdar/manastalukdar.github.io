#!/usr/bin/env python3
"""
Dynamic Topic Configuration Generator
Analyzes blog content to automatically generate and enhance topic-extraction-data.json
with content-specific keywords, technical entities, and optimized stop words.
"""

import json
import os
import re
import sys
from collections import defaultdict, Counter
from pathlib import Path
from typing import Dict, List, Set, Tuple, Any
import frontmatter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer


class TopicConfigGenerator:
    def __init__(self, blog_folder: str = "blog", config_folder: str = "website/config"):
        self.blog_folder = Path(blog_folder)
        self.config_folder = Path(config_folder)
        self.stemmer = PorterStemmer()
        
        # Ensure NLTK data is available
        try:
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
        except LookupError:
            print("Downloading required NLTK data...")
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
        
        self.stop_words = set(stopwords.words('english'))
        
        # Load existing static config as baseline
        self.existing_config = self._load_existing_config()
        
        # Initialize content analysis storage
        self.all_content = []
        self.code_blocks = []
        self.technical_terms = defaultdict(int)
        self.category_keywords = defaultdict(set)
        
    def _load_existing_config(self) -> Dict:
        """Load existing static configuration as baseline."""
        config_path = self.config_folder / 'topic-extraction-data.json'
        if config_path.exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {
            'topicCategories': {},
            'technicalEntities': {'technologies': [], 'companies': [], 'frameworks': []},
            'stopWords': []
        }
    
    def analyze_blog_content(self) -> Dict[str, Any]:
        """Analyze all blog content to extract technical terms and patterns."""
        print("Analyzing blog content for dynamic configuration generation...")
        
        post_count = 0
        for md_file in self.blog_folder.rglob("*.md"):
            try:
                with open(md_file, 'r', encoding='utf-8') as f:
                    post = frontmatter.load(f)
                    
                # Skip drafts
                if not post.metadata.get('published', True):
                    continue
                    
                content = post.content
                self.all_content.append(content)
                
                # Extract code blocks
                self._extract_code_blocks(content)
                
                # Extract technical terms from content
                self._extract_technical_terms(content)
                
                post_count += 1
                
            except Exception as e:
                print(f"Warning: Could not process {md_file}: {e}")
                continue
        
        print(f"Processed {post_count} blog posts")
        return self._generate_enhanced_config()
    
    def _extract_code_blocks(self, content: str):
        """Extract code blocks and analyze for programming languages and frameworks."""
        # Extract fenced code blocks
        code_pattern = r'```(\w+)?\n(.*?)\n```'
        matches = re.findall(code_pattern, content, re.DOTALL)
        
        for lang, code in matches:
            if lang:
                self.technical_terms[f'lang_{lang.lower()}'] += 1
                
            self.code_blocks.append(code)
            
            # Analyze imports and dependencies
            self._analyze_code_imports(code, lang)
    
    def _analyze_code_imports(self, code: str, language: str):
        """Analyze code for framework and library usage."""
        # Python imports
        if language.lower() in ['python', 'py']:
            imports = re.findall(r'(?:from\s+(\w+)|import\s+(\w+))', code)
            for from_module, import_module in imports:
                module = from_module or import_module
                if module:
                    self.technical_terms[f'python_lib_{module}'] += 1
        
        # JavaScript/TypeScript imports
        elif language.lower() in ['javascript', 'js', 'typescript', 'ts']:
            imports = re.findall(r'(?:import.*?from\s+[\'"]([^\'\"]+)[\'"]|require\([\'"]([^\'\"]+)[\'"]\))', code)
            for from_module, require_module in imports:
                module = from_module or require_module
                if module and not module.startswith('.'):
                    self.technical_terms[f'js_lib_{module}'] += 1
        
        # Java imports
        elif language.lower() in ['java']:
            imports = re.findall(r'import\s+([\w\.]+)', code)
            for import_path in imports:
                parts = import_path.split('.')
                if len(parts) > 2:
                    self.technical_terms[f'java_lib_{parts[0]}'] += 1
    
    def _extract_technical_terms(self, content: str):
        """Extract technical terms, acronyms, and entities from content."""
        # Remove code blocks for clean text analysis
        content_no_code = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
        
        # Extract technical acronyms (2-5 uppercase letters)
        acronyms = re.findall(r'\b[A-Z]{2,5}\b', content_no_code)
        for acronym in acronyms:
            if acronym not in self.stop_words:
                self.technical_terms[f'acronym_{acronym.lower()}'] += 1
        
        # Extract potential framework/tool names (capitalized words)
        tools = re.findall(r'\b[A-Z][a-z]+(?:\.[A-Z][a-z]+)*\b', content_no_code)
        for tool in tools:
            if len(tool) > 2 and tool.lower() not in self.stop_words:
                self.technical_terms[f'tool_{tool.lower()}'] += 1
        
        # Extract hyphenated technical terms
        hyphenated = re.findall(r'\b[a-z]+-[a-z]+(?:-[a-z]+)*\b', content_no_code.lower())
        for term in hyphenated:
            if len(term) > 5:  # Avoid short common words
                self.technical_terms[f'hyphenated_{term}'] += 1
        
        # Extract version numbers and technical patterns
        versions = re.findall(r'\b\w+\s+v?\d+(?:\.\d+)*\b', content_no_code.lower())
        for version in versions:
            tool_name = version.split()[0]
            if len(tool_name) > 2:
                self.technical_terms[f'versioned_tool_{tool_name}'] += 1
    
    def _generate_enhanced_config(self) -> Dict[str, Any]:
        """Generate enhanced configuration based on content analysis."""
        print("Generating enhanced topic configuration...")
        
        enhanced_config = {
            'topicCategories': self._enhance_topic_categories(),
            'technicalEntities': self._generate_technical_entities(),
            'stopWords': self._generate_optimized_stop_words(),
            '_metadata': {
                'generated_by': 'Dynamic Topic Configuration Generator',
                'posts_analyzed': len(self.all_content),
                'technical_terms_found': len(self.technical_terms),
                'generation_method': 'content_analysis'
            }
        }
        
        return enhanced_config
    
    def _enhance_topic_categories(self) -> Dict[str, List[str]]:
        """Enhance existing topic categories with discovered keywords."""
        categories = self.existing_config.get('topicCategories', {}).copy()
        
        # Analyze technical term frequencies to suggest new keywords
        frequent_terms = sorted(self.technical_terms.items(), key=lambda x: x[1], reverse=True)
        
        # Map technical terms to likely categories
        category_mappings = {
            'artificial-intelligence': ['ai', 'ml', 'deep', 'neural', 'nlp', 'gpt', 'bert', 'transformer'],
            'data-engineering': ['data', 'pipeline', 'etl', 'kafka', 'spark', 'warehouse'],
            'software-architecture': ['microservice', 'distributed', 'scalability', 'performance'],
            'cloud-computing': ['aws', 'azure', 'gcp', 'kubernetes', 'docker', 'serverless'],
            'software-development': ['programming', 'coding', 'development', 'algorithm'],
            'data-science': ['analysis', 'statistics', 'visualization', 'model'],
        }
        
        # Add discovered keywords to appropriate categories
        for term, frequency in frequent_terms[:100]:  # Top 100 most frequent terms
            if frequency < 3:  # Only include terms that appear multiple times
                continue
                
            clean_term = self._clean_technical_term(term)
            if not clean_term or len(clean_term) < 3:
                continue
            
            # Find best matching category
            best_category = self._find_best_category(clean_term, category_mappings)
            if best_category and best_category in categories:
                if clean_term not in categories[best_category]:
                    categories[best_category].append(clean_term)
        
        # Sort categories alphabetically
        for category in categories:
            categories[category] = sorted(list(set(categories[category])))
        
        return categories
    
    def _generate_technical_entities(self) -> Dict[str, List[str]]:
        """Generate technical entities from code analysis."""
        entities = self.existing_config.get('technicalEntities', {}).copy()
        
        # Initialize entity categories
        if 'technologies' not in entities:
            entities['technologies'] = []
        if 'frameworks' not in entities:
            entities['frameworks'] = []
        if 'tools' not in entities:
            entities['tools'] = []
        if 'companies' not in entities:
            entities['companies'] = []
        if 'languages' not in entities:
            entities['languages'] = []
        
        # Extract programming languages
        languages = set()
        for term, freq in self.technical_terms.items():
            if term.startswith('lang_') and freq >= 2:
                lang = term[5:]  # Remove 'lang_' prefix
                languages.add(lang)
        
        # Extract libraries and frameworks
        frameworks = set()
        tools = set()
        for term, freq in self.technical_terms.items():
            if freq >= 3:  # Must appear at least 3 times
                if term.startswith(('python_lib_', 'js_lib_', 'java_lib_')):
                    lib_name = term.split('_', 2)[2]
                    if len(lib_name) > 2:
                        frameworks.add(lib_name)
                elif term.startswith('tool_'):
                    tool_name = term[5:]  # Remove 'tool_' prefix
                    if len(tool_name) > 2:
                        tools.add(tool_name)
        
        # Merge with existing entities (avoid duplicates)
        entities['languages'].extend([lang for lang in languages if lang not in entities['languages']])
        entities['frameworks'].extend([fw for fw in frameworks if fw not in entities['frameworks']])
        entities['tools'].extend([tool for tool in tools if tool not in entities['tools']])
        
        # Sort all entity lists
        for category in entities:
            entities[category] = sorted(list(set(entities[category])))
        
        return entities
    
    def _generate_optimized_stop_words(self) -> List[str]:
        """Generate optimized stop words based on content analysis."""
        # Start with existing stop words
        stop_words = set(self.existing_config.get('stopWords', []))
        
        # Add standard English stop words
        stop_words.update(stopwords.words('english'))
        
        # Add blog-specific common words that don't add value
        blog_stop_words = [
            'blog', 'post', 'article', 'today', 'recently', 'update',
            'new', 'latest', 'current', 'modern', 'popular', 'common',
            'example', 'simple', 'basic', 'advanced', 'complex',
            'introduction', 'overview', 'guide', 'tutorial', 'tips'
        ]
        stop_words.update(blog_stop_words)
        
        return sorted(list(stop_words))
    
    def _clean_technical_term(self, term: str) -> str:
        """Clean and normalize a technical term."""
        # Remove prefixes
        if '_' in term:
            term = term.split('_', 1)[1] if term.count('_') > 0 else term
        
        # Clean the term
        term = term.lower().strip()
        term = re.sub(r'[^\w\s-]', '', term)  # Remove special characters except hyphens
        
        # Skip very short terms or numbers
        if len(term) < 3 or term.isdigit():
            return ''
        
        return term
    
    def _find_best_category(self, term: str, category_mappings: Dict[str, List[str]]) -> str:
        """Find the best category for a technical term."""
        best_score = 0
        best_category = None
        
        for category, keywords in category_mappings.items():
            score = 0
            for keyword in keywords:
                if keyword in term or term in keyword:
                    score += 1
            
            if score > best_score:
                best_score = score
                best_category = category
        
        return best_category
    
    def generate_config(self, output_path: str = None) -> str:
        """Generate the complete enhanced configuration."""
        enhanced_config = self.analyze_blog_content()
        
        if output_path is None:
            output_path = self.config_folder / 'topic-extraction-data-enhanced.json'
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(enhanced_config, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Enhanced topic configuration generated: {output_path}")
        self._print_generation_summary(enhanced_config)
        
        return str(output_path)
    
    def _print_generation_summary(self, config: Dict):
        """Print a summary of the generated configuration."""
        metadata = config.get('_metadata', {})
        categories = config.get('topicCategories', {})
        entities = config.get('technicalEntities', {})
        
        print(f"\n📊 Generation Summary:")
        print(f"   • Posts analyzed: {metadata.get('posts_analyzed', 0)}")
        print(f"   • Technical terms found: {metadata.get('technical_terms_found', 0)}")
        print(f"   • Topic categories: {len(categories)}")
        print(f"   • Total category keywords: {sum(len(keywords) for keywords in categories.values())}")
        print(f"   • Technical entity types: {len(entities)}")
        print(f"   • Total technical entities: {sum(len(items) for items in entities.values())}")
        print(f"   • Optimized stop words: {len(config.get('stopWords', []))}")
        
        # Show some examples
        if categories:
            print(f"\n🔍 Sample enhanced categories:")
            for category, keywords in list(categories.items())[:3]:
                print(f"   • {category}: {len(keywords)} keywords")
        
        if entities:
            print(f"\n🛠️ Technical entities discovered:")
            for entity_type, items in entities.items():
                print(f"   • {entity_type}: {len(items)} items")
    
    def compare_with_existing(self) -> Dict[str, Any]:
        """Compare generated config with existing config."""
        enhanced_config = self.analyze_blog_content()
        
        comparison = {
            'new_categories': {},
            'enhanced_categories': {},
            'new_entities': {},
            'enhanced_entities': {}
        }
        
        # Compare categories
        existing_categories = self.existing_config.get('topicCategories', {})
        enhanced_categories = enhanced_config.get('topicCategories', {})
        
        for category, keywords in enhanced_categories.items():
            if category not in existing_categories:
                comparison['new_categories'][category] = keywords
            else:
                existing_keywords = set(existing_categories[category])
                new_keywords = set(keywords) - existing_keywords
                if new_keywords:
                    comparison['enhanced_categories'][category] = list(new_keywords)
        
        # Compare entities
        existing_entities = self.existing_config.get('technicalEntities', {})
        enhanced_entities = enhanced_config.get('technicalEntities', {})
        
        for entity_type, items in enhanced_entities.items():
            if entity_type not in existing_entities:
                comparison['new_entities'][entity_type] = items
            else:
                existing_items = set(existing_entities[entity_type])
                new_items = set(items) - existing_items
                if new_items:
                    comparison['enhanced_entities'][entity_type] = list(new_items)
        
        return comparison


def main():
    """Main entry point for the topic configuration generator."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate enhanced topic extraction configuration')
    parser.add_argument('--blog-folder', default='blog', help='Path to blog folder')
    parser.add_argument('--config-folder', default='website/config', help='Path to config folder')
    parser.add_argument('--output', help='Output file path (default: enhanced config)')
    parser.add_argument('--compare', action='store_true', help='Compare with existing config only')
    parser.add_argument('--replace', action='store_true', help='Replace existing config file')
    parser.add_argument('--verbose', action='store_true', help='Enable verbose output')
    
    args = parser.parse_args()
    
    # Initialize generator
    generator = TopicConfigGenerator(args.blog_folder, args.config_folder)
    
    if args.compare:
        # Just show comparison
        comparison = generator.compare_with_existing()
        print("🔍 Configuration Comparison:")
        print(json.dumps(comparison, indent=2))
        return
    
    # Generate enhanced configuration
    if args.replace:
        output_path = Path(args.config_folder) / 'topic-extraction-data.json'
    else:
        output_path = args.output
    
    enhanced_path = generator.generate_config(output_path)
    
    if args.verbose:
        comparison = generator.compare_with_existing()
        print(f"\n📈 Enhancements made:")
        print(json.dumps(comparison, indent=2))
    
    print(f"\n🎉 Dynamic topic configuration generation complete!")
    print(f"   Generated file: {enhanced_path}")


if __name__ == '__main__':
    main()