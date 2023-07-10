// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'
import fs from 'fs'
import { Feed, Item } from 'feed'
import { createResolver } from '@nuxt/kit'
import { config, Configuration } from 'webpack';
import * as getRoutes from './utils/getRoutes.js'

const { resolve } = createResolver(import.meta.url)

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://manastalukdar.github.io'
    : 'http://localhost:3000'


const publicDir = './public'
const feedFileName = '/blogfeed.xml'
const feedPath = publicDir + feedFileName
const siteOwner = 'Manas Talukdar'
const sitemapPath = '/sitemap.xml'
const faviconPath = '/favicon.ico'

const siteName = siteOwner
const siteDescription =
  'Manas Talukdar is a senior leader in Data Infrastructure for Enterprise AI. He has built organizations, and developed products that are part of critical infrastructure for industry verticals throughout the world.'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseUrl: baseUrl
    }
  },

  /*
   ** Headers of the page
   */
  app: {
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
          content: siteOwner + ', website, blog, resume',
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
            'https://fonts.googleapis.com/css?family=Maven+Pro|Roboto|Material+Icons',
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
      ],
    },
  },

  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css', 'material-design-icons-iconfont/dist/material-design-icons.css', 'vue-material-design-icons/styles.css'],

  build: {
    transpile: ['vuetify', "lodash-es"],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },

  hooks: {
    'vite:extend' ({ nuxt, config }) {
    },
    'vite:extendConfig': (config, { isClient, isServer }) => {
      /*config.plugins.push(
        vuetify({
          styles: { configFile: resolve('./style/settings.scss') },
        })
      )*/
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
      }
    },
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-simple-sitemap'
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

  site: {
    url: baseUrl,
  },

  sitemap: {
    urls: () => {
      if (getRoutes.properties.sitemapRoutes.length == 0) {
        getRoutes.functions.generateRoutes()
      }
      getRoutes.properties.sitemapRoutes.map((route: any) => ({
        loc: route
      }))
      getRoutes.properties.sitemapRoutes.push(baseUrl + sitemapPath)
      getRoutes.properties.sitemapRoutes.push(baseUrl + feedFileName)
      return getRoutes.properties.sitemapRoutes
    }
  }
})
