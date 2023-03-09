import axios from 'axios'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { find, groupBy } from 'lodash'

// initial state
const initialState = () => ({
  blogMetadata: <any>[],
})

export const useBlogMetadataStore = defineStore('BlogMetadata', {
  state: initialState,
  actions: {
    async setupBlogMetadata(baseURL: string) {
      const { data }: any = await axios
        .get(baseURL + '/blogdata/metadata/blog_metadata.json')
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // eslint-disable-next-line no-console
            console.log(error.response.data)
            // eslint-disable-next-line no-console
            console.log(error.response.status)
            // eslint-disable-next-line no-console
            console.log(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            // eslint-disable-next-line no-console
            console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            // eslint-disable-next-line no-console
            console.log('Error', error.message)
          }
          // eslint-disable-next-line no-console
          console.log(error.config)
        })
      this.blogMetadata = data
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
        items.push({ name: catName[0].name, slug: key, count: value.length })
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
        items.push({ name: tagName[0].name, slug: key, count: value.length })
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
          return 'chat'
        }
      }
    },
  },
})
