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
