<template>
  <div class="series-list">
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
    
    <div v-else-if="series.length === 0" class="text-center py-8">
      <v-alert 
        type="info" 
        variant="outlined"
        class="mb-4"
      >
        No series found.
      </v-alert>
    </div>
    
    <div v-else class="series-grid">
      <div 
        v-for="item in series" 
        :key="item.urlSlug"
        class="series-item"
      >
        <SeriesCard :series="item" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SeriesCard from './series-card.vue'

const series = ref([])
const loading = ref(true)
const error = ref(null)

const loadSeries = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch('/blogdata/metadata/series_metadata.json')
    if (!response.ok) {
      throw new Error('Failed to load series metadata')
    }
    
    const data = await response.json()
    series.value = data.map(item => ({
      name: item.name,
      urlSlug: item['url-slug'],
      description: item.description,
      postCount: item.post_count,
      firstPublished: item.first_published,
      lastUpdated: item.last_updated,
      posts: item.posts
    }))
    
  } catch (err) {
    error.value = err.message
    console.error('Error loading series:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSeries()
})
</script>

<style scoped>
.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .series-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.series-item {
  height: fit-content;
}
</style>