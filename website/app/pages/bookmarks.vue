<template>
  <div class="bookmarks-page">
    <div class="container">
      <div class="bookmarks-header">
        <h1 class="page-title">
          <v-icon class="title-icon">mdi-bookmark</v-icon>
          Bookmarks
        </h1>
        <p class="page-description">
          Your saved blog posts for easy access and reference
        </p>
      </div>

      <ClientOnly>
        <div class="bookmarks-content">
          <!-- Bookmark Statistics -->
          <div v-if="bookmarkCount > 0" class="bookmarks-stats mb-4">
            <v-card class="stats-card" elevation="2">
              <v-card-text class="d-flex align-center justify-space-between">
                <div class="stats-item">
                  <v-icon color="primary" class="me-2">mdi-bookmark-multiple</v-icon>
                  <span class="stats-text">{{ bookmarkCount }} bookmark{{ bookmarkCount === 1 ? '' : 's' }}</span>
                </div>
                <div class="stats-actions">
                  <v-btn
                    variant="outlined"
                    color="primary"
                    size="small"
                    @click="showManagement = !showManagement"
                    class="me-2"
                  >
                    <v-icon class="me-1">mdi-cog</v-icon>
                    Manage
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    color="error"
                    size="small"
                    @click="confirmClearAll = true"
                  >
                    <v-icon class="me-1">mdi-delete</v-icon>
                    Clear All
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <!-- Bookmark Management Panel -->
          <div v-if="showManagement && bookmarkCount > 0" class="management-panel mb-4">
            <v-card class="management-card" elevation="2">
              <v-card-title class="management-header">
                <v-icon class="me-2">mdi-cog</v-icon>
                Bookmark Management
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      variant="outlined"
                      color="success"
                      block
                      @click="exportBookmarks"
                    >
                      <v-icon class="me-2">mdi-download</v-icon>
                      Export Bookmarks
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-file-input
                      ref="fileInput"
                      v-model="importFile"
                      accept=".json"
                      label="Import Bookmarks"
                      variant="outlined"
                      @change="importBookmarks"
                      hide-details
                    >
                      <template #prepend-inner>
                        <v-icon>mdi-upload</v-icon>
                      </template>
                    </v-file-input>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>

          <!-- Search and Filter -->
          <div v-if="bookmarkCount > 0" class="bookmarks-filters mb-4">
            <v-card class="filters-card" elevation="1">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="searchQuery"
                      label="Search bookmarks"
                      variant="outlined"
                      clearable
                      hide-details
                      @input="performSearch"
                    >
                      <template #prepend-inner>
                        <v-icon>mdi-magnify</v-icon>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="sortBy"
                      :items="sortOptions"
                      label="Sort by"
                      variant="outlined"
                      hide-details
                      @update:model-value="sortBookmarks"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>

          <!-- Bookmarks List -->
          <div v-if="displayedBookmarks.length > 0" class="bookmarks-list">
            <v-row>
              <v-col
                v-for="bookmark in displayedBookmarks"
                :key="`${bookmark['url-slug']}-${bookmark['first-published-on']}`"
                cols="12"
              >
                <BookmarkPostCard :post="bookmark" />
              </v-col>
            </v-row>
          </div>

          <!-- Empty State -->
          <div v-else-if="bookmarkCount === 0" class="empty-state">
            <v-card class="empty-card" elevation="2">
              <v-card-text class="text-center py-12">
                <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-bookmark-outline</v-icon>
                <h2 class="text-h5 mb-4">No bookmarks yet</h2>
                <p class="text-body-1 mb-6">
                  Start exploring the blog and bookmark posts you'd like to read later.
                  Look for the bookmark icon on any blog post!
                </p>
                <v-btn
                  color="primary"
                  variant="elevated"
                  to="/blog"
                  size="large"
                >
                  <v-icon class="me-2">mdi-book-open-page-variant</v-icon>
                  Browse Blog Posts
                </v-btn>
              </v-card-text>
            </v-card>
          </div>

          <!-- No Search Results -->
          <div v-else-if="searchQuery && displayedBookmarks.length === 0" class="no-results">
            <v-card class="no-results-card" elevation="1">
              <v-card-text class="text-center py-8">
                <v-icon size="60" color="grey-lighten-1" class="mb-3">mdi-magnify</v-icon>
                <h3 class="text-h6 mb-3">No matching bookmarks</h3>
                <p class="text-body-2">
                  Try adjusting your search query or browse all bookmarks.
                </p>
                <v-btn
                  variant="text"
                  color="primary"
                  @click="clearSearch"
                  class="mt-2"
                >
                  Clear Search
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <template #fallback>
          <div class="bookmarks-loading">
            <v-card class="loading-card" elevation="2">
              <v-card-text>
                <v-skeleton-loader type="heading, text, divider, card" />
              </v-card-text>
            </v-card>
          </div>
        </template>
      </ClientOnly>

      <!-- Confirmation Dialog -->
      <v-dialog v-model="confirmClearAll" max-width="400">
        <v-card>
          <v-card-title class="text-h6">
            Clear All Bookmarks?
          </v-card-title>
          <v-card-text>
            This action cannot be undone. All {{ bookmarkCount }} bookmark{{ bookmarkCount === 1 ? '' : 's' }} will be permanently removed.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="confirmClearAll = false">
              Cancel
            </v-btn>
            <v-btn color="error" variant="elevated" @click="clearAllBookmarks">
              Clear All
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Success/Error Snackbar -->
      <v-snackbar
        v-model="showSnackbar"
        :color="snackbarColor"
        :timeout="4000"
      >
        {{ snackbarMessage }}
        <template #actions>
          <v-btn variant="text" @click="showSnackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useBookmarks } from '~/composables/useBookmarks'
