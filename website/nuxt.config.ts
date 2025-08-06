// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'
import fs from 'fs'
import { Feed, Item } from 'feed'
import { createResolver } from '@nuxt/kit'
import { config, Configuration } from 'webpack';
import * as getRoutes from './app/utils/getRoutes.js'

const { resolve } = createResolver(import.meta.url)

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://manastalukdar.github.io'
    : 'http://localhost:3000'

const blogPostCount = getRoutes.functions.getBlogPostCount()

const publicDir = './public'
const feedFileName = '/blogfeed.xml'
const feedPath = publicDir + feedFileName
const siteOwner = 'Manas Talukdar'
const sitemapPath = '/sitemap.xml'
const faviconPath = '/favicon.ico'

const siteName = siteOwner
const siteDescription =
  'Manas Talukdar builds AI and Data products used globally in critical industrial infrastructure and leads organizations in Enterprise AI.'

export default defineNuxtConfig({

  ssr: true,

  runtimeConfig: {
    public: {
      baseUrl: baseUrl,
      blogPostCount: blogPostCount
    }
  },

  /*
   ** Headers of the page
   */
  app: {
    //layoutTransition: { name: 'layout', mode: 'out-in' },

    head: {
      // title: pkg.name,
      meta: [
        {
          charset: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: siteOwner + ', website, blog, resume, data infrastructure, enterprise ai',
        },
        {
          hid: 'description',
          name: 'description',
          content: siteDescription,
        },
        {
          name: 'google-site-verification',
          content: 'fkepJA8wLesbvVtlowW987jJEqJ6-hQp3OA5d4Rw9x0',
        },
        {
          name: 'msvalidate.01',
          content: '83A10E52E92EB2D251C39288B8437120',
        },
        {
          hid: 'author',
          name: 'author',
          content: siteOwner,
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: siteOwner,
        },
        {
          hid: 'og-site_name',
          name: 'og:site_name',
          property: 'og:site_name',
          content: siteName,
        },
        {
          hid: 'og-image',
          name: 'og:image',
          property: 'og:image',
          content: baseUrl + '/images/android-chrome-192x192.png',
        },
        {
          hid: 'og-type',
          name: 'og:type',
          property: 'og:type',
          content: 'website',
        },
        {
          hid: 'og-title',
          name: 'og:title',
          property: 'og:title',
          content: siteOwner,
        },
        {
          hid: 'og-url',
          name: 'og:url',
          property: 'og:url',
          content: baseUrl,
        },
        {
          hid: 'og-description',
          name: 'og:description',
          property: 'og:description',
          content: siteDescription,
        },
        // Modern meta tags for improved SEO
        {
          name: 'robots',
          content: 'index,follow',
        },
        {
          name: 'theme-color',
          content: '#263238',
        },
        // Twitter Card meta tags
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: siteOwner,
        },
        {
          name: 'twitter:description',
          content: siteDescription,
        },
        {
          name: 'twitter:image',
          content: baseUrl + '/images/android-chrome-512x512.png',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: faviconPath,
        },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css?family=Maven+Pro|Material+Icons',
        },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: siteOwner + ' - blog',
          href: baseUrl + feedFileName,
        },
        // { rel: 'manifest', href: 'manifest.json' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/images/favicon-16x16.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/images/favicon-32x32.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/images/apple-touch-icon.png',
        },
        {
          rel: 'preload',
          href: '/styles/atom-one-dark.css',
          as: 'style',
        },
        // Preload critical fonts for performance
        {
          rel: 'preload',
          href: 'https://fonts.gstatic.com/s/mavenpro/v32/7Auup_AqnyWWAxW2Wk3swUz56MS91Eww8SX25nCpozp5GvU.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: 'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        // Preload critical CSS
        {
          rel: 'preload',
          href: 'https://fonts.googleapis.com/css?family=Maven+Pro|Material+Icons',
          as: 'style',
        },
      ],
    },
  },

  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    'material-design-icons-iconfont/dist/material-design-icons.css',
    'vue-material-design-icons/styles.css',
    //'~/styles/print-blog-post.css'
  ],

  build: {
    transpile: ['vuetify', "lodash-es"],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    css    : {
      preprocessorOptions: {
        scss: {
          // Removed additionalData import since Vuetify plugin handles it with @use
        },
      },
    },
  },

  sourcemap: {
    server: false,
    client: false,
  },

  hooks: {
    'vite:extend' ({ nuxt, config }) {
    },
    'vite:extendConfig': (config, { isClient, isServer }) => {
      config.plugins?.push(
        vuetify({
          autoImport: true,
          styles: { configFile: resolve('./app/style/settings.scss') },
        })
      )
    },
    'webpack:config' (configs: Configuration[]) {},

    build: {
      before: () => {
        // feed generation
        getRoutes.functions.setBaseUrl(baseUrl)
        getRoutes.functions.generateRoutes()
        const feed = new Feed({
          id: baseUrl,
          title: siteOwner + ' - blog',
          link: baseUrl + feedFileName,
          description: 'Syndication feed for blog.',
          copyright:
            'All rights reserved ' + new Date().getFullYear() + ' ' + siteOwner,
          author: {
            name: siteOwner,
            link: baseUrl,
          },
        })
        getRoutes.properties.feedItems.forEach((item: any) => {
          feed.addItem(item)
        })
        getRoutes.properties.categories.forEach((category: any) => {
          feed.addCategory(category.name)
        })
        feed.addContributor({
          name: siteOwner,
          link: baseUrl,
        })
        fs.writeFile(feedPath, feed.rss2(), (err) => {
          if (err)
            throw err
          else {
            console.log(feedPath + " written successfully.")
          }
        })

        // Generate search index
        try {
          console.log('Generating search index...')
          const { spawn } = require('child_process')

          const searchIndexProcess = spawn('npm', ['run', 'generate-search-index'], {
            stdio: ['ignore', 'pipe', 'pipe'],
            detached: false
          })

          searchIndexProcess.stdout.on('data', (_data: any) => {
            // Ignore stdout to prevent EPIPE errors
          })

          searchIndexProcess.stderr.on('data', (_data: any) => {
            // Ignore stderr to prevent EPIPE errors
          })

          searchIndexProcess.on('close', (code: number | null) => {
            if (code === 0) {
              console.log('Search index generated successfully')
            } else {
              console.warn(`Search index generation exited with code ${code}`)
            }
          })

          searchIndexProcess.on('error', (error: Error) => {
            console.error('Failed to start search index generation:', error.message)
          })

        } catch (error) {
          console.error('Failed to generate search index:', error)
        }
      }
    },
  },

  modules: [
    //'./modules/helper',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    'nuxt-gtag',
    '@vite-pwa/nuxt',
  ],

  plugins: [
  ],

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
      ]
    }
  },

  gtag: {
    id: 'G-17M4RW7HF7',
    config: {
      send_page_view: true, // might be necessary to avoid duplicated page track on page reload
    },
  },

  site: {
    url: baseUrl,
  },

  routeRules: {
    '/**': { swr: 60  }, // 👈🏻 TTL in seconds
  },

  sitemap: {
    urls: () => {
      if (getRoutes.properties.sitemapRoutes.length == 0) {
        getRoutes.functions.generateRoutes()
      }
      getRoutes.properties.sitemapRoutes.push(baseUrl + sitemapPath)
      getRoutes.properties.sitemapRoutes.push(baseUrl + feedFileName)
      return getRoutes.properties.sitemapRoutes.map((route: any) => ({
        loc: route
      }))
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
      globIgnores: ['**/404**', '**/404.html'],
      navigateFallbackDenylist: [/^\/resume/],
    },
    manifest: {
      short_name: 'MTalukdar',
      name: 'Manas Talukdar',
      background_color: '#303030',
      theme_color: '#263238',
      display: 'standalone',
      lang: 'en',
      icons: [
        {
          src: '/images/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/images/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },

/*   render: {
    static: {
      ttl: 1000 * 60 * 60 * 24 * 7,
    },
  }, */

  compatibilityDate: '2024-07-10',
})
