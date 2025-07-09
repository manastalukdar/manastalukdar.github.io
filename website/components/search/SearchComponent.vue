<template>
  <div class="search-component">
    <v-card class="search-card" elevation="2">
      <v-card-title class="search-header">
        <v-icon class="search-icon">mdi-magnify</v-icon>
        <span>AI-Powered Search</span>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="searchQuery"
          label="Search posts with natural language..."
          placeholder="e.g., 'AI research papers about transformers' or 'engineering management'"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          :loading="isSearching"
          @input="onSearchInput"
          @keyup.enter="performSearch"
          clearable
          class="search-input"
        />

        <!-- Search Options -->
        <div class="search-options" v-if="showAdvancedOptions">
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="selectedCategories"
                :items="availableCategories"
                label="Filter by Categories"
                variant="outlined"
                multiple
                chips
                closable-chips
                dense
                clearable
                hide-no-data
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="selectedTags"
                :items="availableTags"
                label="Filter by Tags"
                variant="outlined"
                multiple
                chips
                closable-chips
                dense
                clearable
                hide-no-data
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-switch
                v-model="useSemanticSearch"
                label="Use AI Semantic Search"
                color="primary"
                inset
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-slider
                v-model="maxResults"
                label="Max Results"
                min="5"
                max="50"
                step="5"
                thumb-label
              />
            </v-col>
          </v-row>
        </div>

        <!-- Toggle Advanced Options -->
        <v-btn
          variant="text"
          size="small"
          @click="showAdvancedOptions = !showAdvancedOptions"
          class="mt-2"
        >
          {{ showAdvancedOptions ? 'Hide' : 'Show' }} Advanced Options
          <v-icon>{{ showAdvancedOptions ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Search Results -->
    <div class="search-results" v-if="searchResults || isSearching">
      <v-card class="results-card mt-4" elevation="1">
        <v-card-title class="results-header">
          <v-icon class="results-icon">mdi-file-search</v-icon>
          <span v-if="searchResults">
            {{ searchResults.totalResults }} results for "{{ searchResults.query }}"
          </span>
          <span v-else>Searching...</span>
          <v-spacer/>
          <v-chip
            v-if="searchResults"
            :color="searchResults.searchType === 'semantic' ? 'primary' : 'secondary'"
            size="small"
          >
            {{ searchResults.searchType === 'semantic' ? 'AI Semantic' : 'Keyword' }}
          </v-chip>
        </v-card-title>

        <v-card-text>
          <div v-if="isSearching" class="text-center pa-4">
            <v-progress-circular indeterminate color="primary"/>
            <p class="mt-2">Analyzing your query with AI...</p>
          </div>

          <div v-else-if="searchResults && searchResults.results.length > 0">
            <v-list lines="three">
              <v-list-item
                v-for="result in searchResults.results"
                :key="result.id"
                :to="result.url"
                class="search-result-item"
              >
                <template #prepend>
                  <v-avatar color="primary" size="40">
                    <v-icon>mdi-file-document</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="result-title">
                  {{ result.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="result-content">
                  {{ result.content }}
                </v-list-item-subtitle>

                <template #append>
                  <div class="result-meta">
                    <v-chip
                      size="small"
                      variant="outlined"
                      color="primary"
                      class="mb-1"
                    >
                      {{ formatDate(result.date) }}
                    </v-chip>
                    <br>
                    <v-chip
                      size="small"
                      variant="outlined"
                      color="secondary"
                    >
                      {{ Math.round(result.score * 100) }}% match
                    </v-chip>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </div>

          <div v-else-if="searchResults && searchResults.results.length === 0" class="text-center pa-4">
            <v-icon size="48" color="grey">mdi-magnify-close</v-icon>
            <p class="mt-2">No results found for "{{ searchResults.query }}"</p>
            <p class="text-body-2 text-grey">Try different keywords or use semantic search</p>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Recent Posts -->
    <div class="recent-posts" v-if="!searchResults && !isSearching && recentPosts.length > 0">
      <v-card class="recent-card mt-4" elevation="1">
        <v-card-title class="recent-header">
          <v-icon class="recent-icon">mdi-clock-outline</v-icon>
          <span>Recent Posts</span>
        </v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item
              v-for="post in recentPosts"
              :key="post.id"
              :to="post.url"
              class="recent-post-item"
            >
              <template #prepend>
                <v-avatar color="secondary" size="32">
                  <v-icon size="16">mdi-file-document</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="recent-title">
                {{ post.title }}
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ formatDate(post.date) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { searchService } from '~/utils/searchService'

// Reactive state
const searchQuery = ref('')
const searchResults = ref(null)
const isSearching = ref(false)
const showAdvancedOptions = ref(false)
const selectedCategories = ref([])
const selectedTags = ref([])
const useSemanticSearch = ref(true)
const maxResults = ref(10)
const recentPosts = ref([])
const suggestions = ref({ categories: [], tags: [] })

// Computed properties
const availableCategories = computed(() => suggestions.value.categories)
const availableTags = computed(() => suggestions.value.tags)

// Search debounce timer
let searchTimeout = null

// Methods
const onSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    if (searchQuery.value.length > 2) {
      performSearch()
    } else {
      searchResults.value = null
    }
  }, 500)
}

const performSearch = async () => {
  if (!searchQuery.value.trim() || typeof window === 'undefined') {
    searchResults.value = null
    return
  }

  isSearching.value = true

  try {
    const options = {
      limit: maxResults.value,
      useSemanticSearch: useSemanticSearch.value,
      categories: selectedCategories.value,
      tags: selectedTags.value
    }

    searchResults.value = await searchService.search(searchQuery.value, options)
  } catch (error) {
    console.error('Search failed:', error)
    // Handle error - maybe show a toast notification
  } finally {
    isSearching.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadSuggestions = async () => {
  // Only run on client side
  if (typeof window !== 'undefined') {
    try {
      await searchService.initialize()
      suggestions.value = searchService.getSuggestions()
      recentPosts.value = searchService.getRecentPosts(5)
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    }
  }
}

// Lifecycle
onMounted(() => {
  loadSuggestions()
})
</script>

<style scoped>
.search-component {
  max-width: 800px;
  margin: 0 auto;
}

.search-card {
  border-radius: 12px;
  background: rgb(var(--v-theme-cardColor));
}

.search-header {
  background: rgb(var(--v-theme-headerAndFooterColor));
  color: rgb(var(--v-theme-on-surface));
  border-radius: 12px 12px 0 0;
}

.search-icon {
  margin-right: 8px;
}

.search-input {
  margin-bottom: 16px;
}

.search-options {
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  border: 1px solid rgb(var(--v-theme-outline));
  opacity: 0.9;
}

.results-card {
  border-radius: 8px;
  background: rgb(var(--v-theme-cardColor));
}

.results-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline));
  opacity: 0.9;
}

.results-icon {
  margin-right: 8px;
}

.search-result-item {
  border-bottom: 1px solid rgb(var(--v-theme-outline));
  padding: 16px 0;
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-title {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 8px;
}

.result-content {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  line-height: 1.4;
}

.result-meta {
  text-align: right;
  min-width: 120px;
}

.recent-card {
  border-radius: 8px;
  background: rgb(var(--v-theme-cardColor));
}

.recent-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline));
  opacity: 0.9;
}

.recent-icon {
  margin-right: 8px;
}

.recent-post-item {
  border-bottom: 1px solid rgb(var(--v-theme-outline));
  padding: 8px 0;
}

.recent-post-item:last-child {
  border-bottom: none;
}

.recent-title {
  font-weight: 500;
  color: rgb(var(--v-theme-primary));
}

@media (max-width: 600px) {
  .search-component {
    padding: 0 16px;
  }

  .result-meta {
    min-width: 80px;
  }
}
</style>
