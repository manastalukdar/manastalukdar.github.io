<template>
  <div class="search-filters">
    <v-card class="filters-card" elevation="1">
      <v-card-title class="filters-header">
        <v-icon class="filters-icon">mdi-filter-variant</v-icon>
        <span>Search Filters</span>
        <v-spacer />
        <v-btn
          v-if="hasActiveFilters"
          variant="text"
          size="small"
          color="error"
          @click="clearAllFilters"
        >
          Clear All
          <v-icon end>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="filters-content">
        <!-- Categories Filter -->
        <v-expansion-panels
          v-model="expandedPanels"
          variant="accordion"
          multiple
          class="filter-panels"
        >
          <v-expansion-panel value="categories">
            <v-expansion-panel-title>
              <div class="panel-header">
                <v-icon class="panel-icon">mdi-folder-outline</v-icon>
                <span class="panel-title">Categories</span>
                <v-chip
                  v-if="selectedCategories.length > 0"
                  size="small"
                  color="primary"
                  class="ml-2"
                >
                  {{ selectedCategories.length }}
                </v-chip>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="filter-section">
                <v-text-field
                  v-model="categorySearch"
                  label="Search categories..."
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  hide-details
                  class="mb-3"
                />
                <div class="filter-options">
                  <v-checkbox
                    v-for="category in filteredCategories"
                    :key="category"
                    v-model="selectedCategories"
                    :value="category"
                    :label="category"
                    density="compact"
                    hide-details
                    class="category-checkbox"
                  >
                    <template #label>
                      <span class="filter-label">{{ category }}</span>
                      <span class="filter-count" v-if="categoryCounts[category]">
                        ({{ categoryCounts[category] }})
                      </span>
                    </template>
                  </v-checkbox>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Tags Filter -->
          <v-expansion-panel value="tags">
            <v-expansion-panel-title>
              <div class="panel-header">
                <v-icon class="panel-icon">mdi-tag-outline</v-icon>
                <span class="panel-title">Tags</span>
                <v-chip
                  v-if="selectedTags.length > 0"
                  size="small"
                  color="secondary"
                  class="ml-2"
                >
                  {{ selectedTags.length }}
                </v-chip>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="filter-section">
                <v-autocomplete
                  v-model="selectedTags"
                  :items="availableTags"
                  label="Select tags..."
                  variant="outlined"
                  density="compact"
                  multiple
                  chips
                  closable-chips
                  clearable
                  hide-no-data
                  hide-details
                  class="mb-3"
                />
                <div class="popular-tags">
                  <span class="popular-tags-label">Popular tags:</span>
                  <v-chip
                    v-for="tag in popularTags"
                    :key="tag"
                    size="small"
                    variant="outlined"
                    :color="selectedTags.includes(tag) ? 'primary' : 'default'"
                    class="ma-1"
                    @click="toggleTag(tag)"
                  >
                    {{ tag }}
                    <span class="tag-count" v-if="tagCounts[tag]">
                      ({{ tagCounts[tag] }})
                    </span>
                  </v-chip>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Date Range Filter -->
          <v-expansion-panel value="dateRange">
            <v-expansion-panel-title>
              <div class="panel-header">
                <v-icon class="panel-icon">mdi-calendar-range</v-icon>
                <span class="panel-title">Date Range</span>
                <v-chip
                  v-if="dateRange.start || dateRange.end"
                  size="small"
                  color="success"
                  class="ml-2"
                >
                  Active
                </v-chip>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="filter-section">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="dateRange.start"
                      label="Start Date"
                      type="date"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="dateRange.end"
                      label="End Date"
                      type="date"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                </v-row>
                <div class="date-presets mt-3">
                  <span class="date-presets-label">Quick filters:</span>
                  <v-chip
                    v-for="preset in datePresets"
                    :key="preset.label"
                    size="small"
                    variant="outlined"
                    class="ma-1"
                    @click="applyDatePreset(preset)"
                  >
                    {{ preset.label }}
                  </v-chip>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Post Format Filter -->
          <v-expansion-panel value="postFormat" v-if="availablePostFormats.length > 0">
            <v-expansion-panel-title>
              <div class="panel-header">
                <v-icon class="panel-icon">mdi-file-document-outline</v-icon>
                <span class="panel-title">Post Format</span>
                <v-chip
                  v-if="selectedPostFormats.length > 0"
                  size="small"
                  color="warning"
                  class="ml-2"
                >
                  {{ selectedPostFormats.length }}
                </v-chip>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="filter-section">
                <v-radio-group
                  v-model="selectedPostFormat"
                  density="compact"
                  hide-details
                >
                  <v-radio
                    value=""
                    label="All formats"
                    color="primary"
                  />
                  <v-radio
                    v-for="format in availablePostFormats"
                    :key="format"
                    :value="format"
                    :label="format"
                    color="primary"
                  >
                    <template #label>
                      <span class="filter-label">{{ format }}</span>
                      <span class="filter-count" v-if="postFormatCounts[format]">
                        ({{ postFormatCounts[format] }})
                      </span>
                    </template>
                  </v-radio>
                </v-radio-group>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Search Options -->
          <v-expansion-panel value="searchOptions">
            <v-expansion-panel-title>
              <div class="panel-header">
                <v-icon class="panel-icon">mdi-cog-outline</v-icon>
                <span class="panel-title">Search Options</span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="filter-section">
                <v-switch
                  v-model="useSemanticSearch"
                  label="AI Semantic Search"
                  color="primary"
                  density="compact"
                  hide-details
                  class="mb-3"
                />
                <v-slider
                  v-model="maxResults"
                  label="Max Results"
                  min="5"
                  max="50"
                  step="5"
                  thumb-label
                  density="compact"
                  hide-details
                />
                <div class="similarity-threshold mt-3" v-if="useSemanticSearch">
                  <v-slider
                    v-model="similarityThreshold"
                    label="Similarity Threshold"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    thumb-label
                    density="compact"
                    hide-details
                  />
                  <div class="threshold-help">
                    <small class="text-caption">
                      Lower values show more results, higher values show only close matches
                    </small>
                  </div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

