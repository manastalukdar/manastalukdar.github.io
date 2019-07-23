<template>
  <v-col cols="12">
    <v-card
      color="cardColor"
      class="pa-3"
      raised
      elevation="8"
      style="height:100%"
    >
      <v-row class="title" justify="center">
        <span>Highlights</span>
      </v-row>
      <p />
      <!--eslint-disable-next-line vue/no-v-html-->
      <div class="pb-2" v-html="highlights" />
    </v-card>
  </v-col>
</template>

<script>
const fm = require('front-matter')
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
})
export default {
  asyncComputed: {
    async highlights() {
      const fileContent = await import('./highlights.md')
      const res = fm(fileContent.default)
      return md.render(res.body)
    }
  }
}
</script>
