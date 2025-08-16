<template>
  <v-footer app height="auto" class="pa-0">
    <v-card
      class="flex py-4"
      tile
      flat
      width="100%"
      color="headerAndFooterColor"
      style="border-radius:0"
    >
      <v-row class="justify-end">
        <v-col class="text-left d-flex align-center" style="margin-left: 1em; margin-right: 1em">
          <span>
            &copy;&nbsp; {{ copyrightStartYear }} —
            {{ copyrightEndYear }} &nbsp;<strong> {{ appOwner }} </strong>
          </span>
          <a href="/legal" class="license-link" style="text-decoration: none; margin-left: 0.5em;">
            <nuxt-img src="/images/cc-by-nc-nd-4.0-80x15.png"
                 alt="CC BY-NC-ND 4.0 License"
                 class="license-badge"
                 style="vertical-align: middle;"
                 loading="eager"
                 format="webp"
                 quality="90" />
          </a>
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
            >Nuxt</a
          >
          and
          <a
            href="https://vuetifyjs.com/"
            target="_blank"
            rel="noopener noreferrer"
            >Vuetify</a
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
