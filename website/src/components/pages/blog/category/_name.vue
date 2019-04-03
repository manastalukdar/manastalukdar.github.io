<template>
  <v-container>
    <v-layout
      text-xs-justify
      wrap
    >
      <v-layout row justify-center class="title">
        {{ categoryText }}:&nbsp; {{ categoryName }}
      </v-layout>
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
      // blogMetadata: state => state.BlogMetadata.blogMetadata,
      // categoryName: state => state.BlogMetadata.blogMetadata[0].categories[0].name
    })
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        blogMetadata: payload,
        categoryName: payload[0].categories[0].name
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const catName = store.state.BlogMetadata.blogMetadata[0].categories.map(
        category => {
          // eslint-disable-next-line no-console
          console.log(category)
          if (category['url-slug'] === params.name) {
            return category.name
          } else return {}
        }
      )
      return {
        blogMetadata: store.state.BlogMetadata.blogMetadata,
        categoryName: catName
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
