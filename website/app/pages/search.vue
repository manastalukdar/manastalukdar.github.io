<template>
  <div class="search-page">
    <div class="container">
      <div class="search-header">
        <h1 class="page-title">Search</h1>
        <p class="page-description">
          Find blog posts using AI-powered semantic search or traditional keyword matching
        </p>
      </div>

      <ClientOnly>
        <SearchComponent />
        <template #fallback>
          <div class="search-loading">
            <v-card class="search-card" elevation="2">
              <v-card-title class="search-header">
                <v-icon class="search-icon">mdi-magnify</v-icon>
                <span>AI-Powered Search</span>
              </v-card-title>
              <v-card-text>
                <v-skeleton-loader type="text, text, divider, text, text" />
              </v-card-text>
            </v-card>
          </div>
        </template>
      </ClientOnly>

      <div class="search-info mt-8">
        <v-card class="info-card" elevation="1">
          <v-card-title class="info-header">
            <v-icon class="info-icon">mdi-information</v-icon>
            <span>How Search Works</span>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="feature-item">
                  <v-icon color="primary" size="24">mdi-brain</v-icon>
                  <div class="feature-content">
                    <h3>AI Semantic Search</h3>
                    <p>
                      Uses advanced natural language processing to understand the meaning
                      behind your queries. Search with natural language like "machine learning
                      papers" or "engineering management techniques".
                    </p>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="feature-item">
                  <v-icon color="secondary" size="24">mdi-text-search</v-icon>
                  <div class="feature-content">
                    <h3>Keyword Matching</h3>
                    <p>
                      Traditional search that matches exact words and phrases in titles,
                      content, categories, and tags. Great for finding specific topics
                      or technical terms.
                    </p>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="feature-item">
                  <v-icon color="success" size="24">mdi-filter</v-icon>
                  <div class="feature-content">
                    <h3>Advanced Filters</h3>
                    <p>
                      Narrow down results by categories, tags, or date ranges.
                      Combine filters with both semantic and keyword search for
                      precise results.
                    </p>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="feature-item">
                  <v-icon color="warning" size="24">mdi-speedometer</v-icon>
                  <div class="feature-content">
                    <h3>Relevance Scoring</h3>
                    <p>
                      Results are ranked by relevance using similarity scores.
                      Higher percentages indicate better matches to your query.
                      Perfect for finding the most relevant content.
                    </p>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>

      <div class="search-tips mt-4">
        <v-card class="tips-card" elevation="1">
          <v-card-title class="tips-header">
            <v-icon class="tips-icon">mdi-lightbulb</v-icon>
            <span>Search Tips</span>
          </v-card-title>

          <v-card-text>
            <div class="tips-grid">
              <div class="tip-item">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <span>Use natural language: "artificial intelligence research"</span>
              </div>
              <div class="tip-item">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <span>Try conceptual queries: "data science best practices"</span>
              </div>
              <div class="tip-item">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <span>Search for topics: "machine learning algorithms"</span>
              </div>
              <div class="tip-item">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <span>Use specific terms: "neural networks transformers"</span>
              </div>
              <div class="tip-item">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <span>Filter by categories and tags for focused results</span>
              </div>
              <div class="tip-item">
                <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                <span>Toggle between semantic and keyword search modes</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchComponent from '~/components/search/SearchComponent.vue'

// Page metadata
definePageMeta({
  title: 'Search | Manas Talukdar',
  description: 'Search blog posts using AI-powered semantic search and keyword matching'
})

// SEO head configuration
useHead({
  title: 'Search | Manas Talukdar',
  meta: [
    {
      name: 'description',
      content: 'Find blog posts using AI-powered semantic search or traditional keyword matching. Search through technical articles, research papers, and insights on AI, data science, and engineering.'
    },
    {
      name: 'keywords',
      content: 'search, AI search, semantic search, blog search, natural language processing, NLP, machine learning, artificial intelligence'
    },
    {
      property: 'og:title',
      content: 'Search - Manas Talukdar'
    },
    {
      property: 'og:description',
      content: 'Find blog posts using AI-powered semantic search or traditional keyword matching'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.search-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 16px;
}

.page-description {
  font-size: 1.1rem;
  color: rgb(var(--v-theme-on-surface));
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  opacity: 0.7;
}

.info-card {
  border-radius: 12px;
  background: rgb(var(--v-theme-cardColor));
}

.info-header {
  background: rgb(var(--v-theme-headerAndFooterColor));
  color: rgb(var(--v-theme-on-surface));
  border-radius: 12px 12px 0 0;
}

.info-icon {
  margin-right: 8px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-content {
  margin-left: 16px;
}

.feature-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgb(var(--v-theme-on-surface));
}

.feature-content p {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  line-height: 1.5;
  margin: 0;
}

.tips-card {
  border-radius: 12px;
  background: rgb(var(--v-theme-cardColor));
}

.tips-header {
  background: rgb(var(--v-theme-headerAndFooterColor));
  color: rgb(var(--v-theme-on-surface));
  border-radius: 12px 12px 0 0;
}

.tips-icon {
  margin-right: 8px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.tip-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.tip-item span {
  margin-left: 12px;
  color: rgb(var(--v-theme-on-surface));
  font-weight: 500;
}

.search-loading {
  max-width: 800px;
  margin: 0 auto;
}

.search-loading .search-card {
  border-radius: 12px;
  background: rgb(var(--v-theme-cardColor));
}

.search-loading .search-header {
  background: rgb(var(--v-theme-headerAndFooterColor));
  color: rgb(var(--v-theme-on-surface));
  border-radius: 12px 12px 0 0;
}

.search-loading .search-icon {
  margin-right: 8px;
}

@media (max-width: 960px) {
  .page-title {
    font-size: 2rem;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .search-page {
    padding: 16px 0;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
  }

  .feature-content {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
