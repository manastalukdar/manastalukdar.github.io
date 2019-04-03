<template>
  <v-container>
    <v-layout
      text-xs-justify
      wrap
    >
      <v-flex xs12>
        <v-layout row justify-center class="title">
          {{ dayText }}:&nbsp; {{ dayName }}
        </v-layout>
      </v-flex>
      <postsList :posts-list="blogMetadata" />
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import postsList from '../../../../../other/blog/posts-list/list.vue'
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
        state.MainNavMenu.blog.dayText,
      dayText: state => state.MainNavMenu.blog.dayText
    })
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        blogMetadata: payload,
        dayName: params.year + '-' + params.month + '-' + params.day
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForDay'](
        params.year,
        params.month,
        params.day
      )
      if (posts === undefined) {
        return {
          blogMetadata: [],
          dayName: ''
        }
      }
      return {
        blogMetadata: posts,
        dayName: params.year + '-' + params.month + '-' + params.day
      }
    }
  },
  head() {
    return {
      title: this.currentPage + ' | ' + this.dayName + ' || ' + this.appOwner,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Blog posts on day ' + this.dayName
        }
      ]
    }
  }
}
</script>

<style>
</style>
