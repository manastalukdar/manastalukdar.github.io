<template>
  <v-card
    class="series-card mb-6"
    elevation="2"
    :href="`/blog/series/${series.urlSlug}`"
  >
    <v-card-title class="text-h5">
      {{ series.name }}
    </v-card-title>
    
    <v-card-text>
      <p class="text-body-1 mb-3">
        {{ series.description }}
      </p>
      
      <div class="d-flex align-center mb-3">
        <v-chip
          color="primary"
          variant="outlined"
          size="small"
          class="me-2"
        >
          {{ series.postCount }} {{ series.postCount === 1 ? 'post' : 'posts' }}
        </v-chip>
        
        <v-chip
          color="secondary"
          variant="outlined"
          size="small"
        >
          {{ formatDate(series.firstPublished) }} - {{ formatDate(series.lastUpdated) }}
        </v-chip>
      </div>
      
      <div class="latest-posts">
        <h4 class="text-h6 mb-2">Latest Posts:</h4>
        <ul class="post-list">
          <li 
            v-for="post in series.posts.slice(-3).reverse()" 
            :key="post.urlSlug"
            class="mb-1"
          >
            <NuxtLink 
              :to="`/blog/${post.path.replace('/readme.md', '')}`"
              class="text-decoration-none"
            >
              <span class="text-primary">Part {{ post.part }}:</span>
              {{ post.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </v-card-text>
    
    <v-card-actions>
      <v-btn
        variant="text"
        color="primary"
        :to="`/blog/series/${series.urlSlug}`"
      >
        View Series
        <TreeShakenIcon icon="mdi-arrow-right" />
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import TreeShakenIcon from '~/components/TreeShakenIcon.vue'

const props = defineProps({
  series: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}
</script>

<style scoped>
.series-card {
  transition: all 0.2s ease-in-out;
}

.series-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.post-list {
  list-style: none;
  padding: 0;
}

.post-list li {
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.post-list li:last-child {
  border-bottom: none;
}

.latest-posts {
  margin-top: 16px;
}
</style>