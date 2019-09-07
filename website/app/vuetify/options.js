// app/vuetify/options.js

import colors from 'vuetify/lib/util/colors'

export default {
  theme: {
    dark: true,
    themes: {
      dark: {
        background: '#141e24', // #141e24
        headerAndFooterColor: colors.blueGrey.darken3,
        cardColor: colors.blueGrey.darken4,
        primary: colors.teal.lighten3, // blue.darken2
        backToTopBackground: colors.blueGrey.darken2,
        backToTopText: colors.blue.lighten1,
        codeBackgroundColor: '#282c34',
        codeTextColor: '#abb2bf'
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
        backToTopBackground: colors.grey.lighten2,
        backToTopText: colors.red,
        codeBackgroundColor: '#f5f5f5',
        codeTextColor: '#383636'
      }
    },
    options: {
      customProperties: true,
      minifyTheme(css) {
        return process.env.NODE_ENV === 'production'
          ? css.replace(/(?<!v-application)[\s|\r\n|\r|\n]/g, '')
          : css
      }
    }
  }
}
