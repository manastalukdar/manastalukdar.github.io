<template>
  <v-container>
    <v-layout
      text-xs-justify
      wrap
    >
      <v-flex xs12>
        <v-layout row justify-center class="headline">
          {{ monthText }}:&nbsp; {{ monthName }}
        </v-layout>
      </v-flex>
      <postsList :posts-list="blogMetadata" />
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import postsList from '../../../../other/blog/posts-list/list.vue'
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
        state.MainNavMenu.blog.monthText,
      monthText: state => state.MainNavMenu.blog.monthText
    })
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        blogMetadata: payload,
        monthName: params.year + '-' + params.month
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForMonth'](
        params.year,
        params.month
      )
      if (posts === undefined) {
        return {
          blogMetadata: [],
          monthName: ''
        }
      }
      return {
        blogMetadata: posts,
        monthName: params.year + '-' + params.month
      }
    }
  },
  head() {
    return {
      title: this.currentPage + ' | ' + this.monthName + ' || ' + this.appOwner,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Blog posts on month ' + this.monthName
        },
        {
          hid: 'title',
          name: 'title',
          content:
            this.currentPage + ' | ' + this.monthName + ' || ' + this.appOwner
        }
      ]
    }
  }
}
</script>

<style>
</style>
