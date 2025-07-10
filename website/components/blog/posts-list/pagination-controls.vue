<template>
  <!-- Pagination Controls -->
  <v-row class="pt-6">
    <v-col cols="12">
      <v-card color="cardColor" class="pa-4 py-5 px-5" raised elevation="8">
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
</template>

<script setup>
const props = defineProps({
  totalPosts: {
    type: Number,
    required: true,
    default: 0
  },
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  itemsPerPage: {
    type: Number,
    required: true,
    default: 5
  }
})

const emit = defineEmits(['page-changed', 'per-page-changed'])

const itemsPerPageArray = [5, 10, 15, 20]
const pageJump = ref(props.currentPage)

// Local reactive references for v-model
const currentPage = ref(props.currentPage)
const itemsPerPage = ref(props.itemsPerPage)

// Computed properties
const totalPages = computed(() => Math.ceil(props.totalPosts / itemsPerPage.value))

const startItem = computed(() => {
  if (props.totalPosts === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return Math.min(end, props.totalPosts)
})

// Watch for prop changes
watch(() => props.currentPage, (newPage) => {
  currentPage.value = newPage
  pageJump.value = newPage
})

watch(() => props.itemsPerPage, (newPerPage) => {
  itemsPerPage.value = newPerPage
})

// Watch for changes in local state and emit to parent
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
</script>
