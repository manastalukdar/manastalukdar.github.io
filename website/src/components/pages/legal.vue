<template>
  <v-container>
    <v-layout
      wrap
    >
      <v-flex xs12>
        This a personal website and has nothing to do with my employers, past and present. Any content here does not constitute endorsement or guarantees of anything. I hold the right to determine exclusions to this disclaimer. My resume provided via this site being an obvious exclusion.
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: function() {
    return {
      title: this.currentPage + ' || ' + this.appOwner
    }
  },
  computed: mapState({
    appOwner: state => state.GlobalData.appOwner,
    currentPage: state => state.MainNavMenu.legal.legalText,
    currentHref: state => state.MainNavMenu.legal.legalPath
  }),
  asyncData({ store, params, env, payload }) {
    return {
      baseUrl: env.baseURL
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Legal disclaimer.'
        },
        {
          hid: 'title',
          name: 'title',
          content: this.title
        }
      ],
      link: [{ rel: 'canonical', href: this.baseUrl + this.currentHref }]
    }
  }
}
</script>

<style>
</style>
