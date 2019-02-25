<template>
  <v-container>
    <v-layout
      wrap
    >
      <v-flex xs12>
        This a personal website and has nothing to do with my employers, past and present. Any content here does not constitute endorsement or guarantees of anything including veracity. I hold the right to determine exclusions, my resume, provided via this site, being an obvious choice.
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    appOwner: state => state.GlobalData.appOwner,
    currentPage: state => state.MainNavMenu.legal.legalText
  }),
  head() {
    return {
      title: this.currentPage + ' || ' + this.appOwner
    }
  }
}
</script>

<style>
</style>
