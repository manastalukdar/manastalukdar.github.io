<template>
  <NuxtLayout :name="layout">
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useLoadingStore } from '~/stores/Loading'

// Declare window property for progress interval
declare global {
  interface Window {
    loadingProgressInterval?: NodeJS.Timeout | null
  }
}

const layout = "default";
const loadingStore = useLoadingStore()

// Handle route changes for loading indicator
const router = useRouter()

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    // Start loading with indeterminate linear progress
    loadingStore.startLoading('Loading page...', null)
    
    // Simulate progress updates for demonstration
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += Math.random() * 30
      if (progress > 90) {
        progress = 90 // Keep some buffer for completion
        clearInterval(progressInterval)
      }
      loadingStore.setLinearProgress(progress)
    }, 100)
    
    // Store interval for cleanup
    if (!window.loadingProgressInterval) {
      window.loadingProgressInterval = progressInterval
    }
  }
  next()
})

router.afterEach(() => {
  // Complete the progress and stop loading
  loadingStore.setLinearProgress(100)
  
  // Clean up interval
  if (window.loadingProgressInterval) {
    clearInterval(window.loadingProgressInterval)
    window.loadingProgressInterval = null
  }
  
  // Add a small delay to show completion before hiding
  setTimeout(() => {
    loadingStore.stopLoading()
  }, 300)
})

// Handle router errors
router.onError((error) => {
  loadingStore.handleError(error)
})
</script>

<script lang="ts">
export default {
};
</script>
