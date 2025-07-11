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

import frontmatter
from dateutil import parser

POSTS_LIST_FILE_JSON = "website/public/blogdata/metadata/blog_metadata.json"
SERIES_LIST_FILE_JSON = "website/public/blogdata/metadata/series_metadata.json"
POSTS_DIST_FOLDER = "website/public/blogdata"
POSTS_FOLDER = "blog"

POST_PATH_STRING = "path"


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


def create_posts_list(files):
    """Creates the list of posts"""
    count = 0
    data_all = []
    series_data = {}
    
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
            
            # Handle series information
            if 'series' in post.metadata:
                series_info = post.metadata['series']
                if isinstance(series_info, dict):
                    series_name = series_info.get('name', '')
                    series_slug = process_item_for_url_slug(series_name)['url-slug']
                    post['series'] = {
                        'name': series_name,
                        'url-slug': series_slug,
                        'part': series_info.get('part', None),
                        'description': series_info.get('description', '')
                    }
                    
                    # Build series metadata
                    if series_slug not in series_data:
                        series_data[series_slug] = {
                            'name': series_name,
                            'url-slug': series_slug,
                            'description': series_info.get('description', ''),
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
    raise TypeError("Type %s not serializable" % type(obj))


def main():
    """main method."""
    initialize()
    files = find_files()
    copy_blog_posts(POSTS_FOLDER, POSTS_DIST_FOLDER)
    create_posts_list(files)


if __name__ == '__main__':
    main()
