module.exports = exports = {
  root: false,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:prettier/recommended',
    "plugin:vue/recommended",
    "eslint:recommended",
    "prettier/vue"
  ],
  plugins: [
    'prettier',
    'vuetify'
  ],
  // add your custom rules here
  rules: {
    "prettier/prettier": ["error", {
      "endOfLine": "auto"
    }],
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error'
  },
  globals: {
    $nuxt: true
  }
}
