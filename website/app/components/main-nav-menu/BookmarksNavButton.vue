<template>
  <v-btn text to="/bookmarks" :aria-label="buttonLabel">
    <TreeShakenIcon icon="mdi-bookmark" class="mr-2" />
    <span class="hidden-sm-and-down mr-1">Bookmarks</span>
    <v-badge
      v-if="bookmarkCount > 0"
      :content="badgeContent"
      color="primary"
      :inline="true"
      class="bookmark-badge"
    />
  </v-btn>
</template>

<script setup>
import { computed } from 'vue'
import { useBookmarks } from '~/composables/useBookmarks'
import TreeShakenIcon from '@/components/TreeShakenIcon.vue'

const { bookmarkCount, isLoaded } = useBookmarks()

// Computed properties
const badgeContent = computed(() => {
  if (!isLoaded.value) return '0'
  return bookmarkCount.value > 99 ? '99+' : bookmarkCount.value.toString()
})

const buttonLabel = computed(() => {
  const count = isLoaded.value ? bookmarkCount.value : 0
  return `Bookmarks (${count} saved)`
})
</script>

<style scoped>
.bookmark-badge {
  margin-left: 4px;
}

/* Ensure proper spacing on different screen sizes */
@media (max-width: 960px) {
  .bookmark-badge {
    margin-left: 2px;
  }
}
</style>