<template>
  <v-col cols="12">
    <v-card color="cardColor" class="pa-3 fill-height" raised elevation="8">
      <v-row class="text-h6 px-3 py-3" justify="center">
        <span>Featured</span>
      </v-row>
      <p />
      <!--eslint-disable-next-line vue/no-v-html-->
      <div class="px-3 pb-2 justify-center" v-html="featured" />
    </v-card>
  </v-col>
</template>

<script>
import fm from 'front-matter'
import mdit from 'markdown-it'
import { computedAsync } from '@vueuse/core'
const md = new mdit({
  html: true,
  linkify: true,
  typographer: true,
})
export default {
  setup() {
    const featured = computedAsync(async () => {
      try {
        const fileContent = await import('./featured.md?raw')
        const res = fm(fileContent.default)
        return md.render(res.body)
      } catch (error) {
        console.log(error)
      }
    })
    return {
      featured
    }
  },
}
</script>
