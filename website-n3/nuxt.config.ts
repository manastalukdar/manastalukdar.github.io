// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'
import { createResolver } from '@nuxt/kit'
import { config, Configuration } from 'webpack';

const { resolve } = createResolver(import.meta.url)

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://manastalukdar.github.io'
    : 'http://localhost:3000'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseUrl: baseUrl
    }
  },

  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css'],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },

  hooks: {
    'vite:extend' ({ nuxt, config }) {},
    'vite:extendConfig': (config, { isClient, isServer }) => {
      /*config.plugins.push(
        vuetify({
          styles: { configFile: resolve('./style/settings.scss') },
        })
      )*/
    },
    'webpack:config' (configs: Configuration[]) {}
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  plugins: [
  ],
})
