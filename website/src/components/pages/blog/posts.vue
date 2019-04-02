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
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        blogMetadata: payload
      }
    } else if (store.state.BlogMetadata.blogMetadata.length === 0) {
      await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
    }
  },
  head() {
    return {
      title: this.currentPage + ' || ' + this.appOwner,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Reflections on software engineering and other matters.'
        }
      ]
    }
  }
}
</script>

<style>
</style>
