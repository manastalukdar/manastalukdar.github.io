<template>
  <v-col cols="12">
    <v-card
      color="cardColor"
      class="pa-8"
      raised
      elevation="8"
      style="height: 100%"
      id="printMe"
    >
      <v-row class="text-h5 px-3 py-3" justify="center">
        <span>For Recruiters and Hiring Managers</span>
      </v-row>
      <p />
      <!--eslint-disable-next-line vue/no-v-html-->
      <div class="pl-2 pb-2" v-html="recruiters" />

      <div class="printButton col py-5" justify="center">
        <v-icon @click="print">mdi-printer</v-icon>
      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import { usePaperizer } from 'paperizer'
import fm from 'front-matter'
import mdit from 'markdown-it'
import { computedAsync } from '@vueuse/core'
const md = new mdit({
  html: true,
  linkify: true,
  typographer: true,
})
const recruiters = computedAsync(async () => {
  try {
    const fileContent = await import('./recruiters.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const { paperize } = usePaperizer('printMe',  {
  styles: [
    '#single-post-header {text-align: center; justify-content: center !important;} .row {display: flex; flex-wrap: wrap; flex: 1 1 auto;} .col {flex-basis: 0; flex-grow: 1; max-width: 100%} .col-12 {flex: 0 0 100%} html {font-family: "Maven Pro", sans-serif; line-height: 1.8; font-size: 15px}'
  ]
});
const print = () => {
  paperize()
};
</script>
