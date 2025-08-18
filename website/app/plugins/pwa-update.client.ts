export default defineNuxtPlugin(() => {
  // Only run on client-side and in browsers that support service workers
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  let refreshing = false
  let waitingWorker: ServiceWorker | null = null

  // Create reactive update store
  const updateStore = reactive({
    hasUpdate: false,
    showNotification: false,
    updating: false,
    
    async applyUpdate() {
      if (!waitingWorker) {
        console.warn('No waiting service worker found')
        return
      }

      this.updating = true
      
      try {
        // Tell the waiting service worker to skip waiting
        waitingWorker.postMessage({ type: 'SKIP_WAITING' })
        console.log('🚀 Activating new service worker...')
        
        // Wait a moment then reload
        await new Promise(resolve => setTimeout(resolve, 1000))
        window.location.reload()
      } catch (error) {
        console.error('Error applying update:', error)
        this.updating = false
      }
    },

    dismissUpdate() {
      this.showNotification = false
      console.log('📋 PWA update dismissed by user')
    }
  })

  const showUpdateNotification = () => {
    updateStore.hasUpdate = true
    updateStore.showNotification = true
    console.log('🔄 New version available! Showing notification.')
  }

  const handleServiceWorkerUpdate = () => {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      console.log('🚀 Service worker updated, refreshing page...')
      window.location.reload()
    })
  }

  const checkForUpdates = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      
      if (!registration.waiting && registration.update) {
        // Check for updates every 5 minutes when app is active
        setInterval(async () => {
          try {
            await registration.update()
            console.log('✅ Checked for service worker updates')
          } catch (error) {
            console.log('Failed to check for updates:', error)
          }
        }, 5 * 60 * 1000) // 5 minutes
      }

      // Handle waiting service worker (new version ready)
      if (registration.waiting) {
        waitingWorker = registration.waiting
        console.log('⏳ New service worker waiting to activate')
        showUpdateNotification()
      }

      // Listen for new service workers
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          console.log('🔍 New service worker installing...')
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              waitingWorker = newWorker
              console.log('✨ New service worker installed, ready to activate')
              showUpdateNotification()
            }
          })
        }
      })

      handleServiceWorkerUpdate()
      
    } catch (error) {
      console.error('Error checking for PWA updates:', error)
    }
  }

  // Start checking for updates when the app loads
  onMounted(() => {
    // Wait a bit for the app to fully load before checking
    setTimeout(() => {
      checkForUpdates()
    }, 2000)
  })

  // Also check when the app regains focus (user returns to tab)
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => {
          checkForUpdates()
        }, 1000)
      }
    })
  }

  // Debug info for PWA updates
  console.log('🔧 PWA update checker initialized')
  console.log(`📱 PWA Version: 2.1.${process.env.contentVersion || 'dev'}`)

  // Provide the update store to the app
  return {
    provide: {
      pwaUpdate: updateStore
    }
  }
})