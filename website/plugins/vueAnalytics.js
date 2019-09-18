import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-118888630-1',
  debug: {
    enabled: false,
    sendHitTask: process.env.NODE_ENV === 'production'
  }
})
