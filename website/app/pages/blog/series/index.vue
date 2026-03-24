<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsData" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center py-2" justify="center">
          <h1>{{ pageTitle }}</h1>
        </v-row>
      </v-col>
      <v-col cols="12">
        <p class="text-center text-h6 text-medium-emphasis mb-6">
          Explore curated collections of related blog posts organized by topic and theme.
        </p>
        <client-only>
          <SeriesPostsList 
            :series-list="seriesMetadata" 
            :initial-page="currentPage"
            @page-changed="onPageChanged"
            @per-page-changed="onPerPageChanged"
          />
        </client-only>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import breadcrumbs from '../../../components/breadcrumbs'
import SeriesPostsList from '~/components/blog/series/series-posts-list.vue'
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useSeriesMetadataStore } from '@/stores/SeriesMetadata'

const navigationStore = useNavigationStore()
const globalDataStore = useGlobalDataStore()
const seriesMetadataStore = useSeriesMetadataStore()
const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const baseUrl = runtimeConfig.public.baseUrl

// Get current page from route or default to 1
const currentPage = ref(parseInt(String(route.query.page || '1')))

// Setup series metadata
async function setupSeriesMetadata() {
  try {
    if (seriesMetadataStore.getSeriesCount() === 0) {
      await seriesMetadataStore.setupSeriesMetadata(runtimeConfig.public.baseUrl)
    }
  } catch (error) {
    console.log(error)
  }
}
await setupSeriesMetadata()

const appOwner = globalDataStore.appOwner
const pageTitle = computed(() => 'Blog Series')
const pageDescription = computed(() => 'Explore curated collections of related blog posts organized by topic and theme.')
const seriesMetadata = seriesMetadataStore.getSeriesMetadata()

const blogHref = navigationStore.blog.blogItems[0].href
const currentHref = '/blog/series/'
const seriesText = 'Series'

const title = computed(() => {
  if (currentPage.value > 1) {
    return `${pageTitle.value} - Page ${currentPage.value} | ${navigationStore.blog.blogText} || ${appOwner}`
  }
  return `${pageTitle.value} | ${navigationStore.blog.blogText} || ${appOwner}`
})
const description = pageDescription.value
const url = computed(() => {
  if (currentPage.value > 1) {
    return baseUrl + currentHref + '?page=' + currentPage.value
  }
  return baseUrl + currentHref
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
    path: '/blog/series',
    query: query
  })
}

// Watch for route changes (browser back/forward)
watch(() => route.query.page, (newPage) => {
  currentPage.value = parseInt(String(newPage || '1'))
})

const breadcrumbsData = [
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
    title: seriesText,
    disabled: false,
    href: currentHref,
    exact: true,
  },
]

const breadcrumbsStructuredDataArray = breadcrumbsData.map(
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
</script>

<style></style>