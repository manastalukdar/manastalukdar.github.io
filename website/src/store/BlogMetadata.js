import axios from 'axios'
import _ from 'lodash'

// initial state
const state = () => ({
  blogMetadata: []
})

// getters
const getters = {
  getPostMetadata: state => (year, month, date, slug) => {
    return _.find(state.blogMetadata, function(post) {
      return (
        post['first-published-on'] === year + '-' + month + '-' + date &&
        post['url-slug'] === slug
      )
    })
  },
  getPostsForTag: state => tag => {
    const groupedByTags = state.blogMetadata.reduce(function(acc, curr) {
      curr.tags.forEach(function(item) {
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
  getPostsForCategory: state => category => {
    const groupedByCategories = state.blogMetadata.reduce(function(acc, curr) {
      curr.categories.forEach(function(item) {
        if (acc[item['url-slug']]) {
          acc[item['url-slug']].push(curr)
        } else {
          acc[item['url-slug']] = [curr]
        }
      })
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByCategories)) {
      if (key === category) {
        return value
      }
    }
  },
  getPostsForAuthor: state => author => {
    const groupedByAuthor = state.blogMetadata.reduce(function(acc, curr) {
      curr.authors.forEach(function(item) {
        if (acc[item['url-slug']]) {
          acc[item['url-slug']].push(curr)
        } else {
          acc[item['url-slug']] = [curr]
        }
      })
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByAuthor)) {
      if (key === author) {
        return value
      }
    }
  },
  getPostsForPostFormat: state => postFormat => {
    const groupedByPostFormat = _.groupBy(state.blogMetadata, function(
      postmetadata
    ) {
      return postmetadata['post-format']['url-slug']
    })
    for (const [key, value] of Object.entries(groupedByPostFormat)) {
      if (key === postFormat) {
        return value
      }
    }
  },
  getPostsForYear: state => year => {
    const groupedByYear = state.blogMetadata.reduce(function(acc, curr) {
      const yearCurr = curr['first-published-on'].split('-')[0]
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
  getPostsForMonth: state => (year, month) => {
    const groupedByMonth = state.blogMetadata.reduce(function(acc, curr) {
      const yearCurr = curr['first-published-on'].split('-')[0]
      const monthCurr = curr['first-published-on'].split('-')[1]
      const key = yearCurr + '-' + monthCurr
      if (acc[key]) {
        acc[key].push(curr)
      } else {
        acc[key] = [curr]
      }
      return acc
    }, {})
    for (const [key, value] of Object.entries(groupedByMonth)) {
      if (key === year + '-' + month) {
        return value
      }
    }
  },
  getPostsForDay: state => (year, month, day) => {
    const groupedByDay = state.blogMetadata.reduce(function(acc, curr) {
      const yearCurr = curr['first-published-on'].split('-')[0]
      const monthCurr = curr['first-published-on'].split('-')[1]
      const dayCurr = curr['first-published-on'].split('-')[2]
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
  }
}

// actions
const actions = {
  async getBlogMetadata({ commit }, baseURL) {
    const { data } = await axios
      .get(baseURL + '/blogdata/metadata/blog_metadata.json')
      .catch(function(error) {
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
  }
}

// mutations
const mutations = {
  setBlogMetadata(state, data) {
    state.blogMetadata = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
