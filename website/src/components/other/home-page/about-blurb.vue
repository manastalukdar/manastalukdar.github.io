<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-card class="pa-3" raised elevation="8" :color="cardColor">
        <!--eslint-disable-next-line vue/no-v-html-->
        <div class="text-xs-justify" v-html="aboutBlurb" />
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
    async aboutBlurb() {
      const fileContent = await import('./about-blurb.md')
      const res = fm(fileContent.default)
      return md.render(res.body)
    }
  },
  computed: {
    cardColor() {
      return this.$store.getters['GlobalData/getCardColor']
    }
  }
}
</script>
