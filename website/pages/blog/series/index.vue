<template>
  <div class="series-index-page">
    <Head>
      <Title>{{ pageTitle }}</Title>
      <Meta name="description" :content="pageDescription" />
    </Head>
    
    <div class="page-header mb-8">
      <h1 class="text-h3 mb-4">Blog Series</h1>
      <p class="text-h6 text-medium-emphasis">
        Explore curated collections of related blog posts organized by topic and theme.
      </p>
    </div>
    
    <SeriesList />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SeriesList from '~/components/blog/series/series-list.vue'

const pageTitle = computed(() => 'Blog Series')
const pageDescription = computed(() => 'Explore curated collections of related blog posts organized by topic and theme.')

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
.series-index-page {
  min-height: 100vh;
  padding: 24px;
}

@media (max-width: 768px) {
  .series-index-page {
    padding: 16px;
  }
}

.page-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}
</style>