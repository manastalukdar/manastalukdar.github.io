import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-118888630-1',
  debug: {
    // https://github.com/nuxt-community/analytics-module/issues/57
    sendHitTask: true // process.env.NODE_ENV === 'production'
  }
})
