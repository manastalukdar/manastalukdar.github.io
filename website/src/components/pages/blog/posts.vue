<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex xs12>
        Under construction.
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    appOwner: state => state.GlobalData.appOwner,
    currentPage: state =>
      state.MainNavMenu.blog.blogText +
      ' | ' +
      state.MainNavMenu.blog.blogItems[0].text
  }),
  fetch({ store, params }) {
    store.dispatch('GlobalData/setCurrentPageName', this.currentPage)
  },
  head() {
    return {
      title: this.appOwner + ' || ' + this.currentPage
    }
  }
}
</script>

<style>
</style>
