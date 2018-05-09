// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fontawesome from '@fortawesome/fontawesome'
import brands from '@fortawesome/fontawesome-free-brands'

import { faSpinner } from '@fortawesome/fontawesome-free-solid'

import VueAnalytics from 'vue-analytics'

fontawesome.library.add(brands, faSpinner)

Vue.config.productionTip = false
const isProd = process.env.NODE_ENV === 'production'

Vue.use(VueAnalytics, {
  id: 'UA-118888630-1',
  router,
  debug: {
    enabled: !isProd,
    sendHitTask: isProd
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // render: h => h(App)
  components: { App },
  template: '<App/>'
}) // .$mount('#app')
