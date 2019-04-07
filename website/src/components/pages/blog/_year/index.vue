<template>
  <v-container>
    <v-layout text-xs-justify wrap>
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
        yearUrlSlug: params.year,
        baseUrl: env.baseURL,
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
          yearUrlSlug: params.year,
          baseUrl: env.baseURL,
          blogMetadata: [],
          yearName: ''
        }
      }
      return {
        yearUrlSlug: params.year,
        baseUrl: env.baseURL,
        blogMetadata: posts,
        yearName: params.year
      }
    }
  },
  head() {
    const title =
      this.currentPage + ' | ' + this.yearName + ' || ' + this.appOwner
    const description = 'Blog posts on year ' + this.yearName
    const url = this.baseUrl + '/blog/' + this.yearUrlSlug
    return {
      title: title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        {
          hid: 'title',
          name: 'title',
          content: title
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: title
        },
        {
          hid: 'og-title',
          name: 'og:title',
          property: 'og:title',
          content: title
        },
        {
          hid: 'og-url',
          name: 'og:url',
          property: 'og:url',
          content: url
        },
        {
          hid: 'og-description',
          name: 'og:description',
          property: 'og:description',
          content: description
        }
      ],
      link: [{ rel: 'canonical', href: url }]
    }
  }
}
</script>

<style></style>
