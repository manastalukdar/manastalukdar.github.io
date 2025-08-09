#!/usr/bin/env python3
"""
Metadata Merging Utility for Granular Post Processing

This utility merges newly processed blog post metadata with existing metadata,
enabling incremental processing while maintaining data consistency.

Features:
- Merge individual post updates with existing metadata
- Handle conflicts and data consistency
- Preserve unchanged post metadata
- Generate backup and rollback capabilities
- Validate merged results

Usage:
    python merge_metadata.py --existing metadata.json --new new_metadata.json --output merged.json
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any


class MetadataMerger:
    """Handles merging of blog metadata with conflict resolution and validation."""
    
    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.merge_stats = {
            'updated': 0,
            'added': 0,
            'unchanged': 0,
            'errors': 0
        }
    
    def log(self, message: str):
        """Log message if verbose mode is enabled."""
        if self.verbose:
            print(f"[MERGE] {message}")
    
    def create_backup(self, metadata_file: str) -> str:
        """Create a backup of existing metadata file."""
        if not os.path.exists(metadata_file):
            return None
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = f"{metadata_file}.backup_{timestamp}"
        
        try:
            import shutil
            shutil.copy2(metadata_file, backup_path)
            self.log(f"Created backup: {backup_path}")
            return backup_path
        except Exception as e:
            print(f"❌ Error creating backup: {e}")
            return None
    
    def load_metadata(self, file_path: str) -> List[Dict[str, Any]]:
        """Load metadata from JSON file."""
        if not os.path.exists(file_path):
            self.log(f"Metadata file not found: {file_path}")
            return []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if not isinstance(data, list):
                raise ValueError("Metadata must be a list of post objects")
            
            self.log(f"Loaded {len(data)} posts from {file_path}")
            return data
        
        except Exception as e:
            print(f"❌ Error loading metadata from {file_path}: {e}")
            return []
    
    def get_post_key(self, post: Dict[str, Any]) -> str:
        """Generate unique key for a blog post."""
        # Use path as primary key, fallback to title
        if 'path' in post:
            return post['path']
        elif 'title' in post:
            return post['title']
        else:
            return f"unknown_{hash(str(post))}"
    
    def should_update_post(self, existing_post: Dict[str, Any], new_post: Dict[str, Any]) -> bool:
        """Determine if a post should be updated based on timestamps and content."""
        
        # Always update if new post has more recent processing timestamp
        if 'processed-at' in new_post:
            if 'processed-at' not in existing_post:
                return True
            
            try:
                new_time = datetime.fromisoformat(new_post['processed-at'].replace('Z', '+00:00'))
                existing_time = datetime.fromisoformat(existing_post['processed-at'].replace('Z', '+00:00'))
                if new_time > existing_time:
                    return True
            except Exception:
                # If timestamp parsing fails, assume update is needed
                return True
        
        # Check if content hash has changed (if available)
        if 'content-hash' in new_post and 'content-hash' in existing_post:
            return new_post['content-hash'] != existing_post['content-hash']
        
        # Check if last-updated-on has changed
        if 'last-updated-on' in new_post and 'last-updated-on' in existing_post:
            try:
                new_updated = str(new_post['last-updated-on'])
                existing_updated = str(existing_post['last-updated-on'])
                return new_updated != existing_updated
            except Exception:
                pass
        
        # Default to updating for safety
        return True
    
    def merge_post_metadata(self, existing_post: Dict[str, Any], new_post: Dict[str, Any]) -> Dict[str, Any]:
        """Merge metadata for a single post, preserving important fields."""
        
        # Start with existing post data
        merged_post = existing_post.copy()
        
        # Update with new data
        for key, value in new_post.items():
            # Always update these fields from new data
            if key in ['topic-primary', 'topic-secondary', 'classification-method', 
                      'topic-confidence', 'content-entities', 'related-concepts',
                      'content-complexity', 'target-audience', 'processed-at',
                      'processing-mode', 'reading-time-minutes', 'word-count']:
                merged_post[key] = value
            
            # Update other fields if they don't exist or are different
            elif key not in merged_post or merged_post[key] != value:
                merged_post[key] = value
        
        # Add merge metadata
        merged_post['last-merged-at'] = datetime.utcnow().isoformat()
        
        return merged_post
    
    def merge_metadata(self, existing_metadata: List[Dict[str, Any]], 
                      new_metadata: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Merge new metadata with existing metadata."""
        
        self.log(f"Merging {len(new_metadata)} new posts with {len(existing_metadata)} existing posts")
        
        # Create lookup dictionary for existing posts
        existing_by_key = {}
        for post in existing_metadata:
            key = self.get_post_key(post)
            existing_by_key[key] = post
        
        # Process new posts
        merged_posts = []
        processed_keys = set()
        
        for new_post in new_metadata:
            key = self.get_post_key(new_post)
            processed_keys.add(key)
            
            if key in existing_by_key:
                existing_post = existing_by_key[key]
                
                if self.should_update_post(existing_post, new_post):
                    merged_post = self.merge_post_metadata(existing_post, new_post)
                    merged_posts.append(merged_post)
                    self.merge_stats['updated'] += 1
                    self.log(f"Updated post: {new_post.get('title', key)}")
                else:
                    merged_posts.append(existing_post)
                    self.merge_stats['unchanged'] += 1
                    self.log(f"Unchanged post: {existing_post.get('title', key)}")
            else:
                # New post
                merged_posts.append(new_post)
                self.merge_stats['added'] += 1
                self.log(f"Added new post: {new_post.get('title', key)}")
        
        # Add remaining existing posts that weren't processed
        for key, existing_post in existing_by_key.items():
            if key not in processed_keys:
                merged_posts.append(existing_post)
                self.merge_stats['unchanged'] += 1
        
        # Sort posts by publication date (newest first)
        try:
            merged_posts.sort(key=lambda p: p.get('first-published-on', ''), reverse=True)
        except Exception as e:
            self.log(f"Warning: Could not sort posts by date: {e}")
        
        return merged_posts
    
    def validate_merged_metadata(self, merged_metadata: List[Dict[str, Any]]) -> bool:
        """Validate merged metadata for consistency and completeness."""
        
        if not isinstance(merged_metadata, list):
            print("❌ Merged metadata is not a list")
            return False
        
        required_fields = ['title', 'path', 'published']
        validation_errors = 0
        
        for i, post in enumerate(merged_metadata):
            if not isinstance(post, dict):
                print(f"❌ Post {i} is not a dictionary")
                validation_errors += 1
                continue
            
            # Check required fields
            for field in required_fields:
                if field not in post:
                    print(f"❌ Post {i} missing required field: {field}")
                    validation_errors += 1
            
            # Validate topic data
            if 'topic-primary' in post and not post['topic-primary']:
                print(f"⚠️  Post {i} has empty primary topic")
        
        if validation_errors > 0:
            print(f"❌ Validation failed with {validation_errors} errors")
            return False
        
        self.log(f"✅ Validation passed for {len(merged_metadata)} posts")
        return True
    
    def save_metadata(self, metadata: List[Dict[str, Any]], output_path: str) -> bool:
        """Save merged metadata to JSON file."""
        try:
            # Ensure output directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Write metadata
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2, default=str, ensure_ascii=False)
            
            self.log(f"Saved {len(metadata)} posts to {output_path}")
            return True
            
        except Exception as e:
            print(f"❌ Error saving metadata to {output_path}: {e}")
            return False
    
    def print_merge_stats(self):
        """Print merge statistics."""
        print("\n📊 Merge Statistics:")
        print(f"  • Updated posts: {self.merge_stats['updated']}")
        print(f"  • Added posts: {self.merge_stats['added']}")
        print(f"  • Unchanged posts: {self.merge_stats['unchanged']}")
        print(f"  • Errors: {self.merge_stats['errors']}")
        print(f"  • Total posts: {sum(self.merge_stats.values()) - self.merge_stats['errors']}")


