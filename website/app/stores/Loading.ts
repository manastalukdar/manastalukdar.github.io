import { defineStore } from 'pinia'

// initial state
const initialState = () => ({
  isLoading: false,
  loadingMessage: '',
  linearProgress: null as number | null // null = indeterminate, number = determinate progress
})

export const useLoadingStore = defineStore('Loading', {
  state: initialState,
  actions: {
    startLoading(message = '', progress: number | null = null) {
      this.isLoading = true
      this.loadingMessage = message
      this.linearProgress = progress
    },
    stopLoading() {
      this.isLoading = false
      this.loadingMessage = ''
      this.linearProgress = null
    },
    setLoadingMessage(message: string) {
      this.loadingMessage = message
    },
    setLinearProgress(progress: number | null) {
      this.linearProgress = progress
    },
    handleError(error: any) {
      // Stop loading on any error
      this.stopLoading()
      
      // Log error but don't crash the app
      console.warn('Loading operation failed:', error)
    }
  }
})