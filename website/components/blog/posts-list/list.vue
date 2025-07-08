<template>
  <v-row class="pa-3">
    <v-col class="py-2" cols="12">
      <v-row v-for="item in paginatedPosts" :key="item['url-slug']">
        <singlePost :post-metadata="item" />
      </v-row>
      
      <!-- Pagination Controls -->
      <v-row class="pt-6">
        <v-col cols="12">
          <v-card class="pa-4" elevation="2">
            <!-- Results Summary -->
            <v-row class="align-center mb-3">
              <v-col cols="12" sm="6">
                <span class="text-body-1">
                  Showing {{ startItem }}-{{ endItem }} of {{ totalPosts }} posts
                </span>
              </v-col>
              <v-col cols="12" sm="6" class="text-right">
                <span class="text-body-2 mr-3">Posts per page:</span>
                <v-select
                  v-model="itemsPerPage"
                  :items="itemsPerPageArray"
                  density="compact"
                  style="width: 80px; display: inline-block;"
                  hide-details
                  @update:model-value="onItemsPerPageChange"
                />
              </v-col>
            </v-row>

            <!-- Navigation Controls -->
            <v-row class="align-center justify-center">
              <v-col cols="12" sm="8" class="d-flex align-center justify-center">
                <v-btn
                  :disabled="currentPage <= 1"
                  variant="outlined"
                  @click="prevPage()"
                  class="mr-2"
                >
                  <v-icon left>mdi-chevron-left</v-icon>
                  Previous
                </v-btn>

                <span class="mx-4 text-body-1">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>

                <v-btn
                  :disabled="currentPage >= totalPages"
                  variant="outlined"
                  @click="nextPage()"
                  class="ml-2"
                >
                  Next
                  <v-icon right>mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <!-- Page Jump (for mobile) -->
            <v-row class="mt-2 d-flex d-sm-none">
              <v-col cols="12" class="text-center">
                <v-text-field
                  v-model="pageJump"
                  label="Go to page"
                  type="number"
                  :min="1"
                  :max="totalPages"
                  density="compact"
                  style="width: 120px; display: inline-block;"
                  hide-details
                  @keyup.enter="jumpToPage"
                />
                <v-btn @click="jumpToPage" class="ml-2" size="small">Go</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
import singlePost from './single-post.vue'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'

const passedProps = defineProps({
  postsList: {
    type: Array,
    required: true,
    default() {
      return []
    }
  },
  initialPage: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['page-changed', 'per-page-changed'])

const blogMetadataStore = useBlogMetadataStore()

const itemsPerPageArray = [5, 10, 15, 20]
const itemsPerPage = ref(10)
const currentPage = ref(passedProps.initialPage)
const pageJump = ref(currentPage.value)

// Computed properties
const totalPosts = computed(() => passedProps.postsList.length)
const totalPages = computed(() => Math.ceil(totalPosts.value / itemsPerPage.value))

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return passedProps.postsList.slice(startIndex, endIndex)
})

const startItem = computed(() => {
  if (totalPosts.value === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return Math.min(end, totalPosts.value)
})

// Watch for changes in page and emit to parent
watch(currentPage, (newPage) => {
  emit('page-changed', newPage)
  pageJump.value = newPage
})

watch(itemsPerPage, (newPerPage) => {
  emit('per-page-changed', newPerPage)
})

// Methods
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

function jumpToPage() {
  const pageNum = parseInt(pageJump.value)
  if (pageNum >= 1 && pageNum <= totalPages.value) {
    currentPage.value = pageNum
  }
}

function onItemsPerPageChange() {
  // Reset to page 1 when changing items per page
  currentPage.value = 1
}

// Watch for prop changes
watch(() => passedProps.initialPage, (newPage) => {
  currentPage.value = newPage
  pageJump.value = newPage
})
</script>
