// app/vuetify/options.js

import colors from 'vuetify/lib/util/colors'

export default {
  theme: {
    dark: true,
    themes: {
      dark: {
        background: colors.blueGrey.darken2, // #141e24
        headerAndFooterColor: colors.lightBlue.darken4,
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
        cardColor: colors.shades.white
      }
    },
    options: {
      customProperties: true,
      minifyTheme(css) {
        return process.env.NODE_ENV === 'production'
          ? css.replace(/(?<!v-application)[\s|\r\n|\r|\n]/g, '')
          : css
      },
    }
  }
}
