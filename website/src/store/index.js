/* import Vue from 'vue'
import Vuex from 'vuex'
import GlobalData from './modules/GlobalData'
import MainNavMenu from './modules/MainNavMenu'

import 'es6-promise/auto'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = () => {
  return new Vuex.Store({
    state: {},
    modules: {
      GlobalData,
      MainNavMenu
    },
    strict: debug
  })
}

export default store */

export const state = () => ({})

// https://github.com/nuxt/nuxt.js/issues/492
// https://github.com/nuxt/nuxt.js/issues/123
