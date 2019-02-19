import Vue from 'vue'
import Vuex from 'vuex'
import GlobalData from './modules/GlobalData'
import MainNavMenu from './modules/MainNavMenu'

import 'es6-promise/auto'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    GlobalData,
    MainNavMenu
  },
  strict: debug
})
