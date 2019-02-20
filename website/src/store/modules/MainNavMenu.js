// initial state
const state = {
    sidebarVisible: false,
    blog: {
      blogText: "Blog",
      blogItems: [
        {
          href: '/blog/posts',
          target: '_blank',
          icon: 'mdi-newspaper',
          text: 'Posts'
        },
        {
          href: '/blog/categories',
          target: '_blank',
          icon: 'mdi-domain',
          text: 'Categories'
        },
        {
          href: '/blog/tags',
          target: '_blank',
          icon: 'mdi-tag-multiple',
          text: 'Tags'
        },
        {
          href: '/blog/archive',
          target: '_blank',
          icon: 'mdi-archive',
          text: 'Archive'
        }
      ]
    },
    about: {
      aboutText: "About",
      aboutPath: "/about/"
    },
    legal: {
      legalText: "Legal",
      legalPath: "/legal/"
    },
    contact: {
      contactText: "Contact",
      subHeaderTextSocialMedia: { text: "Social Media" },
      contactForm: { text: "Form", icon: 'mdi-email-box', href: '/contact/' },
      socialMediaItems: [
        {
          href: 'https://www.linkedin.com/in/manastalukdar/',
          target: '_blank',
          icon: 'mdi-linkedin',
          text: 'LinkedIn'
        },
        {
          href: 'https://github.com/manastalukdar',
          target: '_blank',
          icon: 'mdi-github-circle',
          text: 'GitHub'
        },
        {
          href: 'https://www.twitter.com/manastalukdar/',
          target: '_blank',
          icon: 'mdi-twitter',
          text: 'Twitter'
        }
      ]
    }
}

// getters
const getters = {}

// actions
const actions = {
  flipSidebarVisibility ({ commit }) {
    commit('flipSidebarVisibility')
  },
  setSidebarVisibility ({ commit }, value) {
    commit('setSidebarVisibility', value)
  }
}

// mutations
const mutations = {
  flipSidebarVisibility (state) {
    state.sidebarVisible = !state.sidebarVisible
  },
  setSidebarVisibility (state, value) {
    state.sidebarVisible = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
