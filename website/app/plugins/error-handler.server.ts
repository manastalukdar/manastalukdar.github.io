export default defineNuxtPlugin(() => {
  // Handle unhandled promise rejections on the server side
  if (process.server && !process.listenerCount || process.listenerCount('unhandledRejection') === 0) {
    const handleUnhandledRejection = (reason: any, promise: Promise<any>) => {
      // Handle EPIPE errors gracefully
      if (reason && typeof reason === 'object' && 'code' in reason && reason.code === 'EPIPE') {
        console.warn('EPIPE error occurred - connection closed by client')
        return
      }
      
      // Log other unhandled rejections
      console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    }
    
    const handleUncaughtException = (error: any) => {
      // Handle EPIPE errors gracefully
      if (error.code === 'EPIPE') {
        console.warn('EPIPE error occurred - connection closed by client')
        return
      }
      
      // Log other uncaught exceptions
      console.error('Uncaught Exception:', error)
    }
    
    process.on('unhandledRejection', handleUnhandledRejection)
    process.on('uncaughtException', handleUncaughtException)
  }
})