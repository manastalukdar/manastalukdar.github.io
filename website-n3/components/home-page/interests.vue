<template>
  <v-col cols="12">
    <v-card
      color="cardColor"
      class="pa-3"
      raised
      elevation="8"
      style="height: 100%"
    >
      <v-row class="text-h6 px-3 py-3" justify="center">
        <span>Interests</span>
      </v-row>
      <p />
      <!--eslint-disable-next-line vue/no-v-html-->
      <div v-html="interests" />
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
    const interests = computedAsync(async () => {
      try {
        const fileContent = await import('./interests.md?raw')
        const res = fm(fileContent.default)
        return md.render(res.body)
      } catch (error) {
        console.log(error)
      }
    })
    return {
      interests
    }
  },
}
</script>
