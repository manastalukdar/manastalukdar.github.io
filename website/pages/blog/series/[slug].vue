<template>
  <v-container>
    <breadcrumbs v-if="!loading && series" :breadcrumbs="breadcrumbsData" />
    <p v-if="!loading && series" />

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

    <v-row v-else class="text-justify">
      <v-col cols="12">
        <!-- Series Header -->
        <div class="series-header mb-8">
          <v-row class="text-center py-2" justify="center">
            <h1>Series: {{ series.name }}</h1>
          </v-row>

          <p class="text-center text-h6 text-medium-emphasis mb-4">
            {{ series.description }}
          </p>

          <div class="d-flex align-center justify-center gap-4 mb-4">
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

        <client-only>
          <postsList
            :posts-list="formattedPosts"
            :initial-page="currentPage"
            :show-series-info="true"
            @page-changed="onPageChanged"
            @per-page-changed="onPerPageChanged"
          />
        </client-only>
      </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import breadcrumbs from '../../../components/breadcrumbs'
import postsList from '../../../components/blog/posts-list/list.vue'
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'

const route = useRoute()
const router = useRouter()
const navigationStore = useNavigationStore()
const globalDataStore = useGlobalDataStore()
const blogMetadataStore = useBlogMetadataStore()
const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseUrl

const series = ref(null)
const loading = ref(true)
const error = ref(null)
const currentPage = ref(parseInt(String(route.query.page || '1')))

const pageTitle = computed(() => {
  return series.value ? `${series.value.name} - Blog Series` : 'Blog Series'
})

const pageDescription = computed(() => {
  return series.value ? series.value.description : 'Blog series not found'
})

const appOwner = globalDataStore.appOwner
const blogHref = navigationStore.blog.blogItems[0].href
const seriesHref = '/blog/series/'

const breadcrumbsData = computed(() => {
  if (!series.value) return []

  return [
    {
      title: 'Home',
      disabled: false,
      href: '/',
      exact: true,
    },
    {
      title: 'Blog',
      disabled: false,
      href: blogHref,
      exact: true,
    },
    {
      title: 'Series',
      disabled: false,
      href: seriesHref,
      exact: true,
    },
    {
      title: series.value.name,
      disabled: false,
      href: `/blog/series/${series.value.urlSlug}`,
      exact: true,
    },
  ]
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format series posts for the postsList component
const formattedPosts = computed(() => {
  if (!series.value || !blogMetadataStore.blogMetadata) return []

  // Find all published posts that belong to this series
  const seriesPosts = blogMetadataStore.blogMetadata.filter(post =>
    post.published &&
    post.series &&
    post.series['url-slug'] === series.value.urlSlug
  )

  // Sort posts by series part number
  return seriesPosts.sort((a, b) => {
    const partA = a.series?.part || 0
    const partB = b.series?.part || 0
    return partA - partB
  })
})

// Event handlers for pagination
function onPageChanged(newPage) {
  currentPage.value = newPage
  updateURL()
}

function onPerPageChanged(newPerPage) {
  // Reset to page 1 when changing items per page
  currentPage.value = 1
  updateURL()
}

function updateURL() {
  const query = {}
  if (currentPage.value > 1) {
    query.page = currentPage.value
  }

  router.push({
    path: `/blog/series/${route.params.slug}`,
    query: query
  })
}

// Watch for route changes (browser back/forward)
watch(() => route.query.page, (newPage) => {
  currentPage.value = parseInt(String(newPage || '1'))
})

const loadSeries = async () => {
  try {
    loading.value = true
    error.value = null

    // Ensure blog metadata is loaded first
    if (blogMetadataStore.blogMetadata.length < runtimeConfig.public.blogPostCount) {
      await blogMetadataStore.setupBlogMetadata(runtimeConfig.public.baseUrl)
    }

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

// Watch for series changes to update head data
watch(series, (newSeries) => {
  if (newSeries) {
    const title = pageTitle.value + ' | ' + navigationStore.blog.blogText + ' || ' + appOwner
    const description = pageDescription.value
    const url = baseUrl + `/blog/series/${newSeries.urlSlug}`

    const breadcrumbsStructuredDataArray = breadcrumbsData.value.map(
      (item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': baseUrl + item.href,
          name: item.title,
        },
      })
    )

    const breadcrumbsStructuredData = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbsStructuredDataArray,
    }

    useHead({
      title: title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: title,
        },
        {
          hid: 'og-title',
          name: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og-url',
          name: 'og:url',
          property: 'og:url',
          content: url,
        },
        {
          hid: 'og-description',
          name: 'og:description',
          property: 'og:description',
          content: description,
        },
      ],
      link: [{ rel: 'canonical', href: url }],
      __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          innerHTML: JSON.stringify(breadcrumbsStructuredData),
          type: 'application/ld+json',
        },
      ],
    })
  }
})
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}

.gap-2 {
  gap: 8px;
}
</style>
