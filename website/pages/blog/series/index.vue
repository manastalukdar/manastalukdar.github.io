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
        <SeriesList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import breadcrumbs from '../../../components/breadcrumbs'
import SeriesList from '~/components/blog/series/series-list.vue'
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'

const navigationStore = useNavigationStore()
const globalDataStore = useGlobalDataStore()
const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const baseUrl = runtimeConfig.public.baseUrl

const appOwner = globalDataStore.appOwner
const pageTitle = computed(() => 'Blog Series')
const pageDescription = computed(() => 'Explore curated collections of related blog posts organized by topic and theme.')

const blogHref = navigationStore.blog.blogItems[0].href
const currentHref = '/blog/series/'
const seriesText = 'Series'

const title = pageTitle.value + ' | ' + navigationStore.blog.blogText + ' || ' + appOwner
const description = pageDescription.value
const url = baseUrl + currentHref

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