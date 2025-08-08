import { defineStore } from 'pinia'

// initial state
const initialState = () => ({
  seriesMetadata: <any>[],
})

export const useSeriesMetadataStore = defineStore('SeriesMetadata', {
  state: initialState,
  actions: {
    async setupSeriesMetadata(baseURL: string) {
      // Only use filesystem reading during actual static generation (nuxt generate)
      // Don't interfere with development server or SSR mode
      const isStaticGeneration = process.env.npm_lifecycle_event === 'generate';
      
      try {
        let data: any;
        
        if (isStaticGeneration && process.server) {
          // During static generation on server, read file directly from filesystem
          try {
            const fs = await import('fs')
            const path = await import('path')
            const filePath = path.resolve('./public/blogdata/metadata/series_metadata.json')
            const fileContent = fs.readFileSync(filePath, 'utf8')
            data = JSON.parse(fileContent)
          } catch (fsError) {
            console.log('Could not read series metadata from filesystem during static generation:', fsError)
            // Fallback to empty array for now
            data = []
          }
        } else {
          // Runtime: use $fetch with appropriate URL
          const fetchUrl = isStaticGeneration 
            ? '/blogdata/metadata/series_metadata.json'
            : baseURL + '/blogdata/metadata/series_metadata.json';
          data = await $fetch(fetchUrl)
        }
        
        this.seriesMetadata = data
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error fetching series metadata:', error)
        console.log('Static generation mode:', isStaticGeneration)
        // Gracefully handle missing metadata during static generation
        this.seriesMetadata = []
      }
    },

    setSeriesMetadata(data: any) {
      this.seriesMetadata = data
    },

    getSeriesMetadata() {
      return this.seriesMetadata
    },

    getSeriesCount() {
      return this.seriesMetadata.length
    },

    getPaginatedSeries(page: number, perPage: number) {
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      return this.seriesMetadata.slice(startIndex, endIndex)
    },

    getTotalPages(perPage: number) {
      return Math.ceil(this.seriesMetadata.length / perPage)
    },

    getSeriesBySlug(slug: string) {
      return this.seriesMetadata.find((series: any) => series['url-slug'] === slug)
    },

    getSeriesIndex(currentSeries: any) {
      return this.seriesMetadata.findIndex((series: any) => 
        series['url-slug'] === currentSeries['url-slug']
      )
    },

    getNextSeries(currentSeries: any) {
      const currentIndex = this.getSeriesIndex(currentSeries)
      if (currentIndex >= 0 && currentIndex < this.seriesMetadata.length - 1) {
        return this.seriesMetadata[currentIndex + 1]
      }
      return null
    },

    getPreviousSeries(currentSeries: any) {
      const currentIndex = this.getSeriesIndex(currentSeries)
      if (currentIndex > 0) {
        return this.seriesMetadata[currentIndex - 1]
      }
      return null
    },
  },
})