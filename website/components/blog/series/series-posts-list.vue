<template>
  <v-row class="pa-3">
    <v-col class="py-2" cols="12">
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular 
          indeterminate 
          color="primary"
          size="64"
        />
        <p class="mt-4">Loading series...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-8">
        <v-alert 
          type="error" 
          variant="outlined"
          class="mb-4"
        >
          {{ error }}
        </v-alert>
      </div>
      
      <div v-else-if="paginatedSeries.length === 0" class="text-center py-8">
        <v-alert 
          type="info" 
          variant="outlined"
          class="mb-4"
        >
          No series found.
        </v-alert>
      </div>
      
      <div v-else>
        <v-row v-for="series in paginatedSeries" :key="series.urlSlug" class="mb-6">
          <v-col cols="12">
            <SeriesCard :series="series" />
          </v-col>
        </v-row>
        
        <!-- Pagination Controls -->
        <paginationControls
          :total-posts="totalSeries"
          :current-page="currentPage"
          :items-per-page="itemsPerPage"
          @page-changed="onPageChanged"
          @per-page-changed="onPerPageChanged"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SeriesCard from './series-card.vue'
import paginationControls from '../posts-list/pagination-controls.vue'

const props = defineProps({
  seriesList: {
    type: Array,
    required: true,
    default() {
      return []
    }
  },
  initialPage: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['page-changed', 'per-page-changed'])

const loading = ref(false)
const error = ref(null)
const itemsPerPage = ref(5)
const currentPage = ref(props.initialPage)

// Computed properties
const totalSeries = computed(() => props.seriesList.length)

const paginatedSeries = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return props.seriesList.slice(startIndex, endIndex).map(series => ({
    name: series.name,
    urlSlug: series['url-slug'],
    description: series.description,
    postCount: series.post_count,
    firstPublished: series.first_published,
    lastUpdated: series.last_updated,
    posts: series.posts
  }))
})

// Event handlers
function onPageChanged(newPage) {
  currentPage.value = newPage
  emit('page-changed', newPage)
}

function onPerPageChanged(newPerPage) {
  itemsPerPage.value = newPerPage
  currentPage.value = 1 // Reset to page 1 when changing items per page
  emit('per-page-changed', newPerPage)
}

// Watch for prop changes
watch(() => props.initialPage, (newPage) => {
  currentPage.value = newPage
})
</script>

<style scoped>
.series-posts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>