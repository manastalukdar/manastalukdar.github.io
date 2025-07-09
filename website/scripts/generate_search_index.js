import { pipeline } from '@xenova/transformers';
import fs from 'fs';
import path from 'path';

// Configuration
const BLOG_DATA_DIR = './public/blogdata';
const SEARCH_INDEX_PATH = './public/search_index.json';
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

// Initialize the embedding pipeline
let embeddingPipeline;

async function initializeEmbedding() {
  if (!embeddingPipeline) {
    console.log('Loading embedding model...');
    embeddingPipeline = await pipeline('feature-extraction', MODEL_NAME);
    console.log('Embedding model loaded successfully');
  }
  return embeddingPipeline;
}

// Function to extract text content from markdown
function extractTextFromMarkdown(content) {
  // Remove YAML frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, '');
  
  // Remove markdown formatting
  const withoutMarkdown = withoutFrontmatter
    .replace(/#+\s/g, '') // Headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/`(.*?)`/g, '$1') // Inline code
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Links
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // Images
    .replace(/>\s/g, '') // Blockquotes
    .replace(/\n+/g, ' ') // Multiple newlines
    .trim();
  
  return withoutMarkdown;
}

// Function to get metadata from blog_metadata.json and create a lookup map
function getBlogMetadata() {
  const metadataPath = path.join(BLOG_DATA_DIR, 'metadata', 'blog_metadata.json');
  try {
    const metadataArray = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    // Create a lookup map based on the path field
    const metadataMap = {};
    metadataArray.forEach(post => {
      if (post.path) {
        // Convert path to URL format (remove .md extension and adjust path)
        const url = `/blog/${post.path.replace('/readme.md', '').replace('.md', '')}`;
        metadataMap[url] = post;
      }
    });
    
    return metadataMap;
  } catch (error) {
    console.error('Error reading blog metadata:', error);
    return {};
  }
}

// Function to recursively find all blog posts
function findBlogPosts(dir, posts = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findBlogPosts(fullPath, posts);
    } else if (item === 'readme.md') {
      posts.push(fullPath);
    }
  }
  
  return posts;
}

// Function to generate embeddings for a text
async function generateEmbedding(text) {
  const pipeline = await initializeEmbedding();
  
  // Truncate text if too long (model has token limits)
  const truncatedText = text.substring(0, 512);
  
  const result = await pipeline(truncatedText, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

// Function to extract blog post information
function extractBlogPostInfo(filePath) {
  const relativePath = path.relative(BLOG_DATA_DIR, filePath);
  const pathParts = relativePath.split(path.sep);
  
  if (pathParts.length >= 4) {
    return {
      year: pathParts[0],
      month: pathParts[1],
      day: pathParts[2],
      slug: pathParts[3],
      url: `/blog/${pathParts[0]}/${pathParts[1]}/${pathParts[2]}/${pathParts[3]}`
    };
  }
  
  return null;
}

// Main function to generate search index
async function generateSearchIndex() {
  console.log('Starting search index generation...');
  
  const blogPosts = findBlogPosts(BLOG_DATA_DIR);
  const metadata = getBlogMetadata();
  const searchIndex = [];
  
  console.log(`Found ${blogPosts.length} blog posts`);
  
  for (const postPath of blogPosts) {
    try {
      const content = fs.readFileSync(postPath, 'utf8');
      const textContent = extractTextFromMarkdown(content);
      const postInfo = extractBlogPostInfo(postPath);
      
      if (!postInfo) {
        console.warn(`Could not extract info from ${postPath}`);
        continue;
      }
      
      // Get metadata for this post
      const postMetadata = metadata[postInfo.url] || {};
      
      // Extract categories and tags from metadata
      const categories = postMetadata.categories 
        ? postMetadata.categories.map(cat => cat.name || cat)
        : [];
      const tags = postMetadata.tags 
        ? postMetadata.tags.map(tag => tag.name || tag)
        : [];
      
      // Generate embedding for the content
      console.log(`Generating embedding for ${postInfo.slug}...`);
      const embedding = await generateEmbedding(textContent);
      
      // Create search entry
      const searchEntry = {
        id: postInfo.url,
        title: postMetadata.title || postInfo.slug,
        content: textContent.substring(0, 500), // First 500 chars for preview
        url: postInfo.url,
        date: postMetadata['first-published-on'] || `${postInfo.year}-${postInfo.month}-${postInfo.day}`,
        categories: categories,
        tags: tags,
        embedding: embedding
      };
      
      searchIndex.push(searchEntry);
      
    } catch (error) {
      console.error(`Error processing ${postPath}:`, error);
    }
  }
  
  // Save search index
  console.log(`Saving search index with ${searchIndex.length} entries...`);
  fs.writeFileSync(SEARCH_INDEX_PATH, JSON.stringify(searchIndex, null, 2));
  
  console.log('Search index generation completed!');
  console.log(`Index saved to: ${SEARCH_INDEX_PATH}`);
}

// Run the script
generateSearchIndex().catch(console.error);