// Props
const props = defineProps({
  availableCategories: {
    type: Array,
    default: () => []
  },
  availableTags: {
    type: Array,
    default: () => []
  },
  availablePostFormats: {
    type: Array,
    default: () => []
  },
  categoryCounts: {
    type: Object,
    default: () => ({})
  },
  tagCounts: {
    type: Object,
    default: () => ({})
  },
  postFormatCounts: {
    type: Object,
    default: () => ({})
  },
  initialFilters: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:filters', 'clear-all'])

// Reactive state
const expandedPanels = ref([])
const categorySearch = ref('')
const selectedCategories = ref(props.initialFilters.categories || [])
const selectedTags = ref(props.initialFilters.tags || [])
const selectedPostFormats = ref(props.initialFilters.postFormats || [])
const selectedPostFormat = ref(props.initialFilters.postFormat || '')
const dateRange = ref({
  start: props.initialFilters.dateStart || '',
  end: props.initialFilters.dateEnd || ''
})
const useSemanticSearch = ref(props.initialFilters.useSemanticSearch !== false)
const maxResults = ref(props.initialFilters.maxResults || 10)
const similarityThreshold = ref(props.initialFilters.similarityThreshold || 0.1)

// Computed properties
const filteredCategories = computed(() => {
  if (!categorySearch.value) return props.availableCategories
  return props.availableCategories.filter(category =>
    category.toLowerCase().includes(categorySearch.value.toLowerCase())
  )
})

const popularTags = computed(() => {
  // Get top 10 most used tags
  return Object.entries(props.tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag)
})

const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 ||
         selectedTags.value.length > 0 ||
         selectedPostFormats.value.length > 0 ||
         selectedPostFormat.value ||
         dateRange.value.start ||
         dateRange.value.end
})

const currentFilters = computed(() => ({
  categories: selectedCategories.value,
  tags: selectedTags.value,
  postFormats: selectedPostFormats.value,
  postFormat: selectedPostFormat.value,
  dateStart: dateRange.value.start,
  dateEnd: dateRange.value.end,
  useSemanticSearch: useSemanticSearch.value,
  maxResults: maxResults.value,
  similarityThreshold: similarityThreshold.value
}))

// Date presets
const datePresets = [
  {
    label: 'Last 30 days',
    start: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD')
  },
  {
    label: 'Last 3 months',
    start: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD')
  },
  {
    label: 'Last year',
    start: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD')
  },
  {
    label: 'This year',
    start: dayjs().startOf('year').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD')
  }
]

// Methods
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const applyDatePreset = (preset) => {
  dateRange.value.start = preset.start
  dateRange.value.end = preset.end
}

const clearAllFilters = () => {
  selectedCategories.value = []
  selectedTags.value = []
  selectedPostFormats.value = []
  selectedPostFormat.value = ''
  dateRange.value = { start: '', end: '' }
  categorySearch.value = ''
  emit('clear-all')
}

