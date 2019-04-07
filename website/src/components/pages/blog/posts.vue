<template>
  <v-container>
    <v-layout text-xs-justify wrap>
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
    pageTitle: state => state.MainNavMenu.blog.blogText,
    currentHref: state => state.MainNavMenu.blog.blogItems[0].href
  }),
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        baseUrl: env.baseURL,
        blogMetadata: payload
      }
    } else if (store.state.BlogMetadata.blogMetadata.length === 0) {
      await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      return {
        baseUrl: env.baseURL
      }
    }
  },
  head() {
    const title = this.currentPage + ' || ' + this.appOwner
    const description = 'Reflections on software engineering and other matters.'
    const url = this.baseUrl + this.currentHref
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
