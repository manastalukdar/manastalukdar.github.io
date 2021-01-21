<template>
  <v-col cols="12">
    <v-card color="cardColor" class="pa-3 fill-height" raised elevation="8">
      <v-row class="title px-3 py-3" justify="center">
        <span>Featured</span>
      </v-row>
      <p />
      <!--eslint-disable-next-line vue/no-v-html-->
      <div class="px-3 pb-2 justify-center" v-html="featured" />
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
    async featured() {
      const fileContent = await import('./featured.md')
      const res = fm(fileContent.default)
      return md.render(res.body)
    },
  },
}
</script>
