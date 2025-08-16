<template>
  <div class="search-component">
    <v-card class="search-card" elevation="2">
      <v-card-title class="search-header">
        <v-icon class="search-icon">mdi-magnify</v-icon>
        <span>AI-Powered Search</span>
        <v-spacer />
        <v-btn
          variant="text"
          size="small"
          @click="showFilters = !showFilters"
          :color="hasActiveFilters ? 'primary' : 'default'"
        >
          <v-icon start>mdi-filter-variant</v-icon>
          Filters
          <v-badge
            v-if="activeFilterCount > 0"
            :content="activeFilterCount"
            color="primary"
            inline
          />
        </v-btn>
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

        <!-- Active Filter Chips -->
        <FilterChips
          v-if="hasActiveFilters"
          :filters="currentFilters"
          :result-count="searchResults?.totalResults"
          @remove-filter="removeFilter"
          @clear-all="clearAllFilters"
        />
      </v-card-text>
    </v-card>

    <!-- Enhanced Filters Panel -->
    <v-expand-transition>
      <div v-if="showFilters" class="filters-panel mt-4">
        <Suspense>
          <SearchFilters
            :available-categories="availableCategories"
            :available-tags="availableTags"
            :available-post-formats="availablePostFormats"
            :category-counts="categoryCounts"
            :tag-counts="tagCounts"
            :post-format-counts="postFormatCounts"
            :initial-filters="currentFilters"
            @update:filters="updateFiltersLocal"
            @clear-all="clearAllFilters"
          />
          <template #fallback>
            <v-card class="filters-loading pa-4" elevation="1">
              <v-row class="align-center">
                <v-col cols="auto">
                  <v-progress-circular indeterminate color="primary" size="20" />
                </v-col>
                <v-col>
                  <span class="text-body-2">Loading advanced filters...</span>
                </v-col>
              </v-row>
              <v-skeleton-loader class="mt-3" type="chip, chip, divider, chip, chip" />
            </v-card>
          </template>
        </Suspense>
      </div>
    </v-expand-transition>

    <!-- Search Results -->
    <div class="search-results" v-if="searchResults || isSearching">
      <v-card class="results-card mt-4" elevation="1">
        <v-card-title class="results-header">
          <v-icon class="results-icon">mdi-file-search</v-icon>
          <span v-if="searchResults">
            {{ searchResults.totalResults }} results
            <span v-if="searchResults.query">for "{{ searchResults.query }}"</span>
          </span>
          <span v-else>Searching...</span>
          <v-spacer/>
          <div class="result-meta-chips">
            <v-chip
              v-if="searchResults"
              :color="searchResults.searchType === 'semantic' ? 'primary' : 'secondary'"
              size="small"
              class="mr-2"
            >
              {{ searchResults.searchType === 'semantic' ? 'AI Semantic' : 'Keyword' }}
            </v-chip>
            <v-chip
              v-if="searchResults && hasActiveFilters"
              color="info"
              size="small"
            >
              Filtered
            </v-chip>
          </div>
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
                    <br>
                    <div class="result-categories mt-1" v-if="result.categories && result.categories.length > 0">
                      <v-chip
                        v-for="category in result.categories.slice(0, 2)"
                        :key="category"
                        size="x-small"
                        variant="outlined"
                        color="info"
                        class="mr-1 mb-1"
                      >
                        {{ category }}
                      </v-chip>
                    </div>
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
import { ref, onMounted, computed, watch } from 'vue'
// Dynamic import for SearchFilters (contains heavy ML models and complex filtering logic)
const SearchFilters = defineAsyncComponent(() => import('./SearchFilters.vue'))
import FilterChips from './FilterChips.vue'
import dayjs from 'dayjs'
import { useSearchFilters } from '~/composables/useSearchFilters'

// Only import search service on client side
let searchService = null
if (typeof window !== 'undefined') {
  searchService = (await import('~/utils/searchService')).searchService
}

// Use the search filters composable
const { 
  filters: currentFilters, 
  updateFilters, 
  clearFilters, 
  removeFilter: removeFilterFromState,
  setSearchQuery,
  hasActiveFilters: filtersHasActive,
  activeFilterCount: filtersActiveCount,
  loadFiltersFromStorage,
  saveFiltersToStorage
} = useSearchFilters()

// Reactive state
const searchQuery = ref(currentFilters.value.searchQuery || '')
const searchResults = ref(null)
const isSearching = ref(false)
const showFilters = ref(false)
const recentPosts = ref([])
const suggestions = ref({ categories: [], tags: [] })
const categoryCounts = ref({})
const tagCounts = ref({})
const postFormatCounts = ref({})

