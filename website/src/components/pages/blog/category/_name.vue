<template>
  <v-container>
    <v-layout
      text-xs-justify
      wrap
    >
      <v-flex xs12>
        <v-layout row justify-center class="title">
          {{ categoryText }}:&nbsp; {{ categoryName }}
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
        state.MainNavMenu.blog.categoryText,
      categoryText: state => state.MainNavMenu.blog.categoryText
    })
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      const catName = payload[0].categories.filter(category => {
        if (category['url-slug'] === params.name) {
          return category.name
        }
      })
      return {
        blogMetadata: payload,
        categoryName: catName[0].name
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForCategory'](
        params.name
      )
      if (posts === undefined) {
        return {
          blogMetadata: [],
          authorName: ''
        }
      }
      const catName = posts[0].categories.filter(category => {
        if (category['url-slug'] === params.name) {
          return category.name
        }
      })
      return {
        blogMetadata: posts,
        categoryName: catName[0].name
      }
    }
  },
  head() {
    return {
      title:
        this.currentPage + ' | ' + this.categoryName + ' || ' + this.appOwner,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Blog posts in category ' + this.categoryName
        }
      ]
    }
  }
}
</script>

<style>
</style>
