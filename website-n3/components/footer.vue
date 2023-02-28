<template>
  <v-footer app height="auto" padless>
    <v-card
      class="flex py-4"
      text
      tile
      flat
      width="100%"
      color="headerAndFooterColor"
    >
      <v-row class="justify-end">
        <v-col class="text-left" style="margin-left: 1em; margin-right: 1em">
          &copy;&nbsp; {{ copyrightStartYear }} —
          {{ copyrightEndYear }} &nbsp;<strong> {{ appOwner }} </strong>
        </v-col>
        <v-col class="text-right" style="margin-left: 1em; margin-right: 1em">
          <a
            href="https://github.com/manastalukdar/manastalukdar.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            >Built</a
          >
          with
          <a
            href="https://nuxt.com/"
            target="_blank"
            rel="noopener noreferrer"
            >Nuxt.js</a
          >
          &nbsp;||&nbsp;
          <a href="/sitemap.xml" target="_blank">{{ siteMapText }}</a>
          &nbsp;||&nbsp;
          <a href="/blogfeed.xml" target="_blank">{{ blogFeedtext }}</a>
        </v-col>
      </v-row>
    </v-card>
  </v-footer>
</template>

<script>
import { mapState } from 'pinia'
import { useGlobalDataStore } from '@/stores/GlobalData'
const globalDataStore = useGlobalDataStore()
export default {
  data: () => ({
    siteMapText: 'Sitemap',
    blogFeedtext: 'Blog Feed',
    builtWithText:
      'Built with <a href="https://nuxtjs.org/" target="_blank">Nuxt.js</a>',
    appOwner: globalDataStore.appOwner,
  }),
  computed: {
    ...mapState(useGlobalDataStore, ['copyrightStartYear']),
    ...mapState(useGlobalDataStore, ['copyrightEndYear']),
  },
}
</script>
