export default defineNuxtPlugin(() => {
  // Handle unhandled promise rejections on the client side
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      // Log the error but don't crash the application
      console.warn('Unhandled promise rejection:', event.reason)
      
      // Prevent the default browser behavior (showing error in console)
      // Only for EPIPE and similar network errors
      if (event.reason?.code === 'EPIPE' || event.reason?.message?.includes('EPIPE')) {
        event.preventDefault()
      }
    })
  }
})