<template>
  <v-row class="pa-3">
    <v-col class="py-2" cols="12">
      <v-row v-for="item in paginatedPosts" :key="item['url-slug']">
        <singlePost :post-metadata="item" />
      </v-row>
      
      <!-- Pagination Controls -->
      <paginationControls
        :total-posts="totalPosts"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        @page-changed="onPageChanged"
        @per-page-changed="onPerPageChanged"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import singlePost from './single-post.vue'
import paginationControls from './pagination-controls.vue'

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

const itemsPerPage = ref(5)
const currentPage = ref(passedProps.initialPage)

// Computed properties
const totalPosts = computed(() => passedProps.postsList.length)

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return passedProps.postsList.slice(startIndex, endIndex)
})

// Event handlers
function onPageChanged(newPage) {
  currentPage.value = newPage
  emit('page-changed', newPage)
}

function onPerPageChanged(newPerPage) {
  itemsPerPage.value = newPerPage
  currentPage.value = 1 // Reset to page 1 when changing items per page
  emit('per-page-changed', newPerPage)
}

// Watch for prop changes
watch(() => passedProps.initialPage, (newPage) => {
  currentPage.value = newPage
})
</script>
