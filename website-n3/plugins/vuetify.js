// Copyright (c) 2023 Manas Talukdar
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
  })
  nuxtApp.vueApp.use(vuetify)
})