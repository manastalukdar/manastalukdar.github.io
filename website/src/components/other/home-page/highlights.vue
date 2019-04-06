<template>
  <v-layout column wrap>
    <v-flex xs12>
      <v-card
        color="blue-grey darken-4"
        class="pa-3"
        raised
        elevation="8"
        style="height:100%"
      >
        <v-layout row justify-center title>
          <span>Highlights</span>
        </v-layout>
        <p />
        <!--eslint-disable-next-line vue/no-v-html-->
        <div v-html="highlights" />
      </v-card>
    </v-flex>
  </v-layout>
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
