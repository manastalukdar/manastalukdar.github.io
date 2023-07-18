// Copyright (c) 2023 Manas Talukdar
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// plugins/vuetify.js
import "vuetify/styles";
import { createVuetify } from "vuetify";
import colors from "vuetify/lib/util/colors";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VDataTable } from "vuetify/labs/VDataTable";
import { VDataIterator } from "vuetify/labs/VDataIterator";
import "vuetify/styles";

const darkTheme1 = {
  dark: true,
  colors: {
    background: "#141e24", // #141e24
    surface: "#141e24",
    headerAndFooterColor: colors.blueGrey.darken3,
    cardColor: colors.blueGrey.darken4,
    primary: colors.teal.lighten3, // blue.darken2
    backToTopBackground: colors.blueGrey.darken2,
    backToTopText: colors.blue.lighten1,
    codeBackgroundColor: "#282c34",
    codeTextColor: "#abb2bf",
    /* accent: colors.grey.darken3,
      secondary: colors.amber.darken3,
      info: colors.teal.lighten1,
      warning: colors.amber.base,
      error: colors.deepOrange.accent4,
      success: colors.green.accent3 */
  },
};

const lightTheme = {
  dark: false,
  colors: {
    background: "#eee",
    surface: "#15202b",
    primary: "#3f51b5",
    secondary: "#00ccff",
    error: "#ffcc00",
    headerAndFooterColor: colors.grey.lighten2,
    cardColor: colors.shades.white,
    backToTopBackground: colors.grey.lighten2,
    backToTopText: colors.red.base,
    codeBackgroundColor: "#f5f5f5",
    codeTextColor: "#383636",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "darkTheme1",
      themes: {
        darkTheme1,
        lightTheme,
      },
      options: {
        customProperties: true,
        minifyTheme(css) {
          return process.env.NODE_ENV === "production"
            ? css.replace(/(?<!v-application)[\s|\r\n|\r|\n]/g, "")
            : css;
        },
      },
    },
    ssr: true,
    components: {
      ...components,
      VDataTable,
      VDataIterator,
    },
    directives,
  });
  nuxtApp.vueApp.use(vuetify);
});
