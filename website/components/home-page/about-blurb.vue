<template>
  <v-col cols="12">
    <v-card class="pa-3" raised elevation="8" color="cardColor">
      <!--eslint-disable-next-line vue/no-v-html-->
      <div class="text-justify px-2" v-html="aboutBlurb" />
    </v-card>
  </v-col>
</template>

<script>
const fm = require('front-matter')
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
})
export default {
  asyncComputed: {
    async aboutBlurb() {
      const fileContent = await import('./about-blurb.md')
      const res = fm(fileContent.default)
      return md.render(res.body)
    },
  },
}
</script>
