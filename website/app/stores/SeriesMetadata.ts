import { defineStore } from 'pinia'

// initial state
const initialState = () => ({
  seriesMetadata: <any>[],
})

export const useSeriesMetadataStore = defineStore('SeriesMetadata', {
  state: initialState,
  actions: {
    async setupSeriesMetadata(baseURL: string) {
      try {
        const data: any = await $fetch(baseURL + '/blogdata/metadata/series_metadata.json')
        this.seriesMetadata = data
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error fetching series metadata:', error)
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