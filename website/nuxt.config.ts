// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'
import fs from 'fs'
import { Feed, Item } from 'feed'
import { createResolver } from '@nuxt/kit'
import { config, Configuration } from 'webpack';
import * as getRoutes from './app/utils/getRoutes.js'
import { generateContentHash } from './app/utils/contentHash.server'

const { resolve } = createResolver(import.meta.url)

// Generate content-based version for PWA
const contentVersion = generateContentHash()

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
          content: siteOwner + ', enterprise ai, data infrastructure, ai products, machine learning, data engineering, artificial intelligence, enterprise solutions, industrial ai, data science, technology leadership, website, blog, resume',
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
        // Global licensing meta tags for AI training
        {
          name: 'license',
          content: 'CC BY-NC-ND 4.0',
        },
        {
          name: 'ai-training',
          content: 'non-commercial-only',
        },
        {
          name: 'content-policy',
          content: '/legal#content-usage',
        },
        {
          name: 'update-frequency',
          content: 'weekly',
        },
        {
          name: 'content-language',
          content: 'en-US',
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
          href: '/fonts/fonts.css',
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
        // Preload critical self-hosted fonts for performance
        {
          rel: 'preload',
          href: '/fonts/maven-pro-v32-latin-regular.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        // Preload font CSS for faster FOIT prevention
        {
          rel: 'preload',
          href: '/fonts/fonts.css',
          as: 'style',
        },
        // Global license link for machine-readable declarations
        {
          rel: 'license',
          href: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
        },
      ],
    },
  },

  css: [
    'vuetify/lib/styles/main.sass',
    // Restored MDI icons - required for 166 icon references throughout the site
    '@mdi/font/css/materialdesignicons.min.css', // ~400KB critical for UI functionality
    // 'material-design-icons-iconfont/dist/material-design-icons.css', // Still removed - redundant with MDI
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
    css: {
      preprocessorOptions: {
        scss: {
          // Removed additionalData import since Vuetify plugin handles it with @use
        },
      },
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress eval warnings from ONNXRUNTIME-web (third-party ML library)
          if (warning.code === 'EVAL' && warning.id?.includes('onnxruntime-web')) {
            return
          }
          // Pass through all other warnings
          warn(warning)
        },
        output: {
          manualChunks: {
            // Isolate ML models in separate chunk for better caching
            'ml-models': ['@xenova/transformers']
          }
        }
      }
    }
  },

  sourcemap: {
    server: false,
    client: false,
  },

  hooks: {
    async 'prerender:routes'(ctx) {
      // Generate dynamic blog routes using existing logic
      getRoutes.functions.setBaseUrl(baseUrl)
      getRoutes.functions.generateRoutes()
      
      // Add all dynamic routes from the existing system
      getRoutes.properties.sitemapRoutes.forEach((route: string) => {
        ctx.routes.add(route)
      })
      
      console.log(`Added ${getRoutes.properties.sitemapRoutes.length} dynamic routes via prerender:routes hook`)
    },
    'vite:extend' ({ nuxt, config }) {
    },
    'vite:extendConfig': (config, { isClient, isServer }) => {
      config.plugins?.push(
        vuetify({
          autoImport: true,
          treeShake: true, // Enable component tree-shaking for smaller bundles
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

        // Sitemap generation is now handled by @nuxtjs/sitemap module
        console.log('Sitemap generation handled by @nuxtjs/sitemap module')
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
    '@nuxt/image',
  ],

  plugins: [
    // '~/plugins/error-handler.server.ts' // Temporarily disabled to avoid MaxListenersExceeded warning
  ],

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/', // Starting point for crawling - other routes auto-discovered or added via prerender:routes hook
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
  
  sitemap: {
    exclude: [
      '/404/**',
      '/_payload.json',
      '/**/_payload.json'
    ],
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString()
    }
  },

  routeRules: {
    // Homepage - prerender with SWR for updates
    '/': { prerender: true, swr: 60 },
    
    // Static pages - prerender for best performance
    '/about/**': { prerender: true },
    '/contact/**': { prerender: true },
    '/legal/**': { prerender: true },
    '/search/**': { prerender: true },
    '/bookmarks/**': { prerender: true },
    
    // Blog pages - prerender with SWR for content updates
    '/blog/**': { prerender: true, swr: 120 }, // 2 min cache for blog content
    
    // API routes - ensure they work properly
    '/api/**': { cors: true },
    
    // Fallback for other routes
    '/**': { swr: 60 }, // 1 min cache for other routes
  },


  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
      globIgnores: ['**/404**', '**/404.html'],
      // Disable navigation route caching to allow 404.html SPA routing fallback
      navigateFallback: null,
      navigateFallbackDenylist: [/.*/], // Deny all navigation fallbacks
      // Force service worker update for existing users
      cleanupOutdatedCaches: true,
      // Add skipWaiting to immediately activate new service worker
      skipWaiting: true,
      // Runtime caching strategies for different content types
      runtimeCaching: [
        {
          urlPattern: /\/blogdata\/.*\.json$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'blog-metadata',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 300 // 5 minutes
            }
          }
        },
        {
          urlPattern: /\.md(\?raw)?$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'markdown-content',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 3600 // 1 hour
            }
          }
        },
        {
          urlPattern: /\/content-testimonials\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'testimonials-content',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 1800 // 30 minutes
            }
          }
        }
      ]
    },
    manifest: {
      short_name: 'MTalukdar',
      name: 'Manas Talukdar',
      version: `2.1.${contentVersion}`, // Content-based versioning for automatic cache invalidation
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

  image: {
    // Image optimization configuration
    quality: 80,
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    // Use IPX provider for better compatibility
    provider: 'ipx',
    densities: [1, 2],
    presets: {
      blog: {
        modifiers: {
          format: 'webp',
          quality: 80,
          sizes: 'sm:640px md:768px lg:1024px',
        }
      }
    }
  },

  compatibilityDate: '2024-07-10',
})
