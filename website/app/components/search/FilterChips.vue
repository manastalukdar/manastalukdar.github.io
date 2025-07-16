<template>
  <div class="filter-chips" v-if="hasActiveFilters">
    <div class="filter-chips-header">
      <span class="filter-chips-title">Active Filters:</span>
      <v-btn
        variant="text"
        size="small"
        color="error"
        @click="clearAllFilters"
        class="clear-all-btn"
      >
        Clear All
      </v-btn>
    </div>

    <div class="filter-chips-container">
      <!-- Category Chips -->
      <div v-if="filters.categories && filters.categories.length > 0" class="chip-group">
        <span class="chip-group-label">Categories:</span>
        <v-chip
          v-for="category in filters.categories"
          :key="`category-${category}`"
          size="small"
          color="primary"
          variant="flat"
          closable
          class="filter-chip"
          @click:close="removeFilter('categories', category)"
        >
          <v-icon start>mdi-folder-outline</v-icon>
          {{ category }}
        </v-chip>
      </div>

      <!-- Tag Chips -->
      <div v-if="filters.tags && filters.tags.length > 0" class="chip-group">
        <span class="chip-group-label">Tags:</span>
        <v-chip
          v-for="tag in filters.tags"
          :key="`tag-${tag}`"
          size="small"
          color="secondary"
          variant="flat"
          closable
          class="filter-chip"
          @click:close="removeFilter('tags', tag)"
        >
          <v-icon start>mdi-tag-outline</v-icon>
          {{ tag }}
        </v-chip>
      </div>

      <!-- Post Format Chip -->
      <div v-if="filters.postFormat" class="chip-group">
        <span class="chip-group-label">Format:</span>
        <v-chip
          size="small"
          color="warning"
          variant="flat"
          closable
          class="filter-chip"
          @click:close="removeFilter('postFormat')"
        >
          <v-icon start>mdi-file-document-outline</v-icon>
          {{ filters.postFormat }}
        </v-chip>
      </div>

      <!-- Date Range Chip -->
      <div v-if="filters.dateStart || filters.dateEnd" class="chip-group">
        <span class="chip-group-label">Date:</span>
        <v-chip
          size="small"
          color="success"
          variant="flat"
          closable
          class="filter-chip"
          @click:close="removeDateFilter"
        >
          <v-icon start>mdi-calendar-range</v-icon>
          {{ formatDateRange(filters.dateStart, filters.dateEnd) }}
        </v-chip>
      </div>

      <!-- Search Mode Chip -->
      <div v-if="!filters.useSemanticSearch" class="chip-group">
        <span class="chip-group-label">Mode:</span>
        <v-chip
          size="small"
          color="info"
          variant="outlined"
          class="filter-chip"
        >
          <v-icon start>mdi-text-search</v-icon>
          Keyword Search
        </v-chip>
      </div>

      <!-- Results Limit Chip -->
      <div v-if="filters.maxResults && filters.maxResults !== 10" class="chip-group">
        <span class="chip-group-label">Limit:</span>
        <v-chip
          size="small"
          color="grey"
          variant="outlined"
          class="filter-chip"
        >
          <v-icon start>mdi-numeric</v-icon>
          {{ filters.maxResults }} results
        </v-chip>
      </div>

      <!-- Similarity Threshold Chip -->
      <div v-if="filters.useSemanticSearch && filters.similarityThreshold && filters.similarityThreshold !== 0.1" class="chip-group">
        <span class="chip-group-label">Threshold:</span>
        <v-chip
          size="small"
          color="purple"
          variant="outlined"
          class="filter-chip"
        >
          <v-icon start>mdi-speedometer</v-icon>
          {{ (filters.similarityThreshold * 100).toFixed(0) }}% similarity
        </v-chip>
      </div>
    </div>

    <!-- Filter Summary -->
    <div class="filter-summary" v-if="totalFilterCount > 0">
      <v-icon size="16">mdi-information-outline</v-icon>
      <span class="summary-text">
        {{ totalFilterCount }} filter{{ totalFilterCount > 1 ? 's' : '' }} applied
        <span v-if="resultCount !== undefined">
          • {{ resultCount }} result{{ resultCount !== 1 ? 's' : '' }} found
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

// Props
const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  },
  resultCount: {
    type: Number,
    default: undefined
  }
})

// Emits
const emit = defineEmits(['remove-filter', 'clear-all'])

