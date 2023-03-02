<template>
  <v-col cols="12">
    <v-card class="pa-3" raised elevation="8" color="cardColor">
      <!--eslint-disable-next-line vue/no-v-html-->
      <div class="text-justify px-2" v-html="aboutBlurb" />
    </v-card>
  </v-col>
</template>

<script>
import fm from 'front-matter'
import mdit from 'markdown-it'
import asyncComputed from '../../utils/vue3-async-computed.ts'
import { computedAsync } from '@vueuse/core'
const md = new mdit({
  html: true,
  linkify: true,
  typographer: true,
})
export default {
  setup() {
    const aboutBlurb = computedAsync(async () => {
      try {
        const fileContent = await import('./about-blurb.md?raw')
        const res = fm(fileContent.default)
        return md.render(res.body)
      } catch (error) {
        console.log(error)
      }
    })
    return {
      aboutBlurb
    }
  },
  /* asyncComputed: {
    async aboutBlurb() {
      const fileContent = await import('./about-blurb.md')
      const res = fm(fileContent.default)
      console.log('HERE')
      console.log(md.render(res.body))
      return md.render(res.body)
    },
  }, */
}
</script>
