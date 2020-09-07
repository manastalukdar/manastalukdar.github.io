<template>
  <v-col cols="12">
    <v-card
      color="cardColor"
      class="pa-3"
      raised
      elevation="8"
      style="height: 100%"
    >
      <v-row class="title" justify="center">
        <span>Interests</span>
      </v-row>
      <p />
      <!--eslint-disable-next-line vue/no-v-html-->
      <div v-html="interests" />
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
    async interests() {
      const fileContent = await import('./interests.md')
      const res = fm(fileContent.default)
      return md.render(res.body)
    },
  },
}
</script>