// Computed properties
const hasActiveFilters = computed(() => {
  return (filters.value.categories && filters.value.categories.length > 0) ||
         (filters.value.tags && filters.value.tags.length > 0) ||
         filters.value.postFormat ||
         filters.value.dateStart ||
         filters.value.dateEnd ||
         !filters.value.useSemanticSearch ||
         (filters.value.maxResults && filters.value.maxResults !== 10) ||
         (filters.value.useSemanticSearch && filters.value.similarityThreshold && filters.value.similarityThreshold !== 0.1)
})

const totalFilterCount = computed(() => {
  let count = 0
  if (props.filters.categories) count += props.filters.categories.length
  if (props.filters.tags) count += props.filters.tags.length
  if (props.filters.postFormat) count += 1
  if (props.filters.dateStart || props.filters.dateEnd) count += 1
  return count
})

const filters = computed(() => props.filters)

// Methods
const removeFilter = (filterType, value = null) => {
  emit('remove-filter', { type: filterType, value })
}

const removeDateFilter = () => {
  emit('remove-filter', { type: 'dateRange' })
}

const clearAllFilters = () => {
  emit('clear-all')
}

const formatDateRange = (start, end) => {
  if (start && end) {
    const startFormatted = dayjs(start).format('MMM D, YYYY')
    const endFormatted = dayjs(end).format('MMM D, YYYY')
    return `${startFormatted} - ${endFormatted}`
  } else if (start) {
    return `From ${dayjs(start).format('MMM D, YYYY')}`
  } else if (end) {
    return `Until ${dayjs(end).format('MMM D, YYYY')}`
  }
  return ''
}
</script>

<style scoped>
.filter-chips {
  margin-bottom: 16px;
  padding: 16px;
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
  border: 1px solid rgb(var(--v-theme-outline));
  opacity: 0.9;
}

.filter-chips-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.filter-chips-title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  font-size: 0.9rem;
}

.clear-all-btn {
  margin-left: auto;
}

.filter-chips-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chip-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.chip-group-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  margin-right: 4px;
  min-width: 60px;
}

.filter-chip {
  margin: 2px;
}

.filter-summary {
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgb(var(--v-theme-outline));
  opacity: 0.8;
}

.summary-text {
  margin-left: 8px;
  font-size: 0.85rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
}

/* Tablet responsive adjustments */
@media (max-width: 960px) {
  .filter-chips {
    padding: 14px;
    margin-bottom: 12px;
  }
  
  .chip-group-label {
    font-size: 0.85rem;
    min-width: 55px;
  }
  
  .filter-chip {
    font-size: 0.85rem;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 600px) {
  .filter-chips {
    padding: 12px;
    margin: 0 -8px 12px -8px;
    border-radius: 4px;
  }
  
  .filter-chips-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
  }
  
  .filter-chips-title {
    font-size: 0.85rem;
  }
  
  .clear-all-btn {
    margin-left: 0;
    align-self: flex-end;
    font-size: 0.8rem;
  }
  
  .chip-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .chip-group-label {
    min-width: auto;
    margin-bottom: 4px;
    font-size: 0.8rem;
  }
  
  .filter-chip {
    font-size: 0.8rem;
    height: 24px;
    margin: 1px;
  }
  
  .filter-summary {
    margin-top: 8px;
    padding-top: 8px;
  }
  
  .summary-text {
    font-size: 0.8rem;
  }
}

/* Small mobile adjustments */
@media (max-width: 480px) {
  .filter-chips {
    padding: 10px;
    margin: 0 -12px 10px -12px;
  }
  
  .filter-chips-header {
    margin-bottom: 6px;
  }
  
  .filter-chips-title {
    font-size: 0.8rem;
  }
  
  .clear-all-btn {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  
  .chip-group {
    gap: 2px;
  }
  
  .chip-group-label {
    font-size: 0.75rem;
    margin-bottom: 2px;
  }
  
  .filter-chip {
    font-size: 0.75rem;
    height: 22px;
  }
  
  .filter-summary {
    margin-top: 6px;
    padding-top: 6px;
  }
  
  .summary-text {
    font-size: 0.75rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .filter-chips {
    border-width: 2px;
    background: rgb(var(--v-theme-background));
  }
  
  .filter-summary {
    border-top-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .filter-chip {
    transition: none;
  }
}
</style>