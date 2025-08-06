<template>
  <NuxtLayout :name="layout">
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useLoadingStore } from '~/stores/Loading'

const layout = "default";
const loadingStore = useLoadingStore()

// Handle route changes for loading indicator
const router = useRouter()

// Track browser navigation state
let isBrowserNavigating = false
let browserNavigationTimeout: NodeJS.Timeout | null = null

// Function to detect if navigation is from browser back/forward buttons
function isBrowserNavigation(): boolean {
  // Primary detection: check if we're in a browser navigation state
  if (isBrowserNavigating) {
    return true
  }

  // Check if it's a popstate event (browser navigation)
  if (typeof window !== 'undefined' && window.history && window.history.state) {
    // Modern browsers set this during popstate events
    return window.history.state?._isBrowserNavigation === true
  }

  return false
}

// Clean up any existing interval
function cleanupProgressInterval() {
  if ((window as any).loadingProgressInterval) {
    clearInterval((window as any).loadingProgressInterval)
    ;(window as any).loadingProgressInterval = null
  }
}

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    const isBrowser = isBrowserNavigation()

    // Skip loading indicators for browser navigation to prevent interference
    if (!isBrowser) {
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

      // Clean up any existing interval first
      cleanupProgressInterval()

      // Store interval for cleanup
      ;(window as any).loadingProgressInterval = progressInterval
    } else {
      // For browser navigation, ensure no loading state interference
      cleanupProgressInterval()
      loadingStore.stopLoading()
    }
  }
  next()
})

router.afterEach(() => {
  const isBrowser = isBrowserNavigation()

  if (!isBrowser) {
    // Complete the progress and stop loading
    loadingStore.setLinearProgress(100)

    // Clean up interval
    cleanupProgressInterval()

    // Add a small delay to show completion before hiding (reduced for better UX)
    setTimeout(() => {
      loadingStore.stopLoading()
    }, 150)
  } else {
    // For browser navigation, just clean up any existing loading state immediately
    cleanupProgressInterval()
    loadingStore.stopLoading()
  }

  // Clear browser navigation flag after a short delay to handle any race conditions
  setTimeout(() => {
    if (window.history && window.history.state && window.history.state._isBrowserNavigation) {
      window.history.replaceState(
        { ...window.history.state, _isBrowserNavigation: false },
        '',
        window.location.href
      )
    }
  }, 100)
})

// Handle router errors
router.onError((error) => {
  cleanupProgressInterval()
  loadingStore.handleError(error)
})

// Listen for browser navigation events to mark them appropriately
if (typeof window !== 'undefined') {
  // Listen for popstate events (browser back/forward)
  window.addEventListener('popstate', () => {
    // Set browser navigation flag immediately
    isBrowserNavigating = true

    // Clear any existing timeout
    if (browserNavigationTimeout) {
      clearTimeout(browserNavigationTimeout)
    }

    // Reset flag after navigation completes
    browserNavigationTimeout = setTimeout(() => {
      isBrowserNavigating = false
    }, 1000) // Give enough time for navigation to complete

    // Also mark in history state as fallback
    if (window.history && window.history.state) {
      window.history.replaceState(
        { ...window.history.state, _isBrowserNavigation: true },
        '',
        window.location.href
      )
    }
  })

  // Listen for beforeunload to detect browser navigation
  window.addEventListener('beforeunload', () => {
    isBrowserNavigating = true
  })

  // Also listen for hashchange events
  window.addEventListener('hashchange', () => {
    isBrowserNavigating = true
    if (browserNavigationTimeout) {
      clearTimeout(browserNavigationTimeout)
    }
    browserNavigationTimeout = setTimeout(() => {
      isBrowserNavigating = false
    }, 500)
  })

  // Global safety net: ensure loading state is cleared after any navigation
  const originalPushState = window.history.pushState
  const originalReplaceState = window.history.replaceState

  window.history.pushState = function(...args) {
    // This is programmatic navigation, not browser navigation
    isBrowserNavigating = false
    return originalPushState.apply(this, args)
  }

  window.history.replaceState = function(...args) {
    // This is programmatic navigation, not browser navigation
    isBrowserNavigating = false
    return originalReplaceState.apply(this, args)
  }

  // Final safety net: clear loading state after any page visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // If page becomes visible again, ensure loading state is cleared
      setTimeout(() => {
        cleanupProgressInterval()
        loadingStore.stopLoading()
      }, 100)
    }
  })

  // Handle GitHub Pages SPA routing fallback
  // When 404.html redirects here with hash-encoded path, navigate to the correct route
  function handleGitHubPagesSPARouting() {
    const hash = window.location.hash
    const pathname = window.location.pathname
    
    // Debug logging
    if (hash || pathname !== '/') {
      console.log('GitHub Pages SPA Routing Check:', {
        hash,
        pathname,
        href: window.location.href,
        timestamp: new Date().toISOString()
      })
    }
    
    if (hash && hash.startsWith('#/') && hash !== '#/') {
      // Extract the intended path from the hash
      const intendedPath = hash.substring(1) // Remove the # symbol
      
      console.log('SPA Routing - Hash-encoded path detected:', {
        originalHash: hash,
        intendedPath,
        currentPathname: pathname
      })
      
      // Only redirect if we're currently on the homepage and the intended path is different
      if (pathname === '/' && intendedPath !== '/') {
        console.log('SPA Routing - Redirecting to:', intendedPath)
        // Clear the hash and navigate to the intended route
        window.history.replaceState({}, '', window.location.pathname + window.location.search)
        router.push(intendedPath)
      }
    }
  }

  // Check for hash-encoded routes on page load
  handleGitHubPagesSPARouting()

  // Also check when hash changes (in case of edge cases)
  window.addEventListener('hashchange', handleGitHubPagesSPARouting)
}
</script>

<script lang="ts">
export default {
};
</script>
