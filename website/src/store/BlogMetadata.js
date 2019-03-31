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
        post['last-updated-on'] === year + '-' + month + '-' + date &&
        post['url-slug'] === slug
      )
    })
  }
}

// actions
const actions = {
  async getBlogMetadata({ commit }, baseURL) {
    const { data } = await axios.get(baseURL + '/blogdata/posts_list.json')
    commit('setBlogMetadata', data)
  }
}

// mutations
const mutations = {
  setBlogMetadata(state, data) {
    state.blogMetadata = data
  }
}

const initBlogMetadata = function() {
  const baseURL =
    process.env.NODE_ENV === 'production'
      ? 'https://manastalukdar.github.io'
      : 'http://localhost:3000'

  this.actions.blogMetadata(baseURL)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  initBlogMetadata
}
