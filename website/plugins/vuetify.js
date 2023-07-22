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

const darkForestTheme = {
  dark: true,
  colors: {
    background: "#141e24", // #141e24
    surface: colors.blueGrey.darken3, // #141e24
    headerAndFooterColor: colors.blueGrey.darken3,
    cardColor: colors.blueGrey.darken4,
    primary: colors.teal.lighten3, // blue.darken2
    backToTopBackground: colors.blueGrey.darken2,
    backToTopText: colors.blue.lighten1,
    codeBackgroundColor: "#282c34",
    codeTextColor: "#abb2bf",
    linkColor: "#42b983",
    linkHoverColor: "#ce7720",
    linkActiveColor: "#e90e0e",
    LinkVisitedColor: "#b1be80",
    textColor: "rgb(232, 230, 227)",
    /* accent: colors.grey.darken3,
      secondary: colors.amber.darken3,
      info: colors.teal.lighten1,
      warning: colors.amber.base,
      error: colors.deepOrange.accent4,
      success: colors.green.accent3 */
  },
};

const darkEasyTheme = {
  dark: true,
  colors: {
    background: "rgb(24, 26, 27)",
    surface: "rgb(24, 26, 27)",
    headerAndFooterColor: "rgb(42, 45, 47)",
    cardColor: "rgb(24, 26, 20)",
    primary: colors.teal.lighten3,
    backToTopBackground: colors.blueGrey.darken2,
    backToTopText: colors.blue.lighten1,
    codeBackgroundColor: "#282c34",
    codeTextColor: "#abb2bf",
    linkColor: "#42b983",
    linkHoverColor: "#ce7720",
    linkActiveColor: "#e90e0e",
    LinkVisitedColor: "#b1be80",
    textColor: "rgb(232, 230, 227)",
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
    /*background: "#eee",
    surface: "#15202b",
    primary: "#3f51b5",
    secondary: "#00ccff",
    error: "#ffcc00",*/
    headerAndFooterColor: colors.grey.lighten2,
    cardColor: colors.shades.white,
    backToTopBackground: colors.grey.lighten2,
    backToTopText: colors.red.base,
    codeBackgroundColor: "#f5f5f5",
    codeTextColor: "#383636",
    linkColor: "#31805c",
    linkHoverColor: "#ca6a2a",
    linkActiveColor: "#e90e0e",
    LinkVisitedColor: "#797a33",
    textColor: "rgb(232, 230, 227)",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "darkForestTheme",
      themes: {
        darkForestTheme,
        lightTheme,
        darkEasyTheme,
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
