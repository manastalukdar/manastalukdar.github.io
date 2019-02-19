import Vue from 'vue'
import Router from 'vue-router'
import pageHome from '@/components/pages/Home'
import pageNotFound from '@/components/pages/NotFound'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: pageHome
    },
    {
      path: '*',
      name: 'NotFound',
      component: pageNotFound
    }
  ]
})
