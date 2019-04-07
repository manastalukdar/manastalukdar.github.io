<template>
  <v-footer app height="auto">
    <v-card class="flex py-3" flat tile :color="headerAndFooterColor">
      <v-layout row class="justify-center">
        <v-flex xs6 text-xs-left style="margin-left: 1em; margin-right: 1em">
          &copy;&nbsp; {{ copyrightStartYear }} —
          {{ copyrightEndYear }} &nbsp;<strong> {{ appOwner }} </strong>
        </v-flex>
        <v-flex xs6 text-xs-right style="margin-left: 1em; margin-right: 1em">
          Built with
          <a href="https://vuejs.org/" target="_blank">Vue.js</a>
          and
          <a href="https://nuxtjs.org/" target="_blank">Nuxt.js</a>
          &nbsp;||&nbsp;
          <a href="/sitemap.xml" target="_blank">{{ siteMapText }}</a
          >&nbsp;||&nbsp;
          <a href="/blogfeed.xml" target="_blank">{{ blogFeedtext }}</a>
        </v-flex>
      </v-layout>
    </v-card>
  </v-footer>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    siteMapText: 'sitemap',
    blogFeedtext: 'feed',
    builtWithText:
      'Built with <a href="https://vuejs.org/" target="_blank">Vue.js</a> and <a href="https://nuxtjs.org/" target="_blank">Nuxt.js</a>'
  }),
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      copyrightStartYear: state => state.GlobalData.copyrightStartYear,
      copyrightEndYear: state => state.GlobalData.copyrightEndYear
    }),
    headerAndFooterColor() {
      return this.$store.getters['GlobalData/getHeaderAndFooterColor']
    }
  }
}
</script>
