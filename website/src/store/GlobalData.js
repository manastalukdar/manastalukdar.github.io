// initial state
const state = () => ({
  appTitle: 'Manas Talukdar',
  appOwner: 'Manas Talukdar',
  copyrightStartYear: '2018',
  copyrightEndYear: new Date().getFullYear(),
  currentPageName: '',
  darkMode: true,
  cardColorDark: 'cardColorDark',
  headerAndFooterColorDark: 'headerAndFooterColorDark',
  headerAndFooterColorLight: 'headerAndFooterColorLight'
})

// getters
const getters = {
  getCardColor: state => {
    if (state.darkMode) {
      return state.cardColorDark
    }
  },
  getHeaderAndFooterColor: state => {
    if (state.darkMode) {
      return state.headerAndFooterColorDark
    } else {
      return state.headerAndFooterColorLight
    }
  }
}

// actions
const actions = {
  setCurrentPageName({ commit }, name) {
    commit('currentPageName', name)
  },
  flipThemeMode({ commit }) {
    commit('flipThemeMode')
  }
}

// mutations
const mutations = {
  setCurrentPageName(state, name) {
    state.currentPageName = name
  },
  flipThemeMode(state) {
    state.darkMode = !state.darkMode
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
