<template>
  <div v-if="relatedPosts.length > 0" class="related-posts my-6">
    <v-row>
      <v-col cols="12">
        <h3 class="text-h5 mb-4">Related Posts</h3>
        <v-divider class="mb-4"></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col 
        v-for="post in relatedPosts" 
        :key="post.id"
        cols="12" 
        sm="6" 
        md="4"
        class="mb-3"
      >
        <v-card 
          :to="post.url" 
          hover
          class="related-post-card h-100"
          elevation="2"
        >
          <v-card-title class="text-body-1">
            {{ post.title }}
          </v-card-title>
          <v-card-text>
            <div class="text-caption text-medium-emphasis mb-2">
              {{ formatDate(post.date) }}
            </div>
            <v-chip-group>
              <v-chip 
                v-for="category in post.categories.slice(0, 2)" 
                :key="category"
                size="x-small"
                variant="outlined"
                color="primary"
              >
                {{ category }}
              </v-chip>
            </v-chip-group>
            <div v-if="post.score && showScores" class="text-caption text-medium-emphasis mt-2">
              Similarity: {{ Math.round(post.score * 100) }}%
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { searchService } from '@/utils/searchService'
import dayjs from 'dayjs'

const props = defineProps({
  currentPost: {
    type: Object,
    required: true
  },
  maxPosts: {
    type: Number,
    default: 6
  },
  showScores: {
    type: Boolean,
    default: false
  }
})

const relatedPosts = ref([])
const isLoading = ref(false)

const formatDate = (dateString) => {
  return dayjs(dateString).format('MMM DD, YYYY')
}

const findRelatedPosts = async () => {
  if (!props.currentPost) return
  
  isLoading.value = true
  
  try {
    // Prepare current post data for search service
    const currentPostData = {
      id: props.currentPost.path || props.currentPost.id,
      title: props.currentPost.title || '',
      categories: props.currentPost.categories?.map(cat => typeof cat === 'string' ? cat : cat.name) || [],
      tags: props.currentPost.tags?.map(tag => typeof tag === 'string' ? tag : tag.name) || []
    }

    const results = await searchService.findRelatedPosts(currentPostData, {
      limit: props.maxPosts,
      threshold: 0.15,
      excludeCurrentPost: true,
      preferSameCategory: true,
      preferSameTags: true
    })

    relatedPosts.value = results
  } catch (error) {
    console.error('Error finding related posts:', error)
    relatedPosts.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  findRelatedPosts()
})

watch(() => props.currentPost, () => {
  findRelatedPosts()
}, { deep: true })
</script>

<style scoped>
.related-posts {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding-top: 1.5rem;
}

.related-post-card {
  transition: transform 0.2s ease-in-out;
}

.related-post-card:hover {
  transform: translateY(-2px);
}

.v-theme--dark .related-posts {
  border-top-color: rgba(255, 255, 255, 0.12);
}
</style>