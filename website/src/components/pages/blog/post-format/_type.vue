<template>
  <v-container>
    <v-layout text-xs-justify wrap>
      <v-flex xs12>
        <v-layout row justify-center class="headline">
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
        state.Navigation.blog.blogText +
        ' | ' +
        state.Navigation.blog.postFormatText,
      postFormatText: state => state.Navigation.blog.postFormatText
    })
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      const postFormatTypeTemp = payload[0]['post-format'].name
      return {
        postFormatUrlSlug: params.type,
        baseUrl: env.baseURL,
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
          postFormatUrlSlug: params.type,
          baseUrl: env.baseURL,
          blogMetadata: [],
          authorName: ''
        }
      }
      const postFormatTypeTemp = posts[0]['post-format'].name
      return {
        postFormatUrlSlug: params.type,
        baseUrl: env.baseURL,
        blogMetadata: posts,
        postFormatType: postFormatTypeTemp
      }
    }
  },
  head() {
    const title =
      this.currentPage + ' | ' + this.postFormatType + ' || ' + this.appOwner
    const description = 'Blog posts of format ' + this.postFormatType
    const url = this.baseUrl + '/blog/post-format/' + this.postFormatType + '/'
    return {
      title: title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Blog posts of format ' + this.postFormatType
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
          name: ':description',
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
