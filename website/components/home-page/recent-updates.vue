<template>
  <v-col cols="12">
    <v-card
      color="cardColor"
      class="pa-3"
      raised
      elevation="8"
      style="height: 100%"
    >
      <v-row class="title px-3 py-3" justify="center">
        <span>Recent</span>
      </v-row>
      <p />
      <!--eslint-disable-next-line vue/no-v-html-->
      <div class="px-2 pb-2" v-html="recent" />
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
const markdownRenderHelpers = require('../../utils/markdownRenderHelpers.js')
markdownRenderHelpers.default.functions.getTargetBlankLinkRender(md)
export default {
  asyncComputed: {
    async recent() {
      const fileContent = await import('./recent-updates.md')
      const res = fm(fileContent.default)
      return md.render(res.body)
    },
  },
}
</script>
