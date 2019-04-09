<template>
  <v-container>
    <v-layout text-xs-justify wrap>
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
        monthUrlSlug: params.year + '/' + params.month,
        baseUrl: env.baseURL,
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
          monthUrlSlug: params.year + '/' + params.month,
          baseUrl: env.baseURL,
          blogMetadata: [],
          monthName: ''
        }
      }
      return {
        monthUrlSlug: params.year + '/' + params.month,
        baseUrl: env.baseURL,
        blogMetadata: posts,
        monthName: params.year + '-' + params.month
      }
    }
  },
  head() {
    const title =
      this.currentPage + ' | ' + this.monthName + ' || ' + this.appOwner
    const description = 'Blog posts on month ' + this.monthName
    const url = this.baseUrl + '/blog/' + this.monthUrlSlug + '/'
    return {
      title: title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: title
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
