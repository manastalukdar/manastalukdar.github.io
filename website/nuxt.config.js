import { Feed } from 'feed'
import colors from 'vuetify/lib/util/colors'
const fs = require('fs')
const getRoutes = require('./utils/getRoutes.js')
// const ampify = require('./plugins/ampify')

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://manastalukdar.github.io'
    : 'http://localhost:3000'

const staticDir = './static'
const feedFileName = '/blogfeed.xml'
const feedPath = staticDir + feedFileName
const siteOwner = 'Manas Talukdar'
const sitemapPath = '/sitemap.xml'
const faviconPath = '/favicon.ico'

const siteName = siteOwner
const siteDescription =
  'Manas Talukdar is a software engineering manager in cloud computing and distributed systems, experienced in building and running high performing teams.'

export default {
  mode: 'universal',

  helper: {
    aboutBlurbText: ''
  },

  // https://pwa.nuxtjs.org/modules/meta.html
  meta: {
    // ...
  },

  // https://pwa.nuxtjs.org/modules/manifest.html
  manifest: {
    short_name: 'MTalukdar',
    name: 'Manas Talukdar',
    start_url: '/',
    background_color: '#303030',
    theme_color: '#263238',
    display: 'standalone',
    lang: 'en'
  },

  // https://pwa.nuxtjs.org/modules/icon.html
  icon: {
    iconSrc: staticDir + '/images/android-chrome-512x512.png',
    targetDir: staticDir + '/generatedIcons'
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
        content: siteOwner + ', website, blog, resume'
      },
      {
        hid: 'description',
        name: 'description',
        content: siteDescription
      },
      {
        name: 'google-site-verification',
        content: 'fkepJA8wLesbvVtlowW987jJEqJ6-hQp3OA5d4Rw9x0'
      },
      {
        name: 'msvalidate.01',
        content: '83A10E52E92EB2D251C39288B8437120'
      },
      {
        hid: 'author',
        name: 'author',
        content: siteOwner
      },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: siteOwner
      },
      {
        hid: 'og-site_name',
        name: 'og:site_name',
        property: 'og:site_name',
        content: siteName
      },
      {
        hid: 'og-image',
        name: 'og:image',
        property: 'og:image',
        content: baseUrl + faviconPath
      },
      {
        hid: 'og-type',
        name: 'og:type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'og-title',
        name: 'og:title',
        property: 'og:title',
        content: siteOwner
      },
      {
        hid: 'og-url',
        name: 'og:url',
        property: 'og:url',
        content: baseUrl
      },
      {
        hid: 'og-description',
        name: 'og:description',
        property: 'og:description',
        content: siteDescription
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: faviconPath },
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
      },
      // { rel: 'manifest', href: 'manifest.json' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/images/favicon-16x16.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/images/favicon-32x32.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/images/apple-touch-icon.png'
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
    '~/assets/style/print-blog-post.css',
    '~/assets/style/app.scss',
    '@fortawesome/fontawesome-svg-core/styles.css',
    { src: '~/node_modules/highlight.js/styles/atom-one-light.css', lang: 'css' }
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
    '@nuxtjs/redirect-module',
    '@nuxtjs/sitemap',
    '@nuxtjs/vuetify'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/fontawesome.js',
    '@/plugins/materialdesignicons.js',
    '@plugins/vueAsyncComputed.js',
    '~/plugins/vuetify-theme-cache.js',
    '~/plugins/disqus',
    {
      src: '~/plugins/socialsharing',
      ssr: false
    }
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
    loaders: {
      stylus: {}
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

  /*
  dir: {
    assets: './src/assets',
    layouts: './src/components/layouts',
    middleware: './src/middleware',
    pages: './src/components/pages',
    static: staticDir,
    store: './src/store'
  },
  */

  router: {
    // https://nuxtjs.org/api/configuration-router#scrollbehavior
    scrollBehavior: function(to, from, savedPosition) {
      return { x: 0, y: 0 }
    },
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  },

  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: faviconPath
    }
  ],

  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/style/variables.scss'],
    icons: {
      iconfont: 'mdi'
    },
    theme: {
      dark: true,
      themes: {
        dark: {
          background: colors.blueGrey.darken2, // #141e24
          headerAndFooterColor: colors.blue.darken3,
          cardColor: colors.blueGrey.darken4,
          primary: colors.teal.lighten3 // blue.darken2
          /* accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3 */
        },
        light: {
          headerAndFooterColor: colors.blue.lighten4,
          cardColor: colors.shades.white,
        }
      },
      options: {
        customProperties: true,
        minifyTheme: function (css) {
          return process.env.NODE_ENV === 'production'
            ? css.replace(/[\s|\r\n|\r|\n]/g, '')
            : css
        }
      }
    }
  },

  googleAnalytics: {
    id: 'UA-118888630-1',
    dev: false
  },

  sitemap: {
    path: '.' + sitemapPath,
    hostname: baseUrl,
    cacheTime: 1000 * 60 * 15, // 15 mins
    gzip: true,
    filter({ routes }) {
      return routes.map(route => {
        if (!route.url.endsWith('.xml') && !route.url.endsWith('/')) {
          route.url = `${route.url}/`
        }
        return route
      })
    },
    routes() {
      getRoutes.functions.generateRoutes()
      getRoutes.properties.sitemapRoutes.push(baseUrl + sitemapPath)
      getRoutes.properties.sitemapRoutes.push(baseUrl + feedFileName)
      return getRoutes.properties.sitemapRoutes
    }
  },

  redirect: [
    {
      // https://stackoverflow.com/questions/54346345/nuxt-js-force-trailing-slash-at-the-end-of-all-urls
      from: '^.*(?<!/)$', // ^.*(?<!\.(png|jpg))$    ^.*(?<!/)$
      to: (from, req) => req.url + '/'
    }
  ],

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

  /*
   ** Hooks configuration
   * https://toor.co/blog/amp-pages-using-nuxt-js/
   *
  hooks: {
    // This hook is called before saving the html to flat file
    'generate:page': page => {
      if (/^/gi.test(page.route)) {
        page.html = ampify(page.html)
      }
    },
    // This hook is called before serving the html to the browser
    'render:route': (url, page, { req, res }) => {
      if (/^/gi.test(url)) {
        page.html = ampify(page.html)
      }
    }
  }
  */
}
