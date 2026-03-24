<template>
  <v-col cols="12">
    <v-card class="pa-3 pb-5" raised elevation="8" color="cardColor">
      <!--eslint-disable-next-line vue/no-v-html-->
      <div class="text-justify px-2" v-html="aboutBlurb" />
    </v-card>
  </v-col>
</template>

<script>
import fm from 'front-matter'
import mdit from 'markdown-it'
import { computedAsync } from '@vueuse/core'
import { getBuildTimestamp } from '~/utils/contentHash.client'
const md = new mdit({
  html: true,
  linkify: true,
  typographer: true,
})
export default {
  setup() {
    const aboutBlurb = computedAsync(async () => {
      try {
        // Use static import and add cache busting via URL parameter in production
        const fileContent = await import('./about-blurb.md?raw')
        const res = fm(fileContent.default)
        const rendered = md.render(res.body)
        
        // Add build timestamp to prevent caching in production
        if (process.env.NODE_ENV === 'production') {
          // Force re-render on build changes by including timestamp in a data attribute
          const buildTimestamp = getBuildTimestamp()
          return `<div data-build="${buildTimestamp}">${rendered}</div>`
        }
        
        return rendered
      } catch (error) {
        console.log(error)
      }
    })
    return {
      aboutBlurb
    }
  },
}
</script>
