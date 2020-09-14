import {
  Feed
} from 'feed'
const fs = require('fs')
import * as getRoutes from './utils/getRoutes.js'
// const ampify = require('./plugins/ampify')

const baseUrl =
  process.env.NODE_ENV === 'production' ?
  'https://manastalukdar.github.io' :
  'http://localhost:3000'

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
  target: 'static',
  telemetry: false,

  helper: {
    aboutBlurbText: ''
  },

  // https://pwa.nuxtjs.org/modules/meta.html
  meta: {
    // ...
  },

  pwa: {
    icon: {
      source: staticDir + '/images/android-chrome-512x512.png',
      targetDir: staticDir + '/generatedIcons'
    }
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

  /*
   ** Headers of the page
   */
  head: {
    // title: pkg.name,
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
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
        content: baseUrl + '/images/android-chrome-192x192.png'
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
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: faviconPath
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Maven+Pro|Roboto|Material+Icons'
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
      },
      {
        rel: 'preload',
        href: '/styles/atom-one-dark.css',
        as: 'style'
      }
    ]
  },

  publicRuntimeConfig: {
    baseURL: baseUrl
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/style/print-blog-post.css',
    '~/assets/style/app.scss'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    './modules/helper',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/redirect-module',
    '@nuxtjs/sitemap'
  ],

  buildModules: [
    '@nuxtjs/vuetify'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/materialdesignicons.js',
    '@plugins/vueAsyncComputed.js',
    '~/plugins/vuetify-theme-cache.js',
    '~/plugins/disqus',
    '~/plugins/vueAnalytics.js',
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
        copyright: 'All rights reserved ' + new Date().getFullYear() + ' ' + siteOwner,
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

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  },

  link: [{
    rel: 'icon',
    type: 'image/x-icon',
    href: faviconPath
  }],

  vuetify: {
    treeShake: true,
    optionsPath: './vuetify.options.js',
    customVariables: ['~/assets/style/variables.scss'],
    icons: {
      iconfont: 'mdi'
    }
  },

  sitemap: {
    path: '.' + sitemapPath,
    hostname: baseUrl,
    cacheTime: 1000 * 60 * 15, // 15 mins
    gzip: true,
    filter({
      routes
    }) {
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

  redirect: [{
    // https://stackoverflow.com/questions/54346345/nuxt-js-force-trailing-slash-at-the-end-of-all-urls
    from: '^.*(?<!/)$', // ^.*(?<!\.(png|jpg))$    ^.*(?<!/)$
    to: (from, req) => req.url + '/'
  }],

  render: {
    static: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  },

  generate: {
    crawler: false,
    dir: 'dist',
    routes: function () {
      getRoutes.functions.generateRoutes()
      /*fs.writeFile("./output.logfile", JSON.stringify(getRoutes.properties.nuxtGenerateRoutes), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
      });*/
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
