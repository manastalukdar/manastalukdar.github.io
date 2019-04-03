<template>
  <v-container>
    <v-layout
      text-xs-justify
      wrap
    >
      <v-flex xs12>
        <v-layout row justify-center class="title">
          {{ postFormatText }}:&nbsp; {{ postFormatType }}
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
        state.MainNavMenu.blog.postFormatText,
      postFormatText: state => state.MainNavMenu.blog.postFormatText
    })
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      const postFormatTypeTemp = payload[0]['post-format'].name
      return {
        blogMetadata: payload,
        postFormatType: postFormatTypeTemp
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForPostFormat'](
        params.type
      )
      if (posts === undefined) {
        return {
          blogMetadata: [],
          authorName: ''
        }
      }
      const postFormatTypeTemp = posts[0]['post-format'].name
      return {
        blogMetadata: posts,
        postFormatType: postFormatTypeTemp
      }
    }
  },
  head() {
    return {
      title:
        this.currentPage + ' | ' + this.postFormatType + ' || ' + this.appOwner,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Blog posts of format ' + this.postFormatType
        }
      ]
    }
  }
}
</script>

<style>
</style>
