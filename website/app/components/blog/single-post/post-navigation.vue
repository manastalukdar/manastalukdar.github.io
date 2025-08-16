<template>
  <v-row class="py-4">
    <v-col cols="12" class="px-0 pt-5">
      <v-card color="cardColor" raised elevation="8" class="pa-4 py-4">
        <v-row class="align-center">
          <!-- Previous Post -->
          <v-col cols="12" md="5">
            <div v-if="previousPost" class="text-left">
              <div class="text-caption text-medium-emphasis mb-1">Previous Post</div>
              <NuxtLink
                :to="getPreviousPostUrl()"
                class="text-decoration-none"
              >
                <v-card
                  variant="outlined"
                  class="pa-3 hover-card"
                  hover
                >
                  <div class="d-flex align-start">
                    <TreeShakenIcon icon="mdi-chevron-left" class="mr-2 mt-1" size="small" />
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium mb-1 text-wrap">
                        {{ previousPost.title }}
                      </div>
                      <div class="text-caption text-medium-emphasis mb-2">
                        {{ formatDate(previousPost['first-published-on']) }}
                      </div>
                      <div class="text-caption text-medium-emphasis text-wrap">
                        {{ truncateText(previousPost.excerpt, 80) }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </NuxtLink>
            </div>
            <div v-else class="text-center text-medium-emphasis">
              <TreeShakenIcon icon="mdi-minus" class="mr-1" />
              No previous post
            </div>
          </v-col>

          <!-- Separator -->
          <v-col cols="12" md="2" class="text-center">
            <v-divider vertical class="d-none d-md-block mx-auto" style="height: 60px;"></v-divider>
            <v-divider class="d-block d-md-none my-3"></v-divider>
            <NuxtLink to="/blog" class="text-decoration-none">
              <v-btn
                variant="outlined"
                size="small"
                class="text-caption"
              >
                <TreeShakenIcon icon="mdi-view-list" size="small" />
                Back to Blog
              </v-btn>
            </NuxtLink>
          </v-col>

          <!-- Next Post -->
          <v-col cols="12" md="5">
            <div v-if="nextPost" class="text-right">
              <div class="text-caption text-medium-emphasis mb-1">Next Post</div>
              <NuxtLink
                :to="getNextPostUrl()"
                class="text-decoration-none"
              >
                <v-card
                  variant="outlined"
                  class="pa-3 hover-card"
                  hover
                >
                  <div class="d-flex align-start">
                    <div class="flex-grow-1">
                      <div class="text-body-2 font-weight-medium mb-1 text-wrap">
                        {{ nextPost.title }}
                      </div>
                      <div class="text-caption text-medium-emphasis mb-2">
                        {{ formatDate(nextPost['first-published-on']) }}
                      </div>
                      <div class="text-caption text-medium-emphasis text-wrap">
                        {{ truncateText(nextPost.excerpt, 80) }}
                      </div>
                    </div>
                    <TreeShakenIcon icon="mdi-chevron-right" class="ml-2 mt-1" size="small" />
                  </div>
                </v-card>
              </NuxtLink>
            </div>
            <div v-else class="text-center text-medium-emphasis">
              <TreeShakenIcon icon="mdi-minus" class="mr-1" />
              No next post
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import dayjs from 'dayjs'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
import TreeShakenIcon from '~/components/TreeShakenIcon.vue'

const props = defineProps({
  currentPost: {
    type: Object,
    required: true
  }
})

const blogMetadataStore = useBlogMetadataStore()

// Get previous and next posts
const previousPost = computed(() => {
  return blogMetadataStore.getPreviousPost(props.currentPost)
})

const nextPost = computed(() => {
  return blogMetadataStore.getNextPost(props.currentPost)
})

// Helper functions
function formatDate(dateString) {
  return dayjs(dateString).format('MMM DD, YYYY')
}

function truncateText(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

function getPreviousPostUrl() {
  if (!previousPost.value) return ''
  const date = dayjs(previousPost.value['first-published-on'])
  return `/blog/${date.format('YYYY')}/${date.format('MM')}/${date.format('DD')}/${previousPost.value['url-slug']}`
}

function getNextPostUrl() {
  if (!nextPost.value) return ''
  const date = dayjs(nextPost.value['first-published-on'])
  return `/blog/${date.format('YYYY')}/${date.format('MM')}/${date.format('DD')}/${nextPost.value['url-slug']}`
}
</script>

<style scoped>
.hover-card {
  transition: all 0.2s ease-in-out;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.text-wrap {
  word-break: break-word;
  hyphens: auto;
}
</style>
