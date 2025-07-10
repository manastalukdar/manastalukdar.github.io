import { pipeline } from '@xenova/transformers';

class SearchService {
  constructor() {
    this.searchIndex = null;
    this.embeddingPipeline = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    // Only initialize on client side
    if (typeof window === 'undefined') {
      console.warn('Search service can only be initialized on the client side');
      return;
    }

    try {
      // Load search index
      const response = await fetch('/search_index.json');
      this.searchIndex = await response.json();
      
      // Initialize embedding pipeline
      this.embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      
      this.isInitialized = true;
      console.log(`Search service initialized with ${this.searchIndex.length} entries`);
    } catch (error) {
      console.error('Failed to initialize search service:', error);
      throw error;
    }
  }

  async generateQueryEmbedding(query) {
    if (!this.embeddingPipeline) {
      throw new Error('Search service not initialized');
    }

    const result = await this.embeddingPipeline(query, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vec1, vec2) {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (norm1 * norm2);
  }

  // Simple keyword search for fallback
  keywordSearch(query, entries) {
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(word => word.length > 2);

    return entries.map(entry => {
      const titleLower = entry.title.toLowerCase();
      const contentLower = entry.content.toLowerCase();
      const categoriesLower = entry.categories.join(' ').toLowerCase();
      const tagsLower = entry.tags.join(' ').toLowerCase();

      let score = 0;
      
      keywords.forEach(keyword => {
        // Title matches are weighted higher
        if (titleLower.includes(keyword)) score += 3;
        if (contentLower.includes(keyword)) score += 1;
        if (categoriesLower.includes(keyword)) score += 2;
        if (tagsLower.includes(keyword)) score += 2;
      });

      return { ...entry, score };
    }).filter(entry => entry.score > 0);
  }

  async search(query, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const {
      limit = 10,
      threshold = 0.1,
      useSemanticSearch = true,
      categories = [],
      tags = []
    } = options;

    try {
      let results = [];

      if (useSemanticSearch && query.length > 3) {
        // Semantic search using embeddings
        const queryEmbedding = await this.generateQueryEmbedding(query);
        
        results = this.searchIndex.map(entry => {
          const similarity = this.cosineSimilarity(queryEmbedding, entry.embedding);
          return {
            ...entry,
            score: similarity
          };
        }).filter(entry => entry.score > threshold);
      } else {
        // Fallback to keyword search
        results = this.keywordSearch(query, this.searchIndex);
      }

      // Apply filters
      if (categories.length > 0) {
        results = results.filter(entry => 
          entry.categories.some(cat => categories.includes(cat))
        );
      }

      if (tags.length > 0) {
        results = results.filter(entry => 
          entry.tags.some(tag => tags.includes(tag))
        );
      }

      // Sort by score and limit results
      results.sort((a, b) => b.score - a.score);
      results = results.slice(0, limit);

      return {
        query,
        results,
        totalResults: results.length,
        searchType: useSemanticSearch ? 'semantic' : 'keyword'
      };

    } catch (error) {
      console.error('Search error:', error);
      
      // Fallback to keyword search if semantic search fails
      if (useSemanticSearch) {
        return this.search(query, { ...options, useSemanticSearch: false });
      }
      
      throw error;
    }
  }

  // Get suggestions based on categories and tags
  getSuggestions() {
    if (!this.searchIndex || typeof window === 'undefined') {
      return { categories: [], tags: [] };
    }

    const categories = new Set();
    const tags = new Set();

    this.searchIndex.forEach(entry => {
      entry.categories.forEach(cat => categories.add(cat));
      entry.tags.forEach(tag => tags.add(tag));
    });

    return {
      categories: Array.from(categories).sort(),
      tags: Array.from(tags).sort()
    };
  }

  // Get recent posts
  getRecentPosts(limit = 5) {
    if (!this.searchIndex || typeof window === 'undefined') {
      return [];
    }

    return this.searchIndex
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map(entry => ({
        id: entry.id,
        title: entry.title,
        url: entry.url,
        date: entry.date,
        categories: entry.categories,
        tags: entry.tags
      }));
  }

  // Find related posts based on content similarity
  async findRelatedPosts(currentPost, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const {
      limit = 5,
      threshold = 0.15,
      excludeCurrentPost = true,
      preferSameCategory = true,
      preferSameTags = true
    } = options;

    if (!this.searchIndex || typeof window === 'undefined') {
      return [];
    }

    try {
      let candidates = this.searchIndex;

      // Exclude current post if specified
      if (excludeCurrentPost && currentPost.id) {
        candidates = candidates.filter(entry => entry.id !== currentPost.id);
      }

      // Generate query from current post content for semantic similarity
      const query = `${currentPost.title} ${currentPost.categories?.join(' ') || ''} ${currentPost.tags?.join(' ') || ''}`;
      
      let results = [];

      if (query.length > 3 && this.embeddingPipeline) {
        // Semantic search using post content
        const queryEmbedding = await this.generateQueryEmbedding(query);
        
        results = candidates.map(entry => {
          const similarity = this.cosineSimilarity(queryEmbedding, entry.embedding);
          let score = similarity;

          // Boost score for same categories
          if (preferSameCategory && currentPost.categories) {
            const commonCategories = entry.categories?.filter(cat => 
              currentPost.categories.includes(cat)
            ).length || 0;
            score += commonCategories * 0.1;
          }

          // Boost score for same tags
          if (preferSameTags && currentPost.tags) {
            const commonTags = entry.tags?.filter(tag => 
              currentPost.tags.includes(tag)
            ).length || 0;
            score += commonTags * 0.05;
          }

          return {
            ...entry,
            score,
            semanticSimilarity: similarity
          };
        }).filter(entry => entry.score > threshold);
      } else {
        // Fallback to category/tag-based similarity
        results = candidates.map(entry => {
          let score = 0;

          // Score based on shared categories
          if (currentPost.categories && entry.categories) {
            const commonCategories = entry.categories.filter(cat => 
              currentPost.categories.includes(cat)
            ).length;
            score += commonCategories * 0.3;
          }

          // Score based on shared tags
          if (currentPost.tags && entry.tags) {
            const commonTags = entry.tags.filter(tag => 
              currentPost.tags.includes(tag)
            ).length;
            score += commonTags * 0.2;
          }

          return {
            ...entry,
            score
          };
        }).filter(entry => entry.score > 0);
      }

      // Sort by score and limit results
      results.sort((a, b) => b.score - a.score);
      results = results.slice(0, limit);

      return results.map(entry => ({
        id: entry.id,
        title: entry.title,
        url: entry.url,
        date: entry.date,
        categories: entry.categories,
        tags: entry.tags,
        score: entry.score,
        semanticSimilarity: entry.semanticSimilarity
      }));

    } catch (error) {
      console.error('Error finding related posts:', error);
      
      // Simple fallback based on categories/tags only
      const results = this.searchIndex
        .filter(entry => {
          if (excludeCurrentPost && currentPost.id && entry.id === currentPost.id) {
            return false;
          }
          
          // Check for shared categories or tags
          const hasSharedCategory = currentPost.categories?.some(cat => 
            entry.categories?.includes(cat)
          );
          const hasSharedTag = currentPost.tags?.some(tag => 
            entry.tags?.includes(tag)
          );
          
          return hasSharedCategory || hasSharedTag;
        })
        .slice(0, limit)
        .map(entry => ({
          id: entry.id,
          title: entry.title,
          url: entry.url,
          date: entry.date,
          categories: entry.categories,
          tags: entry.tags,
          score: 0.1
        }));

      return results;
    }
  }
}

// Export singleton instance
export const searchService = new SearchService();
export default searchService;