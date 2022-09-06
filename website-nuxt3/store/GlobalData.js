import { defineStore } from 'pinia'

// initial state
const state = defineStore({
  appTitle: 'Manas Talukdar',
  appOwner: 'Manas Talukdar',
  copyrightStartYear: '2018',
  copyrightEndYear: new Date().getFullYear(),
  currentPageName: '',
})

// getters
const getters = {}

// actions
const actions = {
  setCurrentPageName({ commit }, name) {
    commit('currentPageName', name)
  },
}

// mutations
const mutations = {
  setCurrentPageName(state, name) {
    state.currentPageName = name
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
