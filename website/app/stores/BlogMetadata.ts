// import axios from 'axios' - Replaced with $fetch for better Nuxt compatibility
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { find, groupBy } from 'lodash-es'

// initial state
const initialState = () => ({
  blogMetadata: <any>[],
})

export const useBlogMetadataStore = defineStore('BlogMetadata', {
  state: initialState,
  actions: {
    async setupBlogMetadata(baseURL: string, forceRefresh: boolean = false) {
      try {
        // For same-session performance: check localStorage cache first (client-side only)
        // But always fetch fresh on initial load (forceRefresh=true from home page)
        if (process.client && !forceRefresh) {
          const cachedData = localStorage.getItem('blogMetadata')
          const cacheTimestamp = localStorage.getItem('blogMetadataTimestamp')
          const cacheAge = Date.now() - (parseInt(cacheTimestamp || '0'))
          
          // Use cache if less than 30 seconds old (for same-session browsing performance)
          if (cachedData && cacheAge < 30000) {
            this.blogMetadata = JSON.parse(cachedData)
            // Still fetch in background to update cache
            this.updateCacheInBackground(baseURL)
            return
          }
        }
        
        let data: any;
        
        if (process.server) {
          // During SSR or static generation on server, try filesystem first
          try {
            const fs = await import('fs')
            const path = await import('path')
            const filePath = path.resolve('./public/blogdata/metadata/blog_metadata.json')
            const fileContent = fs.readFileSync(filePath, 'utf8')
            data = JSON.parse(fileContent)
          } catch (fsError) {
            console.log('Could not read metadata from filesystem, using fetch:', fsError)
            // Fallback to fetch for server-side
            const fetchUrl = baseURL + '/blogdata/metadata/blog_metadata.json';
            data = await $fetch(fetchUrl)
          }
        } else {
          // Client-side: use appropriate URL based on deployment context
          const fetchUrl = baseURL.includes('github.io') 
            ? '/blogdata/metadata/blog_metadata.json'
            : baseURL + '/blogdata/metadata/blog_metadata.json';
          data = await $fetch(fetchUrl)
          
          // Cache the data client-side
          try {
            localStorage.setItem('blogMetadata', JSON.stringify(data))
            localStorage.setItem('blogMetadataTimestamp', Date.now().toString())
          } catch (storageError) {
            console.log('Could not cache blog metadata:', storageError)
          }
        }
        
        this.blogMetadata = data
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error fetching blog metadata:', error)
        console.log('Base URL:', baseURL, 'Client:', process.client)
        // Gracefully handle missing metadata
        this.blogMetadata = []
      }
    },

    // Background cache update without blocking UI
    async updateCacheInBackground(baseURL: string) {
      try {
        const fetchUrl = baseURL.includes('github.io') 
          ? '/blogdata/metadata/blog_metadata.json'
          : baseURL + '/blogdata/metadata/blog_metadata.json';
        const data = await $fetch(fetchUrl)
        
        // Update cache and store
        localStorage.setItem('blogMetadata', JSON.stringify(data))
        localStorage.setItem('blogMetadataTimestamp', Date.now().toString())
        this.blogMetadata = data
      } catch (error) {
        console.log('Background cache update failed:', error)
      }
    },

    setBlogMetadata(data: any) {
      this.blogMetadata = data
    },

    getBlogMetadata() {
      return this.blogMetadata
    },

    getPostsForDay(year: string, month: string, day: string) {
      const groupedByDay = this.blogMetadata.reduce(function (acc: { [x: string]: any[] }, curr: { [x: string]: string | number | Date | dayjs.Dayjs | null | undefined }) {
        const dayjsObj = dayjs(curr['first-published-on'])
        const yearCurr = dayjsObj.format('YYYY')
        const monthCurr = dayjsObj.format('MM')
        const dayCurr = dayjsObj.format('DD')
        const key = yearCurr + '-' + monthCurr + '-' + dayCurr
        if (acc[key]) {
          acc[key].push(curr)
        } else {
          acc[key] = [curr]
        }
        return acc
      }, {})
      for (const [key, value] of Object.entries(groupedByDay)) {
        if (key === year + '-' + month + '-' + day) {
          return value
        }
      }
    },


    getPostsForMonth(year: string, month: string) {
      const groupedByMonth = this.blogMetadata.reduce(function (
        acc: { [x: string]: any[] },
        curr: { [x: string]: string | number | Date | dayjs.Dayjs | null | undefined }
      ) {
        const dayjsObj = dayjs(curr['first-published-on'])
        const yearCurr = dayjsObj.format('YYYY')
        const monthCurr = dayjsObj.format('MM')
        const key = yearCurr + '-' + monthCurr
        if (acc[key]) {
          acc[key].push(curr)
        } else {
          acc[key] = [curr]
        }
        return acc
      },
      {})
      for (const [key, value] of Object.entries(groupedByMonth)) {
        if (key === year + '-' + month) {
          return value
        }
      }
    },


    getPostsForYear(year: string) {
      const groupedByYear = this.blogMetadata.reduce(function (acc: { [x: string]: any[] }, curr: { [x: string]: string | number | Date | dayjs.Dayjs | null | undefined }) {
        const dayjsObj = dayjs(curr['first-published-on'])
        const yearCurr = dayjsObj.format('YYYY')
        const key = yearCurr
        if (acc[key]) {
          acc[key].push(curr)
        } else {
          acc[key] = [curr]
        }
        return acc
      }, {})
      for (const [key, value] of Object.entries(groupedByYear)) {
        if (key === year) {
          return value
        }
      }
    },


    getPostsForPostFormat(postFormat: string) {
      const groupedByPostFormat = groupBy(
        this.blogMetadata,
        function (postmetadata) {
          return postmetadata['post-format']['url-slug']
        }
      )
      for (const [key, value] of Object.entries<any>(groupedByPostFormat)) {
        if (key === postFormat) {
          return value
        }
      }
    },


    getPostsForAuthor (author: string) {
      const groupedByAuthor = this.blogMetadata.reduce(function (
        acc: { [x: string]: any[] },
        curr: { authors: { [x: string]: string | number }[] }
      ) {
        curr.authors.forEach(function (item: { [x: string]: string | number }) {
          if (acc[item['url-slug']]) {
            acc[item['url-slug']].push(curr)
          } else {
            acc[item['url-slug']] = [curr]
          }
        })
        return acc
      },
      {})
      for (const [key, value] of Object.entries(groupedByAuthor)) {
        if (key === author) {
          return value
        }
      }
    },


    getPostsForCategory(category: string) {
      const groupedByCategories = this.blogMetadata.reduce(function (
        acc: { [x: string]: any[] },
        curr: { categories: { [x: string]: string | number }[] }
      ) {
        curr.categories.forEach(function (item: { [x: string]: string | number }) {
          if (acc[item['url-slug']]) {
            acc[item['url-slug']].push(curr)
          } else {
            acc[item['url-slug']] = [curr]
          }
        })
        return acc
      },
      {})
      for (const [key, value] of Object.entries(groupedByCategories)) {
        if (key === category) {
          return value
        }
      }
    },

    getPostsForTag(tag: string) {
      const groupedByTags = this.blogMetadata.reduce(function (acc: { [x: string]: any[] }, curr: { tags: { [x: string]: string | number }[] }) {
        curr.tags.forEach(function (item: { [x: string]: string | number }) {
          if (acc[item['url-slug']]) {
            acc[item['url-slug']].push(curr)
          } else {
            acc[item['url-slug']] = [curr]
          }
        })
        return acc
      }, {})
      for (const [key, value] of Object.entries(groupedByTags)) {
        if (key === tag) {
          return value
        }
      }
    },

    getCategories() {
      const groupedByCategories = this.blogMetadata.reduce(function (
        acc: { [x: string]: any[] },
        curr: { categories: any[] }
      ) {
        curr.categories.forEach(function (item: { [x: string]: string | number }) {
          if (acc[item['url-slug']]) {
            acc[item['url-slug']].push(curr)
          } else {
            acc[item['url-slug']] = [curr]
          }
        })
        return acc
      },
      {})
      const items = []
      for (const [key, value] of Object.entries<any>(groupedByCategories)) {
        const catName = value[0].categories.filter((category: { [x: string]: string; name: any }) => {
          if (category['url-slug'] === key) {
            return category.name
          }
          return ''
        })
        if (catName.length > 0 && catName[0].name) {
          items.push({ name: catName[0].name, slug: key, count: value.length })
        }
      }
      return items
    },

    getTags() {
      const groupedByTags = this.blogMetadata.reduce(function (acc: { [x: string]: any[] }, curr: { tags: any[] }) {
        curr.tags.forEach(function (item: { [x: string]: string | number }) {
          if (acc[item['url-slug']]) {
            acc[item['url-slug']].push(curr)
          } else {
            acc[item['url-slug']] = [curr]
          }
        })
        return acc
      }, {})
      const items = []
      for (const [key, value] of Object.entries<any>(groupedByTags)) {
        const tagName = value[0].tags.filter((tag: { [x: string]: string; name: any }) => {
          if (tag['url-slug'] === key) {
            return tag.name
          }
          return ''
        })
        if (tagName.length > 0 && tagName[0].name) {
          items.push({ name: tagName[0].name, slug: key, count: value.length })
        }
      }
      return items
    },

    getPostFormats() {
      const groupedByPostFormat = groupBy(
        this.blogMetadata,
        function (postmetadata) {
          return postmetadata['post-format']['url-slug']
        }
      )
      const items = []
      for (const [key, value] of Object.entries(groupedByPostFormat)) {
        const postFormatName = value[0]['post-format'].name
        items.push({ name: postFormatName, slug: key, count: value.length })
      }
      return items
    },

    getPostMetadata(year: string, month: string, date: string, slug: any) {
      return find(this.blogMetadata, function (post) {
        const dayjsObj = dayjs(post['first-published-on'])
        return (
          dayjsObj.format('YYYY') === year &&
          dayjsObj.format('MM') === month &&
          dayjsObj.format('DD') === date &&
          post['url-slug'] === slug
        )
      })
    },

    getPaginatedPosts(page: number, perPage: number) {
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      return this.blogMetadata.slice(startIndex, endIndex)
    },

    getTotalPages(perPage: number) {
      return Math.ceil(this.blogMetadata.length / perPage)
    },

    getPostIndex(currentPost: any) {
      return this.blogMetadata.findIndex(post => 
        post['url-slug'] === currentPost['url-slug'] &&
        post['first-published-on'] === currentPost['first-published-on']
      )
    },

    getNextPost(currentPost: any) {
      // Since posts are sorted in reverse chronological order (newest first),
      // "next" means newer, so we go to index-1
      const currentIndex = this.getPostIndex(currentPost)
      if (currentIndex > 0) {
        return this.blogMetadata[currentIndex - 1]
      }
      return null
    },

    getPreviousPost(currentPost: any) {
      // Since posts are sorted in reverse chronological order (newest first),  
      // "previous" means older, so we go to index+1
      const currentIndex = this.getPostIndex(currentPost)
      if (currentIndex >= 0 && currentIndex < this.blogMetadata.length - 1) {
        return this.blogMetadata[currentIndex + 1]
      }
      return null
    },
  },

  getters: {
    getPostFormatIcon() {
      return (postFormatType: string) => {
        if (postFormatType === 'standard') {
          return 'mdi-pin'
        } else if (postFormatType === 'aside') {
          return 'mdi-note-text' // mdi-text
        } else if (postFormatType === 'gallery') {
          return 'mdi-image-multiple'
        } else if (postFormatType === 'link') {
          return 'mdi-link-variant'
        } else if (postFormatType === 'image') {
          return 'mdi-image'
        } else if (postFormatType === 'quote') {
          return 'mdi-format-quote-open'
        } else if (postFormatType === 'status') {
          return 'mdi-message'
        } else if (postFormatType === 'video') {
          return 'mdi-video'
        } else if (postFormatType === 'audio') {
          return 'mdi-volume-high'
        } else if (postFormatType === 'chat') {
          return 'mdi-message'
        }
        return 'mdi-pin' // Default fallback
      }
    },
  },
})
