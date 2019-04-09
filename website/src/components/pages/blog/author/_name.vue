<template>
  <v-container>
    <v-layout text-xs-justify wrap>
      <v-flex xs12>
        <v-layout row justify-center class="headline">
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
        authorUrlSlug: params.name,
        baseUrl: env.baseURL,
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
          authorUrlSlug: params.name,
          baseUrl: env.baseURL,
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
        authorUrlSlug: params.name,
        baseUrl: env.baseURL,
        blogMetadata: posts,
        authorName: authName[0].name
      }
    }
  },
  head() {
    const title =
      this.currentPage + ' | ' + this.authorName + ' || ' + this.appOwner
    const description = 'Blog posts by author ' + this.authorName
    const url = this.baseUrl + '/blog/category/' + this.authorUrlSlug + '/'
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