// Watch for filter changes and emit updates
watch(currentFilters, (newFilters) => {
  emit('update:filters', newFilters)
}, { deep: true })

// Watch for selectedPostFormat changes and update selectedPostFormats
watch(selectedPostFormat, (newFormat) => {
  if (newFormat) {
    selectedPostFormats.value = [newFormat]
  } else {
    selectedPostFormats.value = []
  }
})
</script>

<style scoped>
.search-filters {
  width: 100%;
}

.filters-card {
  border-radius: 12px;
  background: rgb(var(--v-theme-cardColor));
}

.filters-header {
  background: rgb(var(--v-theme-headerAndFooterColor));
  color: rgb(var(--v-theme-on-surface));
  border-radius: 12px 12px 0 0;
  padding: 16px 20px;
}

.filters-icon {
  margin-right: 8px;
}

.filters-content {
  padding: 0;
}

.filter-panels {
  border-radius: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  width: 100%;
}

.panel-icon {
  margin-right: 8px;
}

.panel-title {
  font-weight: 500;
}

.filter-section {
  padding: 16px 0;
}

.filter-options {
  max-height: 200px;
  overflow-y: auto;
}

.category-checkbox {
  margin-bottom: 4px;
}

.filter-label {
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.filter-count {
  font-size: 0.85em;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  margin-left: 4px;
}

.popular-tags {
  margin-top: 16px;
}

.popular-tags-label {
  display: block;
  font-size: 0.9em;
  font-weight: 500;
  margin-bottom: 8px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
}

.tag-count {
  font-size: 0.8em;
  margin-left: 4px;
  opacity: 0.7;
}

.date-presets {
  margin-top: 16px;
}

.date-presets-label {
  display: block;
  font-size: 0.9em;
  font-weight: 500;
  margin-bottom: 8px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
}

.threshold-help {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgb(var(--v-theme-surface));
  border-radius: 4px;
  border: 1px solid rgb(var(--v-theme-outline));
  opacity: 0.8;
}

/* Tablet styles */
@media (max-width: 960px) {
  .filter-panels {
    font-size: 0.9rem;
  }
  
  .panel-header {
    font-size: 0.95rem;
  }
  
  .threshold-help {
    font-size: 0.8rem;
  }
}

/* Mobile styles */
@media (max-width: 600px) {
  .filters-header {
    padding: 12px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .filters-header .v-btn {
    align-self: flex-end;
    margin-top: 8px;
  }
  
  .filter-section {
    padding: 12px 0;
  }
  
  .popular-tags {
    text-align: left;
  }
  
  .filter-options {
    max-height: 150px;
    font-size: 0.9rem;
  }
  
  .category-checkbox {
    margin-bottom: 2px;
  }
  
  .date-presets .v-chip,
  .popular-tags .v-chip {
    margin: 2px;
    font-size: 0.8rem;
  }
  
  .panel-title {
    font-size: 0.9rem;
  }
  
  .panel-icon {
    font-size: 1.1rem;
  }
  
  /* Make expansion panels more touch-friendly */
  .v-expansion-panel-title {
    min-height: 48px;
    padding: 8px 16px;
  }
  
  /* Compact form fields */
  .v-text-field,
  .v-autocomplete {
    font-size: 0.9rem;
  }
  
  .v-slider {
    margin: 8px 0;
  }
  
  /* Better spacing for mobile */
  .tips-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

/* Small mobile styles */
@media (max-width: 480px) {
  .search-filters {
    margin: 0 -8px;
  }
  
  .filters-card {
    border-radius: 8px;
    margin: 0 8px;
  }
  
  .filters-header {
    padding: 10px 12px;
  }
  
  .filter-section {
    padding: 8px 0;
  }
  
  .popular-tags .v-chip,
  .date-presets .v-chip {
    font-size: 0.75rem;
    height: 24px;
  }
  
  .filter-options {
    max-height: 120px;
  }
  
  .v-expansion-panel-title {
    min-height: 44px;
    padding: 6px 12px;
    font-size: 0.85rem;
  }
  
  .panel-icon {
    font-size: 1rem;
    margin-right: 6px;
  }
  
  .filter-label {
    font-size: 0.85rem;
  }
  
  /* Compact switches and sliders */
  .v-switch {
    transform: scale(0.9);
    transform-origin: left center;
  }
  
  .threshold-help {
    padding: 6px 8px;
    font-size: 0.75rem;
  }
}
</style>