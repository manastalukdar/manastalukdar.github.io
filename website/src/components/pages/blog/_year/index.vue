<template>
  <v-container>
    <v-layout
      text-xs-justify
      wrap
    >
      <v-flex xs12>
        <v-layout row justify-center class="headline">
          {{ yearText }}:&nbsp; {{ yearName }}
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
        state.MainNavMenu.blog.yearText,
      yearText: state => state.MainNavMenu.blog.yearText
    })
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        blogMetadata: payload,
        yearName: params.year
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForYear'](params.year)
      if (posts === undefined) {
        return {
          blogMetadata: [],
          yearName: ''
        }
      }
      return {
        blogMetadata: posts,
        yearName: params.year
      }
    }
  },
  head() {
    return {
      title: this.currentPage + ' | ' + this.yearName + ' || ' + this.appOwner,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Blog posts on year ' + this.yearName
        },
        {
          hid: 'title',
          name: 'title',
          content:
            this.currentPage + ' | ' + this.yearName + ' || ' + this.appOwner
        }
      ]
    }
  }
}
</script>

<style>
</style>
