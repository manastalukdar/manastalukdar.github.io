import Vue from 'vue'
import Router from 'vue-router'
import pageHome from '@/components/pages/Home'
import pageBlogPosts from '@/components/pages/blog/posts'
import pageNotFound from '@/components/pages/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: pageHome
    },
    {
      path: '/blog/posts',
      name: 'blog-posts',
      component: pageBlogPosts
    },
    {
      path: '*',
      name: 'NotFound',
      component: pageNotFound
    }
  ]
})
