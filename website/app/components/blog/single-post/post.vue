<template>
  <v-container>
    <v-col class="px-2">
      <v-row id="printMe" class="py-3 px-3">
        <v-card color="cardColor" raised elevation="8" class="py-6 px-6 v-row">
          <postHeader :post-metadata="passedProps.postMetadata"/>
          <p />

          <!-- Table of Contents -->
          <client-only>
            <tableOfContents class="pl-10 pt-15"
              content-selector=".blogPostContent"
              :min-headings="3"
              :max-level="4"
              position="sticky"
              :show-progress="true"
              :smooth-scroll="true"
              :collapsible="true"
            />
          </client-only>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="blogPostContent col px-5 pt-5" v-html="passedProps.postContent" />
        </v-card>
      </v-row>

      <!-- Series Navigation -->
      <v-row v-if="currentSeries" class="py-3">
        <v-col cols="12">
          <client-only>
            <seriesNavigation
              :series="currentSeries"
              :current-post-slug="passedProps.postMetadata['url-slug']"
            />
          </client-only>
        </v-col>
      </v-row>

      <v-row class="py-3">
        <client-only>
          <socialSharing
            :url="url"
            :title="passedProps.postMetadata.title"
            :description="passedProps.postMetadata.description"
            :quote="passedProps.postMetadata.excerpt"
            :hashtags="hashtags()"
          />
        </client-only>
      </v-row>

      <v-row class="py-3">
        <v-col cols="12">
          <postNavigation :current-post="passedProps.postMetadata" />
        </v-col>
      </v-row>

      <v-row class="pt-1 pb-3">
        <v-col cols="12">
          <client-only>
            <relatedPosts :current-post="passedProps.postMetadata" />
          </client-only>
        </v-col>
      </v-row>

      <v-row class="py-3">
        <comments :post-id="postId" :url="url" />
      </v-row>
    </v-col>

    <!-- Reading Progress Indicator -->
    <client-only>
      <readingProgress
        content-selector=".blogPostContent"
        :reading-speed="225"
        :show-time-remaining="true"
      />
    </client-only>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import postHeader from './post-header.vue'
// Dynamic import for social sharing (loads only when blog post is viewed)
const socialSharing = defineAsyncComponent(() => import('./social-sharing.vue'))
import comments from './comments.vue'
import postNavigation from './post-navigation.vue'
import relatedPosts from './related-posts.vue'
import readingProgress from './reading-progress.vue'
import tableOfContents from './table-of-contents.vue'
import seriesNavigation from '../series/series-navigation.vue'
import mermaid from 'mermaid'
if (process.browser) {
  mermaid.initialize({ startOnLoad: false });
  await mermaid.run()
}

const currentSeries = ref(null)
const passedProps = defineProps({
  postMetadata: {
    type: Object,
    required: true,
    default: () => {},
  },
  postContent: {
    type: String,
    required: true,
    default: '',
  },
  url: {
    type: String,
    required: true,
    default: '',
  },
  postId: {
    type: String,
    required: true,
    default: '',
  },
});
const hashtags = () => {
  const hashtagsArray = []
  passedProps.postMetadata.categories.forEach((category) => {
    const noSpecialCharNoSpaces = category.name
      .replace('[^a-zA-Z0-9]+', '')
      .replace(/\s+/g, '')
    hashtagsArray.push(noSpecialCharNoSpaces)
  })
  passedProps.postMetadata.tags.forEach((tag) => {
    const noSpecialCharNoSpaces = tag.name
      .replace('[^a-zA-Z0-9]+', '')
      .replace(/\s+/g, '')
    hashtagsArray.push(noSpecialCharNoSpaces)
  })
  return hashtagsArray.join()
}

const loadSeriesData = async () => {
  // Check if this post has series information
  if (!passedProps.postMetadata.series) {
    return
  }

  try {
    const response = await fetch('/blogdata/metadata/series_metadata.json')
    if (!response.ok) {
      console.error('Failed to load series metadata')
      return
    }

    const seriesData = await response.json()
    const series = seriesData.find(s => s['url-slug'] === passedProps.postMetadata.series['url-slug'])

    if (series) {
      currentSeries.value = {
        name: series.name,
        urlSlug: series['url-slug'],
        description: series.description,
        posts: series.posts
      }
    }
  } catch (err) {
    console.error('Error loading series data:', err)
  }
}

onMounted(() => {
  loadSeriesData()
})
</script>

<style>
.printButton {
  display: flex;
  justify-content: center;
}
</style>
