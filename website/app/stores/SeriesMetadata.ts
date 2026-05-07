import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSeriesMetadataStore = defineStore('SeriesMetadata', () => {
  const seriesMetadata = ref<any[]>([])

  async function setupSeriesMetadata(baseURL: string) {
    const isStaticGeneration = process.env.npm_lifecycle_event === 'generate'

    try {
      let data: any

      if (isStaticGeneration && process.server) {
        try {
          const fs = await import('fs')
          const path = await import('path')
          const filePath = path.resolve('./public/blogdata/metadata/series_metadata.json')
          const fileContent = fs.readFileSync(filePath, 'utf8')
          data = JSON.parse(fileContent)
        } catch (fsError) {
          console.log('Could not read series metadata from filesystem during static generation:', fsError)
          data = []
        }
      } else {
        data = await $fetch('/blogdata/metadata/series_metadata.json')
      }

      seriesMetadata.value = data
    } catch (error) {
      console.log('Error fetching series metadata:', error)
      console.log('Static generation mode:', isStaticGeneration)
      seriesMetadata.value = []
    }
  }

  function setSeriesMetadata(data: any) {
    seriesMetadata.value = data
  }

  function getSeriesMetadata() {
    return seriesMetadata.value
  }

  function getSeriesCount() {
    return seriesMetadata.value.length
  }

  function getPaginatedSeries(page: number, perPage: number) {
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    return seriesMetadata.value.slice(startIndex, endIndex)
  }

  function getTotalPages(perPage: number) {
    return Math.ceil(seriesMetadata.value.length / perPage)
  }

  function getSeriesBySlug(slug: string) {
    return seriesMetadata.value.find((series: any) => series['url-slug'] === slug)
  }

  function getSeriesIndex(currentSeries: any) {
    return seriesMetadata.value.findIndex((series: any) =>
      series['url-slug'] === currentSeries['url-slug']
    )
  }

  function getNextSeries(currentSeries: any) {
    const currentIndex = getSeriesIndex(currentSeries)
    if (currentIndex >= 0 && currentIndex < seriesMetadata.value.length - 1) {
      return seriesMetadata.value[currentIndex + 1]
    }
    return null
  }

  function getPreviousSeries(currentSeries: any) {
    const currentIndex = getSeriesIndex(currentSeries)
    if (currentIndex > 0) {
      return seriesMetadata.value[currentIndex - 1]
    }
    return null
  }

  return {
    seriesMetadata,
    setupSeriesMetadata,
    setSeriesMetadata,
    getSeriesMetadata,
    getSeriesCount,
    getPaginatedSeries,
    getTotalPages,
    getSeriesBySlug,
    getSeriesIndex,
    getNextSeries,
    getPreviousSeries,
  }
})
