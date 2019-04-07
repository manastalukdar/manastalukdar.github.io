import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'
const LRU = require('lru-cache')

// https://vuetifyjs.com/en/framework/colors

Vue.use(Vuetify, {
  options: {
    customProperties: true
  },
  theme: {
    backgroundDark: colors.blueGrey.darken2, // #252a33,
    cardColorDark: colors.blueGrey.darken4,
    primary: colors.teal.lighten3, // blue.darken2
    accent: colors.grey.darken3,
    secondary: colors.amber.darken3,
    info: colors.teal.lighten1,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3
  },
  themeCache: () => {
    return new LRU({
      max: 10,
      maxAge: 1000 * 60 * 60 // 1 hour
    })
  }
})
