<template>
  <v-container>
    <v-layout
      text-xs-justify
      wrap
    >
      <v-flex xs12>
        <v-layout row justify-center class="title">
          {{ authorText }}:&nbsp; {{ authorName }}
        </v-layout>
      </v-flex>
      <postsList :posts-list="blogMetadata" />
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import postsList from '../../../other/blog/posts-list/list.vue'
export default {
  components: {
    postsList
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state =>
        state.MainNavMenu.blog.blogText +
        ' | ' +
        state.MainNavMenu.blog.authorText,
      authorText: state => state.MainNavMenu.blog.authorText
    })
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      const authName = payload[0].authors.filter(author => {
        if (author['url-slug'] === params.name) {
          return author.name
        }
      })
      return {
        blogMetadata: payload,
        authorName: authName[0].name
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForAuthor'](params.name)
      if (posts === undefined) {
        return {
          blogMetadata: [],
          authorName: ''
        }
      }
      const authName = posts[0].authors.filter(author => {
        if (author['url-slug'] === params.name) {
          return author.name
        }
      })
      return {
        blogMetadata: posts,
        authorName: authName[0].name
      }
    }
  },
  head() {
    return {
      title:
        this.currentPage + ' | ' + this.authorName + ' || ' + this.appOwner,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Blog posts by author ' + this.authorName
        }
      ]
    }
  }
}
</script>

<style>
</style>
