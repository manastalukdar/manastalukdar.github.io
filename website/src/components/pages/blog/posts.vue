<template>
  <v-container>
    <v-layout
      text-xs-justify
      wrap
    >
      <v-flex xs12>
        <v-layout row justify-center headline>
          {{ pageTitle }}
        </v-layout>
      </v-flex>
      <postsList :posts-list="blogMetadata" />
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import postsList from '../../other/blog/posts-list/list.vue'
export default {
  components: {
    postsList
  },
  computed: mapState({
    appOwner: state => state.GlobalData.appOwner,
    currentPage: state =>
      state.MainNavMenu.blog.blogText +
      ' | ' +
      state.MainNavMenu.blog.blogItems[0].text,
    blogMetadata: state => state.BlogMetadata.blogMetadata,
    pageTitle: state => state.MainNavMenu.blog.blogText
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
