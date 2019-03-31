"""
Script to (1) get list of all blogs along with their metadata from the markdown frontmatter by parsing each markdown file.md from all subdirectories under ..\\blog\\ (2) copy all blog posts markdown files to under dist folder.
pip install -r python-requirements.txt
"""

import os
import re
import json
import markdown
import frontmatter
import errno
import shutil

from datetime import date, datetime

POSTS_LIST_FILE_JSON = "website/src/static/blogdata/posts_list.json"
POSTS_DIST_FOLDER = "website/src/static/blogdata"
POSTS_FOLDER = "blogdata"

POST_PATH_STRING = "path"

def find_files():
    """Return the list of files to process."""
    result = {}
    root_dir = "website/blog"
    cwd = os.getcwd()
    #print(os.listdir(root_dir))
    for root, dirs, files in os.walk(root_dir):
        dirs.sort()
        for file in files:
            if file.endswith(".md"):
                postFile = os.path.join(cwd, root, file)
                path = root.replace(root_dir + "\\", "").replace("\\", "/") + "/" + file
                result[path] = postFile
    return result

def create_posts_list(files):
  """Creates the list of posts"""
  count = 0
  data_all = []
  for item in files.items():
    post = frontmatter.load(item[1])
    post[POST_PATH_STRING] = item[0]
    if post['published'] == True:
      count = count+1
      data_all.append(post.metadata)
  print(f"Total posts: {count}")
  data_all.sort(key=extract_time, reverse=True)
  json_data = json.dumps(data_all, default=json_serial)#, indent=2)
  # https://stackoverflow.com/a/12517490
  dir = os.path.dirname(POSTS_LIST_FILE_JSON)
  if not os.path.exists(dir):
    try:
        os.makedirs(dir)
        print(f"Created directory {dir}")
    except OSError as exc: # Guard against race condition
        if exc.errno != errno.EEXIST:
            raise
  file_to_update_json = open(POSTS_LIST_FILE_JSON, "w+")
  file_to_update_json.write(json_data)
  file_to_update_json.close()

def copy_blog_posts(src, dest):
    try:
        shutil.copytree(src, dest, ignore=shutil.ignore_patterns('*.gitkeep', 'drafts'))
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
    raise TypeError ("Type %s not serializable" % type(obj))

def main():
    """main method."""
    initialize()
    files = find_files()
    copy_blog_posts(POSTS_FOLDER, POSTS_DIST_FOLDER)
    create_posts_list(files)

if __name__ == '__main__':
    main()