import BookmarkPostCard from '~/components/blog/bookmark-post-card.vue'

// Page metadata
definePageMeta({
  title: 'Bookmarks | Manas Talukdar',
  description: 'Your saved blog posts for easy access and reference'
})

// SEO head configuration
useHead({
  title: 'Bookmarks | Manas Talukdar',
  meta: [
    {
      name: 'description',
      content: 'Your personally saved blog posts for easy access and reference. Manage and organize your favorite articles on AI, data science, and engineering.'
    },
    {
      name: 'keywords',
      content: 'bookmarks, saved posts, reading list, blog favorites, personal collection'
    },
    {
      property: 'og:title',
      content: 'Bookmarks - Manas Talukdar'
    },
    {
      property: 'og:description',
      content: 'Your saved blog posts for easy access and reference'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// Composables
const {
  bookmarks,
  bookmarkCount,
  searchBookmarks,
  clearBookmarks,
  exportBookmarks: exportBookmarksData,
  importBookmarks: importBookmarksData
} = useBookmarks()

// Reactive state
const searchQuery = ref('')
const sortBy = ref('recent')
const displayedBookmarks = ref([])
const showManagement = ref(false)
const confirmClearAll = ref(false)
const importFile = ref(null)
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Sort options
const sortOptions = [
  { title: 'Recently Bookmarked', value: 'recent' },
  { title: 'Oldest First', value: 'oldest' },
  { title: 'Title A-Z', value: 'title-asc' },
  { title: 'Title Z-A', value: 'title-desc' },
  { title: 'Publication Date (Newest)', value: 'published-desc' },
  { title: 'Publication Date (Oldest)', value: 'published-asc' }
]

// Computed properties
const filteredBookmarks = computed(() => {
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    return bookmarks.value
  }
  return searchBookmarks(searchQuery.value.trim())
})

// Methods
const performSearch = () => {
  sortBookmarks()
}

const sortBookmarks = () => {
  let sorted = [...filteredBookmarks.value]

  switch (sortBy.value) {
    case 'recent':
      sorted.sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt))
      break
    case 'oldest':
      sorted.sort((a, b) => new Date(a.bookmarkedAt) - new Date(b.bookmarkedAt))
      break
    case 'title-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'title-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'published-desc':
      sorted.sort((a, b) => new Date(b['first-published-on']) - new Date(a['first-published-on']))
      break
    case 'published-asc':
      sorted.sort((a, b) => new Date(a['first-published-on']) - new Date(b['first-published-on']))
      break
  }

  displayedBookmarks.value = sorted
}

const clearSearch = () => {
  searchQuery.value = ''
  performSearch()
}

const clearAllBookmarks = () => {
  clearBookmarks()
  confirmClearAll.value = false
  showSnackbar.value = true
  snackbarMessage.value = 'All bookmarks cleared'
  snackbarColor.value = 'success'
}

const exportBookmarks = () => {
  try {
    const data = exportBookmarksData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookmarks-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showSnackbar.value = true
    snackbarMessage.value = 'Bookmarks exported successfully'
    snackbarColor.value = 'success'
  } catch (error) {
    console.error('Export failed:', error)
    showSnackbar.value = true
    snackbarMessage.value = 'Failed to export bookmarks'
    snackbarColor.value = 'error'
  }
}

const importBookmarks = async () => {
  if (!importFile.value || importFile.value.length === 0) return

  try {
    const file = importFile.value[0]
    const content = await file.text()
    const result = importBookmarksData(content, true) // Merge mode

    if (result.success) {
      showSnackbar.value = true
      snackbarMessage.value = `Successfully imported ${result.imported} bookmarks`
      snackbarColor.value = 'success'
      sortBookmarks() // Refresh display
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Import failed:', error)
    showSnackbar.value = true
    snackbarMessage.value = `Failed to import bookmarks: ${error.message}`
    snackbarColor.value = 'error'
  } finally {
    importFile.value = null
  }
}

// Watch for changes in bookmarks and update display
watch(filteredBookmarks, () => {
  sortBookmarks()
}, { immediate: true })

// Initialize on mount
onMounted(() => {
  sortBookmarks()
})
</script>

<style scoped>
.bookmarks-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.bookmarks-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.title-icon {
  font-size: 1.5rem;
}

.page-description {
  font-size: 1.1rem;
  color: rgb(var(--v-theme-on-surface));
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  opacity: 0.7;
}

.stats-card,
.management-card,
.filters-card,
.empty-card,
.no-results-card,
.loading-card {
  border-radius: 12px;
  background: rgb(var(--v-theme-cardColor));
}

.management-header {
  background: rgb(var(--v-theme-headerAndFooterColor));
  color: rgb(var(--v-theme-on-surface));
  border-radius: 12px 12px 0 0;
}

.stats-item {
  display: flex;
  align-items: center;
}

.stats-text {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.stats-actions {
  display: flex;
  align-items: center;
}

.empty-state,
.no-results {
  margin-top: 48px;
}

.bookmarks-loading {
  max-width: 800px;
  margin: 48px auto;
}

@media (max-width: 960px) {
  .page-title {
    font-size: 1.3rem;
  }

  .stats-actions {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 600px) {
  .bookmarks-page {
    padding: 16px 0;
  }

  .page-title {
    font-size: 1.2rem;
    flex-direction: column;
    gap: 8px;
  }

  .title-icon {
    font-size: 1.3rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .stats-item {
    flex-direction: column;
    text-align: center;
    gap: 4px;
  }

  .stats-actions {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
}
</style>
