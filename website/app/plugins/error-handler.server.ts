export default defineNuxtPlugin(() => {
  // Handle unhandled promise rejections on the server side
  if (process.server) {
    process.on('unhandledRejection', (reason, promise) => {
      // Handle EPIPE errors gracefully
      if (reason && typeof reason === 'object' && 'code' in reason && reason.code === 'EPIPE') {
        console.warn('EPIPE error occurred - connection closed by client')
        return
      }
      
      // Log other unhandled rejections
      console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    })
    
    process.on('uncaughtException', (error) => {
      // Handle EPIPE errors gracefully
      if (error.code === 'EPIPE') {
        console.warn('EPIPE error occurred - connection closed by client')
        return
      }
      
      // Log other uncaught exceptions
      console.error('Uncaught Exception:', error)
    })
  }
})