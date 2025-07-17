<template>
  <v-btn
    :icon="bookmarkIcon"
    :color="bookmarkColor"
    variant="text"
    size="large"
    :loading="isLoading"
    @click="handleBookmarkToggle"
    :aria-label="bookmarkLabel"
    class="bookmark-btn"
  >
    <v-icon :icon="bookmarkIcon" />
    
    <v-tooltip
      activator="parent"
      location="bottom"
      :text="bookmarkTooltip"
    />
  </v-btn>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBookmarks } from '~/composables/useBookmarks'

const props = defineProps({
  post: {
    type: Object,
    required: true,
    validator: (post) => {
      return post && post['url-slug'] && post.title
    }
  },
  size: {
    type: String,
    default: 'large',
    validator: (size) => ['x-small', 'small', 'default', 'large', 'x-large'].includes(size)
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['bookmark-added', 'bookmark-removed', 'bookmark-toggled'])

const { isBookmarked, toggleBookmark, isLoaded } = useBookmarks()
const isLoading = ref(false)

// Computed properties for dynamic styling
const bookmarkIcon = computed(() => {
  return isBookmarked(props.post) ? 'mdi-bookmark' : 'mdi-bookmark-outline'
})

const bookmarkColor = computed(() => {
  return isBookmarked(props.post) ? 'primary' : 'grey'
})

const bookmarkLabel = computed(() => {
  return isBookmarked(props.post) ? 'Remove bookmark' : 'Add bookmark'
})

const bookmarkTooltip = computed(() => {
  if (!isLoaded.value) return 'Loading...'
  return isBookmarked(props.post) ? 'Remove from bookmarks' : 'Add to bookmarks'
})

// Handle bookmark toggle with loading state and events
const handleBookmarkToggle = async () => {
  if (isLoading.value || !props.post) return
  
  isLoading.value = true
  
  try {
    const wasBookmarked = isBookmarked(props.post)
    const result = toggleBookmark(props.post)
    
    if (result) {
      // Emit specific events for different actions
      if (wasBookmarked) {
        emit('bookmark-removed', props.post)
      } else {
        emit('bookmark-added', props.post)
      }
      
      // Emit general toggle event
      emit('bookmark-toggled', {
        post: props.post,
        isBookmarked: !wasBookmarked,
        action: wasBookmarked ? 'removed' : 'added'
      })
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error)
  } finally {
    // Add small delay for better UX
    setTimeout(() => {
      isLoading.value = false
    }, 150)
  }
}

// Ensure bookmarks are loaded when component mounts
onMounted(() => {
  // The useBookmarks composable handles loading automatically
  // This is just to ensure it's initialized
})
</script>

<style scoped>
.bookmark-btn {
  transition: all 0.2s ease-in-out;
}

.bookmark-btn:hover {
  transform: scale(1.05);
}

.bookmark-btn .v-icon {
  transition: all 0.2s ease-in-out;
}

.bookmark-btn:hover .v-icon {
  transform: scale(1.1);
}

/* Custom animation for bookmark state changes */
.bookmark-btn.v-btn--loading {
  pointer-events: none;
}

/* Ensure consistent sizing */
.bookmark-btn.v-btn--size-small {
  min-width: 32px;
  min-height: 32px;
}

.bookmark-btn.v-btn--size-default {
  min-width: 40px;
  min-height: 40px;
}

/* Accessibility improvements */
.bookmark-btn:focus {
  outline: 2px solid var(--v-theme-primary);
  outline-offset: 2px;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .bookmark-btn:focus {
    outline-color: var(--v-theme-primary);
  }
}
</style>