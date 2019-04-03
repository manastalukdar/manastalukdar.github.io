const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const getRoutes = require('./utils/getRoutes.js')

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://manastalukdar.github.io'
    : 'http://localhost:3000'

const feedPath = '/blogfeed.xml'

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    // title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'keywords', content: 'Manas Talukdar, resume, blog' },
      {
        hid: 'description',
        name: 'description',
        content: "Manas Talukdar's personal website."
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
        title: 'Manas Talukdar - blog',
        href: baseUrl + feedPath
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
    '@/plugins/materialdesignicons.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/google-analytics',
    '@nuxtjs/feed',
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
    }
  },

  dir: {
    assets: './assets',
    layouts: './src/components/layouts',
    middleware: './src/middleware',
    pages: './src/components/pages',
    static: './src/static',
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
    path: '/sitemap.xml',
    hostname: baseUrl,
    cacheTime: 1000 * 60 * 15, // 15 mins
    generate: true,
    gzip: true,
    routes() {
      getRoutes.functions.generateRoutes()
      return getRoutes.properties.sitemapRoutes
    }
  },

  render: {
    static: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  },

  feed: [
    // A default feed configuration object
    {
      path: feedPath, // The route to your feed.
      create(feed) {
        feed.options = {
          title: 'Manas Talukdar - blog',
          link: baseUrl + feedPath,
          description: 'Syndication feed for blog.',
          copyright:
            'All rights reserved ' +
            new Date().getFullYear() +
            ' Manas Talukdar'
        }
        getRoutes.functions.setBaseUrl(baseUrl)
        getRoutes.functions.generateRoutes()
        getRoutes.properties.feedItems.forEach(item => {
          feed.addItem(item)
        })
        getRoutes.properties.categories.forEach(category => {
          feed.addCategory(category)
        })
        feed.addContributor({
          name: 'Manas Talukdar',
          link: 'https://manastalukdar.github.io'
        })
      },
      cacheTime: 1000 * 60 * 15, // How long should the feed be cached
      type: 'rss2', // Can be: rss2, atom1, json1
      data: ['Some additional data'] // Will be passed as 2nd argument to `create` function
    }
  ],

  generate: {
    dir: 'dist',
    routes: function() {
      getRoutes.functions.generateRoutes()
      return getRoutes.properties.nuxtGenerateRoutes
    }
  }
}