// Computed properties
const availableCategories = computed(() => suggestions.value.categories)
const availableTags = computed(() => suggestions.value.tags)
const availablePostFormats = computed(() => {
  // Extract post formats from search service if available
  if (searchService && searchService.searchIndex) {
    const formats = new Set()
    searchService.searchIndex.forEach(entry => {
      if (entry['post-format']?.name) {
        formats.add(entry['post-format'].name)
      }
    })
    return Array.from(formats).sort()
  }
  return []
})

const hasActiveFilters = computed(() => filtersHasActive.value)
const activeFilterCount = computed(() => filtersActiveCount.value)

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
      limit: currentFilters.value.maxResults,
      threshold: currentFilters.value.similarityThreshold,
      useSemanticSearch: currentFilters.value.useSemanticSearch,
      categories: currentFilters.value.categories,
      tags: currentFilters.value.tags,
      postFormat: currentFilters.value.postFormat,
      dateStart: currentFilters.value.dateStart,
      dateEnd: currentFilters.value.dateEnd
    }

    if (searchService) {
      let results = await searchService.search(searchQuery.value, options)
      
      // Apply additional filters
      if (options.dateStart || options.dateEnd) {
        results.results = results.results.filter(result => {
          const resultDate = dayjs(result.date)
          const startDate = options.dateStart ? dayjs(options.dateStart) : null
          const endDate = options.dateEnd ? dayjs(options.dateEnd) : null
          
          if (startDate && resultDate.isBefore(startDate)) return false
          if (endDate && resultDate.isAfter(endDate)) return false
          return true
        })
        results.totalResults = results.results.length
      }
      
      searchResults.value = results
    }
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
  if (typeof window !== 'undefined' && searchService) {
    try {
      await searchService.initialize()
      suggestions.value = searchService.getSuggestions()
      recentPosts.value = searchService.getRecentPosts(5)
      
      // Calculate filter counts
      calculateFilterCounts()
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    }
  }
}

const calculateFilterCounts = () => {
  if (!searchService || !searchService.searchIndex) return
  
  // Use the enhanced search service methods
  const counts = searchService.getFilterCounts()
  categoryCounts.value = counts.categories
  tagCounts.value = counts.tags
  postFormatCounts.value = counts.postFormats
  
  // Update viable combinations based on current filters
  updateViableFilterCounts()
}

const updateViableFilterCounts = () => {
  if (!searchService || !searchService.searchIndex) return
  
  const viableCounts = searchService.getViableFilterCombinations(currentFilters.value)
  
  // Update counts to show only viable options
  // This helps users understand which filters will yield results
  Object.keys(categoryCounts.value).forEach(category => {
    if (!viableCounts.categories[category]) {
      categoryCounts.value[category] = 0
    } else {
      categoryCounts.value[category] = viableCounts.categories[category]
    }
  })
  
  Object.keys(tagCounts.value).forEach(tag => {
    if (!viableCounts.tags[tag]) {
      tagCounts.value[tag] = 0
    } else {
      tagCounts.value[tag] = viableCounts.tags[tag]
    }
  })
}

const updateFiltersLocal = (newFilters) => {
  updateFilters(newFilters)
  updateViableFilterCounts()
  
  // Trigger search if there's a query and filters changed
  if (searchQuery.value.trim()) {
    performSearch()
  }
}

const removeFilter = ({ type, value }) => {
  removeFilterFromState({ type, value })
  updateViableFilterCounts()
  
  // Trigger search if there's a query
  if (searchQuery.value.trim()) {
    performSearch()
  }
}

const clearAllFilters = () => {
  clearFilters()
  calculateFilterCounts() // Reset to full counts when clearing all filters
  
  // Trigger search if there's a query
  if (searchQuery.value.trim()) {
    performSearch()
  }
}

// Lifecycle
onMounted(() => {
  loadFiltersFromStorage()
  loadSuggestions()
  
  // Perform initial search if there's a query in URL
  if (currentFilters.value.searchQuery) {
    searchQuery.value = currentFilters.value.searchQuery
    performSearch()
  }
})

// Watch for search query changes and sync with composable
watch(searchQuery, (newQuery) => {
  setSearchQuery(newQuery)
})

// Watch for filter changes
watch(currentFilters, () => {
  // Auto-search when filters change and there's a query
  if (searchQuery.value.trim()) {
    performSearch()
  }
  
  // Save search preferences to localStorage
  saveFiltersToStorage()
}, { deep: true })
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
  margin-bottom: 0;
}

.filters-panel {
  width: 100%;
}

.filters-loading {
  border-radius: 8px;
  background: rgb(var(--v-theme-cardColor));
  border: 1px solid rgb(var(--v-theme-outline));
  opacity: 0.8;
}

.result-meta-chips {
  display: flex;
  align-items: center;
  gap: 8px;
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
  
  .result-meta-chips {
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }
  
  .search-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .filters-panel {
    margin-top: 16px;
  }
}
</style>
