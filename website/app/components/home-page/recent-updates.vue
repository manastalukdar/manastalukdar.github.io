<template>
  <v-col cols="12">
    <v-card
      color="cardColor"
      class="pa-8"
      raised
      elevation="8"
      style="height: 100%"
    >
      <v-row class="text-h6 px-3 py-3" justify="center">
        <span>Recent</span>
      </v-row>
      <p />
      <v-row class="d-flex">
        <v-col sm="6" class="flex-grow-1">
          <currentReadingGoodreads class="px-2 pb-2"/>
        </v-col>
        <v-col sm="6" class="flex-grow-1">
        <!--eslint-disable-next-line vue/no-v-html-->
        <div class="px-2 pb-2" v-html="recent" />
        </v-col>
    </v-row>
    </v-card>
  </v-col>
</template>

<script setup>
import currentReadingGoodreads from './currently-reading-goodreads.vue';
import fm from 'front-matter';
import mdit from 'markdown-it';
import { computedAsync } from '@vueuse/core';
import getTargetBlankLinkRender from "~/utils/markdownRenderHelpers.ts";
const md = new mdit({
  html: true,
  linkify: true,
  typographer: true,
})
getTargetBlankLinkRender(md);
const recent = computedAsync(async () => {
  try {
    const fileContent = await import('./recent-updates.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
</script>
