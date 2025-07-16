import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useSearchFilters = () => {
  const route = useRoute()
  const router = useRouter()

  // Parse initial filters from URL params
  const parseFiltersFromURL = () => {
    const query = route.query
    return {
      categories: query.categories ? (Array.isArray(query.categories) ? query.categories : [query.categories]) : [],
      tags: query.tags ? (Array.isArray(query.tags) ? query.tags : [query.tags]) : [],
      postFormats: query.postFormats ? (Array.isArray(query.postFormats) ? query.postFormats : [query.postFormats]) : [],
      postFormat: query.postFormat || '',
      dateStart: query.dateStart || '',
      dateEnd: query.dateEnd || '',
      useSemanticSearch: query.useSemanticSearch !== 'false',
      maxResults: parseInt(query.maxResults) || 10,
      similarityThreshold: parseFloat(query.similarityThreshold) || 0.1,
      searchQuery: query.q || ''
    }
  }

  // Reactive filter state
  const filters = ref(parseFiltersFromURL())
  
  // Computed property for URL params
  const urlParams = computed(() => {
    const params = {}
    
    // Only include non-default values in URL
    if (filters.value.categories.length > 0) {
      params.categories = filters.value.categories
    }
    if (filters.value.tags.length > 0) {
      params.tags = filters.value.tags
    }
    if (filters.value.postFormats.length > 0) {
      params.postFormats = filters.value.postFormats
    }
    if (filters.value.postFormat) {
      params.postFormat = filters.value.postFormat
    }
    if (filters.value.dateStart) {
      params.dateStart = filters.value.dateStart
    }
    if (filters.value.dateEnd) {
      params.dateEnd = filters.value.dateEnd
    }
    if (!filters.value.useSemanticSearch) {
      params.useSemanticSearch = 'false'
    }
    if (filters.value.maxResults !== 10) {
      params.maxResults = filters.value.maxResults.toString()
    }
    if (filters.value.similarityThreshold !== 0.1) {
      params.similarityThreshold = filters.value.similarityThreshold.toString()
    }
    if (filters.value.searchQuery) {
      params.q = filters.value.searchQuery
    }
    
    return params
  })

  // Update URL when filters change
  const updateURL = (newParams = {}) => {
    const query = { ...urlParams.value, ...newParams }
    
    // Remove empty values
    Object.keys(query).forEach(key => {
      if (!query[key] || (Array.isArray(query[key]) && query[key].length === 0)) {
        delete query[key]
      }
    })
    
    router.push({
      path: route.path,
      query
    })
  }

  // Update filters from external source (like components)
  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  // Clear all filters
  const clearFilters = () => {
    filters.value = {
      categories: [],
      tags: [],
      postFormats: [],
      postFormat: '',
      dateStart: '',
      dateEnd: '',
      useSemanticSearch: true,
      maxResults: 10,
      similarityThreshold: 0.1,
      searchQuery: filters.value.searchQuery // Keep search query
    }
  }

  // Remove specific filter
  const removeFilter = ({ type, value }) => {
    switch (type) {
      case 'categories':
        const categoryIndex = filters.value.categories.indexOf(value)
        if (categoryIndex > -1) {
          filters.value.categories.splice(categoryIndex, 1)
        }
        break
      case 'tags':
        const tagIndex = filters.value.tags.indexOf(value)
        if (tagIndex > -1) {
          filters.value.tags.splice(tagIndex, 1)
        }
        break
      case 'postFormat':
        filters.value.postFormat = ''
        filters.value.postFormats = []
        break
      case 'dateRange':
        filters.value.dateStart = ''
        filters.value.dateEnd = ''
        break
    }
  }

  // Set search query
  const setSearchQuery = (query) => {
    filters.value.searchQuery = query
  }

  // Computed properties for easy access
  const hasActiveFilters = computed(() => {
    return filters.value.categories.length > 0 ||
           filters.value.tags.length > 0 ||
           filters.value.postFormat ||
           filters.value.dateStart ||
           filters.value.dateEnd ||
           !filters.value.useSemanticSearch ||
           filters.value.maxResults !== 10
  })

  const activeFilterCount = computed(() => {
    let count = 0
    count += filters.value.categories.length
    count += filters.value.tags.length
    if (filters.value.postFormat) count += 1
    if (filters.value.dateStart || filters.value.dateEnd) count += 1
    return count
  })

  // Watch for filter changes and update URL
  watch(filters, () => {
    updateURL()
  }, { deep: true })

  // Watch for route changes and update filters
  watch(() => route.query, (newQuery) => {
    // Only update if we're on the search page to avoid conflicts
    if (route.path === '/search') {
      const newFilters = parseFiltersFromURL()
      // Don't trigger watchers by directly assigning
      Object.assign(filters.value, newFilters)
    }
  }, { immediate: false })

  // Save filters to localStorage for persistence across sessions
  const saveFiltersToStorage = () => {
    if (typeof window !== 'undefined') {
      try {
        const filtersToSave = {
          useSemanticSearch: filters.value.useSemanticSearch,
          maxResults: filters.value.maxResults,
          similarityThreshold: filters.value.similarityThreshold
        }
        localStorage.setItem('searchFilters', JSON.stringify(filtersToSave))
      } catch (error) {
        console.warn('Failed to save filters to localStorage:', error)
      }
    }
  }

  // Load filters from localStorage
  const loadFiltersFromStorage = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('searchFilters')
        if (saved) {
          const parsedFilters = JSON.parse(saved)
          // Only restore non-search specific filters
          filters.value.useSemanticSearch = parsedFilters.useSemanticSearch ?? true
          filters.value.maxResults = parsedFilters.maxResults ?? 10
          filters.value.similarityThreshold = parsedFilters.similarityThreshold ?? 0.1
        }
      } catch (error) {
        console.warn('Failed to load filters from localStorage:', error)
      }
    }
  }

  return {
    filters: computed(() => filters.value),
    updateFilters,
    clearFilters,
    removeFilter,
    setSearchQuery,
    hasActiveFilters,
    activeFilterCount,
    saveFiltersToStorage,
    loadFiltersFromStorage,
    updateURL
  }
}