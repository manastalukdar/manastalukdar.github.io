# Prompt

File to read (that has raw data): blog/drafts/_priority/recent-ai-reading/temp.md
File to update: blog/2026/03/22/recent-ai-reading-22-march-2026/readme.md
Reference file (for structure and cross-topic format): blog/2025/10/25/recent-ai-reading-25-october-2025/readme.md

Read "File to read" to get the raw list of links. Visit each link to understand what the content is about. Then add each link under the appropriate section in "File to update", following the structure of "Reference file".

Rules:

1. **Deduplication**: Do not add a link that already exists in "File to update" or appears more than once in "File to read".
2. **Cross-topic annotation**: If a link is primarily relevant to one section but also relevant to others, place it in the primary section and add a cross-topic line immediately below it in this exact format:

   ```markdown
   - [Link title](url)
     - Cross Topics: Section Name 1, Section Name 2
   ```

   See "Reference file" for examples.
3. **New sections**: If a link clearly belongs to a section not yet present in "File to update", create that section following the same heading hierarchy as "Reference file". If unsure, use the Miscellaneous section.
4. **Frontmatter tags**: If a link introduces a topic not covered by any existing tag in the frontmatter of "File to update", add the relevant tag to the tags list.
5. **File creation**: If "File to update" does not exist, create it using the frontmatter structure from "Reference file" as a template, updating the title, url-slug, first-published-on, last-updated-on, and series part number appropriately.
