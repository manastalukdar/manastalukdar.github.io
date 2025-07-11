<template>
  <div class="series-detail-page">
    <Head>
      <Title>{{ pageTitle }}</Title>
      <Meta name="description" :content="pageDescription" />
    </Head>
    
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
      <v-btn 
        to="/blog/series" 
        variant="outlined"
        color="primary"
      >
        Back to Series
      </v-btn>
    </div>
    
    <div v-else-if="!series" class="text-center py-8">
      <v-alert 
        type="info" 
        variant="outlined"
        class="mb-4"
      >
        Series not found.
      </v-alert>
      <v-btn 
        to="/blog/series" 
        variant="outlined"
        color="primary"
      >
        Back to Series
      </v-btn>
    </div>
    
    <div v-else class="series-content">
      <!-- Series Header -->
      <div class="series-header mb-8">
        <nav class="breadcrumb mb-4">
          <NuxtLink to="/blog" class="text-decoration-none">Blog</NuxtLink>
          <span class="mx-2">•</span>
          <NuxtLink to="/blog/series" class="text-decoration-none">Series</NuxtLink>
          <span class="mx-2">•</span>
          <span class="text-medium-emphasis">{{ series.name }}</span>
        </nav>
        
        <h1 class="text-h3 mb-4">{{ series.name }}</h1>
        <p class="text-h6 text-medium-emphasis mb-4">
          {{ series.description }}
        </p>
        
        <div class="d-flex align-center gap-4 mb-4">
          <v-chip
            color="primary"
            variant="outlined"
            size="large"
          >
            {{ series.postCount }} {{ series.postCount === 1 ? 'post' : 'posts' }}
          </v-chip>
          
          <v-chip
            color="secondary"
            variant="outlined"
            size="large"
          >
            {{ formatDate(series.firstPublished) }} - {{ formatDate(series.lastUpdated) }}
          </v-chip>
        </div>
      </div>
      
      <!-- Series Posts -->
      <div class="series-posts">
        <h2 class="text-h4 mb-6">All Posts in This Series</h2>
        
        <div class="posts-list">
          <v-card
            v-for="post in series.posts"
            :key="post.urlSlug"
            class="post-card mb-4"
            elevation="1"
            variant="outlined"
          >
            <v-card-text class="py-4">
              <div class="d-flex align-start gap-4">
                <v-chip 
                  color="primary"
                  size="large"
                  class="flex-shrink-0"
                >
                  Part {{ post.part }}
                </v-chip>
                
                <div class="flex-grow-1">
                  <h3 class="text-h6 mb-2">
                    <NuxtLink 
                      :to="`/blog/${post.path.replace('/readme.md', '')}`"
                      class="text-decoration-none"
                    >
                      {{ post.title }}
                    </NuxtLink>
                  </h3>
                  
                  <p class="text-body-2 text-medium-emphasis mb-2">
                    {{ post.excerpt }}
                  </p>
                  
                  <div class="d-flex align-center gap-2">
                    <v-chip
                      color="default"
                      variant="outlined"
                      size="small"
                    >
                      {{ post.readingTime.text }}
                    </v-chip>
                    
                    <v-chip
                      color="default"
                      variant="outlined"
                      size="small"
                    >
                      {{ formatDate(post.firstPublishedOn) }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-card-text>
            
            <v-card-actions>
              <v-btn
                :to="`/blog/${post.path.replace('/readme.md', '')}`"
                variant="text"
                color="primary"
              >
                Read Post
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const series = ref(null)
const loading = ref(true)
const error = ref(null)

const pageTitle = computed(() => {
  return series.value ? `${series.value.name} - Blog Series` : 'Blog Series'
})

const pageDescription = computed(() => {
  return series.value ? series.value.description : 'Blog series not found'
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadSeries = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch('/blogdata/metadata/series_metadata.json')
    if (!response.ok) {
      throw new Error('Failed to load series metadata')
    }
    
    const data = await response.json()
    const seriesData = data.find(item => item['url-slug'] === route.params.slug)
    
    if (seriesData) {
      series.value = {
        name: seriesData.name,
        urlSlug: seriesData['url-slug'],
        description: seriesData.description,
        postCount: seriesData.post_count,
        firstPublished: seriesData.first_published,
        lastUpdated: seriesData.last_updated,
        posts: seriesData.posts.map(post => ({
          ...post,
          firstPublishedOn: post['first-published-on'],
          readingTime: post['reading-time']
        }))
      }
    } else {
      series.value = null
    }
    
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

// SEO and meta tags
useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription
})
</script>

<style scoped>
.series-detail-page {
  min-height: 100vh;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .series-detail-page {
    padding: 16px;
  }
}

.series-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.breadcrumb {
  font-size: 0.875rem;
  opacity: 0.8;
}

.post-card {
  transition: all 0.2s ease-in-out;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.gap-4 {
  gap: 16px;
}

.gap-2 {
  gap: 8px;
}
</style>