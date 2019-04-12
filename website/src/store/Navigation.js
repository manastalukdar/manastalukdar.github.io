// initial state
const state = () => ({
  isHomePage: false,
  sidebarVisible: false,
  blog: {
    blogText: 'Blog',
    authorText: 'Author',
    yearText: 'Year',
    monthText: 'Month',
    dayText: 'Day',
    tagText: 'Tag',
    categoryText: 'Category',
    postFormatText: 'Post Format',
    blogItems: [
      {
        href: '/blog/posts/',
        target: '_blank',
        icon: 'mdi-newspaper',
        text: 'Posts'
      },
      {
        href: '/blog/categories/',
        target: '_blank',
        icon: 'mdi-domain',
        text: 'Categories'
      },
      {
        href: '/blog/tags/',
        target: '_blank',
        icon: 'mdi-tag-multiple',
        text: 'Tags'
      },
      {
        href: '/blog/archive/',
        target: '_blank',
        icon: 'mdi-archive',
        text: 'Archive'
      }
    ],
    dynamicItems: {
      category: {
        href: '/blog/category/'
      },
      tag: {
        href: '/blog/tag/'
      },
      author: {
        href: '/blog/author/'
      },
      postFormat: {
        href: '/blog/post-format/'
      },
      blogPost: {
        href: '/blog/'
      }
    }
  },
  about: {
    aboutText: 'About',
    aboutItems: [
      {
        href: '/about/resume/',
        target: '_blank',
        icon: 'mdi-file-document-box',
        text: 'Resume'
      }
    ]
  },
  legal: {
    legalText: 'Legal',
    legalPath: '/legal/'
  },
  contact: {
    contactText: 'Contact',
    subHeaderTextSocialMedia: { text: 'Social Media' },
    contactForm: {
      text: 'Form',
      icon: 'mdi-email-box',
      href: '/contact/form/'
    },
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
  },
  breadcrumbs: []
})

// getters
const getters = {}

// actions
const actions = {
  flipSidebarVisibility({ commit }) {
    commit('flipSidebarVisibility')
  },
  setSidebarVisibility({ commit }, value) {
    commit('setSidebarVisibility', value)
  },
  setBreadcrumbs({ commit }, value) {
    commit('setBreadcrumbs', value)
  },
  setHome({ commit }, value) {
    commit('setHome', value)
  }
}

// mutations
const mutations = {
  flipSidebarVisibility(state) {
    state.sidebarVisible = !state.sidebarVisible
  },
  setSidebarVisibility(state, value) {
    state.sidebarVisible = value
  },
  setBreadcrumbs(state, value) {
    state.breadcrumbs = value
  },
  setHome(state, value) {
    state.isHome = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
