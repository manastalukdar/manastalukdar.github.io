<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex xs12>
        Post: {{ $route.params }}
        {{ postMetadata }}
        <!--{{ postMetadata.excerpt }}-->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    postMetadata: {
      get() {
        return this.$store.getters['BlogMetadata/getPostMetadata'](
          this.$route.params.year,
          this.$route.params.month,
          this.$route.params.day,
          this.$route.params.post
        )
      }
    },
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state => state.MainNavMenu.blog.blogText + ' | '
    })
  },
  async fetch({ store, params, env }) {
    if (store.state.BlogMetadata.blogMetadata.length === 0) {
      await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
    }
  },
  head() {
    const postMetadata = this.$store.getters['BlogMetadata/getPostMetadata'](
      this.$route.params.year,
      this.$route.params.month,
      this.$route.params.day,
      this.$route.params.post
    )
    return {
      title:
        this.currentPage + postMetadata.meta.title + ' || ' + this.appOwner,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: postMetadata.meta.description
        }
      ]
    }
  }
}
</script>

<style>
</style>
