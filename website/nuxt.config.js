import { Feed } from 'feed'
const fs = require('fs')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const getRoutes = require('./utils/getRoutes.js')

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://manastalukdar.github.io'
    : 'http://localhost:3000'

const staticDir = './src/static'
const feedFileName = '/blogfeed.xml'
const feedPath = staticDir + feedFileName
const siteOwner = 'Manas Talukdar'
const sitemapPath = '/sitemap.xml'

module.exports = {
  mode: 'universal',

  helper: {
    aboutBlurbText: ''
  },

  /*
  ** Headers of the page
  */
  head: {
    // title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'keywords',
        name: 'keywords',
        content: siteOwner + ', blog, resume'
      },
      {
        hid: 'description',
        name: 'description',
        content: siteOwner + ' - personal website, blog, resume. '
      },
      {
        name: 'google-site-verification',
        content: 'fkepJA8wLesbvVtlowW987jJEqJ6-hQp3OA5d4Rw9x0'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: siteOwner + ' - blog',
        href: baseUrl + feedFileName
      }
    ]
  },

  env: {
    baseURL: baseUrl
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/fontawesome.js',
    '@/plugins/materialdesignicons.js',
    '@plugins/vueAsyncComputed.js',
    '~/plugins/disqus'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    './modules/helper',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/google-analytics',
    '@nuxtjs/sitemap'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    dir: 'dist',
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.module.rules.push({
        test: /\.md$/,
        loader: ['raw-loader']
      })

      // feed generation
      getRoutes.functions.setBaseUrl(baseUrl)
      getRoutes.functions.generateRoutes()
      const feed = new Feed({
        title: siteOwner + ' - blog',
        link: baseUrl + feedFileName,
        description: 'Syndication feed for blog.',
        copyright:
          'All rights reserved ' + new Date().getFullYear() + ' ' + siteOwner,
        author: {
          name: siteOwner,
          link: baseUrl
        }
      })
      getRoutes.properties.feedItems.forEach(item => {
        feed.addItem(item)
      })
      getRoutes.properties.categories.forEach(category => {
        feed.addCategory(category)
      })
      feed.addContributor({
        name: siteOwner,
        link: baseUrl
      })
      fs.writeFile(feedPath, feed.rss2(), err => {
        if (err) throw err
      })
    }
  },

  dir: {
    assets: './assets',
    layouts: './src/components/layouts',
    middleware: './src/middleware',
    pages: './src/components/pages',
    static: staticDir,
    store: './src/store'
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'src/components/pages/404.vue')
      })
    }
  },

  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }
  ],

  googleAnalytics: {
    id: 'UA-118888630-1',
    dev: false
  },

  sitemap: {
    path: sitemapPath,
    hostname: baseUrl,
    cacheTime: 1000 * 60 * 15, // 15 mins
    generate: true,
    gzip: true,
    routes() {
      getRoutes.functions.generateRoutes()
      getRoutes.properties.sitemapRoutes.push(baseUrl + sitemapPath)
      getRoutes.properties.sitemapRoutes.push(baseUrl + feedFileName)
      return getRoutes.properties.sitemapRoutes
    }
  },

  render: {
    static: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  },

  generate: {
    dir: 'dist',
    routes: function() {
      getRoutes.functions.generateRoutes()
      return getRoutes.properties.nuxtGenerateRoutes
    }
  }
}