def main():
    """Main function for command line usage."""
    parser = argparse.ArgumentParser(
        description="Merge blog post metadata for incremental processing"
    )
    parser.add_argument("--existing", required=True, help="Path to existing metadata file")
    parser.add_argument("--new", required=True, help="Path to new metadata file or directory")
    parser.add_argument("--output", required=True, help="Path to output merged metadata file")
    parser.add_argument("--backup", action="store_true", help="Create backup of existing metadata")
    parser.add_argument("--validate", action="store_true", help="Validate merged results")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    # Initialize merger
    merger = MetadataMerger(verbose=args.verbose)
    
    try:
        # Create backup if requested
        if args.backup:
            backup_path = merger.create_backup(args.existing)
            if backup_path:
                print(f"📁 Backup created: {backup_path}")
        
        # Load existing metadata
        existing_metadata = merger.load_metadata(args.existing)
        
        # Load new metadata
        new_metadata = merger.load_metadata(args.new)
        
        if not new_metadata:
            print("⚠️  No new metadata to merge")
            return 0
        
        # Merge metadata
        print(f"🔄 Merging metadata...")
        merged_metadata = merger.merge_metadata(existing_metadata, new_metadata)
        
        # Validate if requested
        if args.validate:
            print("🔍 Validating merged metadata...")
            if not merger.validate_merged_metadata(merged_metadata):
                print("❌ Validation failed - aborting save")
                return 1
        
        # Save merged metadata
        print(f"💾 Saving merged metadata to {args.output}...")
        if not merger.save_metadata(merged_metadata, args.output):
            return 1
        
        # Print statistics
        merger.print_merge_stats()
        
        print(f"✅ Metadata merge completed successfully")
        return 0
        
    except Exception as e:
        print(f"❌ Error during merge: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())