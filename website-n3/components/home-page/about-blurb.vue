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
//const fm = require('front-matter')
const md = new mdit({
  html: true,
  linkify: true,
  typographer: true,
})
export default {
  asyncComputed: {
    async aboutBlurb() {
      const fileContent = await import('./about-blurb.md')
      const res = fm(fileContent.default)
      console.log('HERE')
      console.log(md.render(res.body))
      return md.render(res.body)
    },
  },
}
</script>
