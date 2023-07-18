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
      <v-row class="text-h5 px-3 py-3 recruiters-header space-around">
        <span>For Recruiters and Hiring Managers</span>
      </v-row>
      <p />
      <!--eslint-disable-next-line vue/no-v-html-->
      <div class="pl-2 pb-2" v-html="recruiters" />

      <div class="printButton col py-5 space-around">
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
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    '../../style/print-recruiters.css'
  ]
});
const print = () => {
  paperize()
};
</script>
