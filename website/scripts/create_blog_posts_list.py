"""
Script to get list of all blogs along with their metadat from the markdown frontmatter by parsing each markdown file.md from all subdirectories under ..\\blog\\
pip install -r python-requirements.txt
"""

import os
import re
import json
import markdown
import frontmatter
import errno

from datetime import date, datetime

POSTS_LIST_FILE_JSON = "website/dist/posts_list.json"

POST_LINK_STRING = "link"

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
                result[root] = postFile
    return result

def create_posts_list(files):
  """Creates the list of posts"""
  count = 0
  data_all = []
  for item in files.items():
    post = frontmatter.load(item[1])
    post[POST_LINK_STRING] = item[0]
    if post['published'] == True:
      count = count+1
      data_all.append(post.metadata)
  print(f"Total posts: {count}")
  data_all.sort(key=extract_time, reverse=True)
  json_data = json.dumps(data_all, default=json_serial)#, indent=2)
  # https://stackoverflow.com/a/12517490
  if not os.path.exists(os.path.dirname(POSTS_LIST_FILE_JSON)):
    try:
        os.makedirs(os.path.dirname(POSTS_LIST_FILE_JSON))
        print("created directory")
    except OSError as exc: # Guard against race condition
        if exc.errno != errno.EEXIST:
            raise
  file_to_update_json = open(POSTS_LIST_FILE_JSON, "w+")
  file_to_update_json.write(json_data)
  file_to_update_json.close()

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
    files = find_files()
    create_posts_list(files)

if __name__ == '__main__':
    main()
