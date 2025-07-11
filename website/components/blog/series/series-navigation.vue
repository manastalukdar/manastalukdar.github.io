<template>
  <v-card
    v-if="series"
    class="series-navigation mb-6"
    elevation="1"
    variant="outlined"
  >
    <v-card-title class="text-h6 py-3">
      <v-icon class="me-2">mdi-book-open-variant</v-icon>
      Part {{ currentPart }} of {{ series.posts.length }} in 
      <NuxtLink 
        :to="`/blog/series/${series.urlSlug}`"
        class="text-decoration-none text-primary"
      >
        {{ series.name }}
      </NuxtLink>
    </v-card-title>
    
    <v-card-text class="py-0">
      <p class="text-body-2 mb-3">
        {{ series.description }}
      </p>
      
      <div class="navigation-controls d-flex align-center justify-space-between">
        <v-btn
          v-if="previousPost"
          :to="`/blog/${previousPost.path.replace('/readme.md', '')}`"
          variant="outlined"
          color="primary"
          size="small"
        >
          <v-icon start>mdi-chevron-left</v-icon>
          Previous
        </v-btn>
        <div v-else></div>
        
        <v-btn
          :to="`/blog/series/${series.urlSlug}`"
          variant="text"
          color="primary"
          size="small"
        >
          View All Parts
        </v-btn>
        
        <v-btn
          v-if="nextPost"
          :to="`/blog/${nextPost.path.replace('/readme.md', '')}`"
          variant="outlined"
          color="primary"
          size="small"
        >
          Next
          <v-icon end>mdi-chevron-right</v-icon>
        </v-btn>
        <div v-else></div>
      </div>
    </v-card-text>
    
    <v-card-actions v-if="showPostList">
      <v-expansion-panels variant="accordion">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="me-2">mdi-format-list-bulleted</v-icon>
            All Posts in This Series
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="series-posts-list">
              <div 
                v-for="post in series.posts" 
                :key="post.urlSlug"
                class="series-post-item"
                :class="{ 'current-post': post.urlSlug === currentPostSlug }"
              >
                <NuxtLink 
                  :to="`/blog/${post.path.replace('/readme.md', '')}`"
                  class="text-decoration-none d-flex align-center"
                >
                  <v-chip 
                    :color="post.urlSlug === currentPostSlug ? 'primary' : 'default'"
                    size="small"
                    class="me-2"
                  >
                    {{ post.part }}
                  </v-chip>
                  <span :class="post.urlSlug === currentPostSlug ? 'text-primary font-weight-bold' : ''">
                    {{ post.title }}
                  </span>
                  <v-chip 
                    v-if="post.urlSlug === currentPostSlug"
                    color="success"
                    variant="outlined"
                    size="x-small"
                    class="ms-2"
                  >
                    Current
                  </v-chip>
                </NuxtLink>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  series: {
    type: Object,
    required: true
  },
  currentPostSlug: {
    type: String,
    required: true
  },
  showPostList: {
    type: Boolean,
    default: true
  }
})

const currentPost = computed(() => {
  return props.series.posts.find(post => post.urlSlug === props.currentPostSlug)
})

const currentPart = computed(() => {
  return currentPost.value?.part || 1
})

const previousPost = computed(() => {
  if (!currentPost.value) return null
  const currentIndex = props.series.posts.findIndex(post => post.urlSlug === props.currentPostSlug)
  return currentIndex > 0 ? props.series.posts[currentIndex - 1] : null
})

const nextPost = computed(() => {
  if (!currentPost.value) return null
  const currentIndex = props.series.posts.findIndex(post => post.urlSlug === props.currentPostSlug)
  return currentIndex < props.series.posts.length - 1 ? props.series.posts[currentIndex + 1] : null
})
</script>

<style scoped>
.series-navigation {
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.navigation-controls {
  flex-wrap: wrap;
  gap: 8px;
}

.series-posts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.series-post-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.series-post-item:last-child {
  border-bottom: none;
}

.series-post-item.current-post {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-radius: 4px;
  padding: 8px 12px;
}

@media (max-width: 768px) {
  .navigation-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .navigation-controls > div {
    width: 100%;
  }
}
</style>