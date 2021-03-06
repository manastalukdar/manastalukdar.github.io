import axios from 'axios'
const dayjs = require('dayjs')
const find = require('lodash/find')
const groupBy = require('lodash/groupBy')

// initial state
const state = () => ({
  blogMetadata: [],
})

// getters
const getters = {
  getPostMetadata: (statePassed) => (year, month, date, slug) => {
    return find(statePassed.blogMetadata, function (post) {
      const dayjsObj = dayjs(post['first-published-on'])
      return (
        dayjsObj.format('YYYY') === year &&
        dayjsObj.format('MM') === month &&
        dayjsObj.format('DD') === date &&
        post['url-slug'] === slug
      )
    })
  },

  getPostFormats: (statePassed) => {
    const groupedByPostFormat = groupBy(
      statePassed.blogMetadata,
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

  getTags: (statePassed) => {
    const groupedByTags = statePassed.blogMetadata.reduce(function (acc, curr) {
      curr.tags.forEach(function (item) {
        if (acc[item['url-slug']]) {
          acc[item['url-slug']].push(curr)
        } else {
          acc[item['url-slug']] = [curr]
        }
      })
      return acc
    }, {})
    const items = []
    for (const [key, value] of Object.entries(groupedByTags)) {
      const tagName = value[0].tags.filter((tag) => {
        if (tag['url-slug'] === key) {
          return tag.name
        }
        return ''
      })
      items.push({ name: tagName[0].name, slug: key, count: value.length })
    }
    return items
  },

  getCategories: (statePassed) => {
    const groupedByCategories = statePassed.blogMetadata.reduce(function (
      acc,
      curr
    ) {
      curr.categories.forEach(function (item) {
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
    for (const [key, value] of Object.entries(groupedByCategories)) {
      const catName = value[0].categories.filter((category) => {
        if (category['url-slug'] === key) {
          return category.name
        }
        return ''
      })
      items.push({ name: catName[0].name, slug: key, count: value.length })
    }
    return items
  },

  getPostsForTag: (statePassed) => (tag) => {
    const groupedByTags = statePassed.blogMetadata.reduce(function (acc, curr) {
      curr.tags.forEach(function (item) {
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
  getPostsForCategory: (statePassed) => (category) => {
    const groupedByCategories = statePassed.blogMetadata.reduce(function (
      acc,
      curr
    ) {
      curr.categories.forEach(function (item) {
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
  getPostsForAuthor: (statePassed) => (author) => {
    const groupedByAuthor = statePassed.blogMetadata.reduce(function (
      acc,
      curr
    ) {
      curr.authors.forEach(function (item) {
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
  getPostsForPostFormat: (statePassed) => (postFormat) => {
    const groupedByPostFormat = groupBy(
      statePassed.blogMetadata,
      function (postmetadata) {
        return postmetadata['post-format']['url-slug']
      }
    )
    for (const [key, value] of Object.entries(groupedByPostFormat)) {
      if (key === postFormat) {
        return value
      }
    }
  },
  getPostsForYear: (statePassed) => (year) => {
    const groupedByYear = statePassed.blogMetadata.reduce(function (acc, curr) {
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
  getPostsForMonth: (statePassed) => (year, month) => {
    const groupedByMonth = statePassed.blogMetadata.reduce(function (
      acc,
      curr
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
  getPostsForDay: (statePassed) => (year, month, day) => {
    const groupedByDay = statePassed.blogMetadata.reduce(function (acc, curr) {
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
  getPostFormatIcon: (statePassed) => (postFormatType) => {
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
  },
}

// actions
const actions = {
  async getBlogMetadata({ commit }, baseURL) {
    const { data } = await axios
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
    commit('setBlogMetadata', data)
  },
}

// mutations
const mutations = {
  setBlogMetadata(state, data) {
    state.blogMetadata = data
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
