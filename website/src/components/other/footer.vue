<template>
  <v-footer app height="auto" color="headerAndFooterColor">
    <v-card class="flex py-1" text tile flat color="headerAndFooterColor">
      <v-row class="justify-end">
        <v-col class="text-left" style="margin-left: 1em; margin-right: 1em">
          &copy;&nbsp; {{ copyrightStartYear }} —
          {{ copyrightEndYear }} &nbsp;<strong> {{ appOwner }} </strong>
        </v-col>
        <v-col class="text-right" style="margin-left: 1em; margin-right: 1em">
          Built with
          <a href="https://nuxtjs.org/" target="_blank">Nuxt.js</a>
          &nbsp;||&nbsp;
          <a href="/sitemap.xml" target="_blank">{{ siteMapText }}</a
          >&nbsp;||&nbsp;
          <a href="/blogfeed.xml" target="_blank">{{ blogFeedtext }}</a>
        </v-col>
      </v-row>
    </v-card>
  </v-footer>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    siteMapText: 'Sitemap',
    blogFeedtext: 'Blog Feed',
    builtWithText:
      'Built with <a href="https://nuxtjs.org/" target="_blank">Nuxt.js</a>'
  }),
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      copyrightStartYear: state => state.GlobalData.copyrightStartYear,
      copyrightEndYear: state => state.GlobalData.copyrightEndYear
    })
  }
}
</script>
