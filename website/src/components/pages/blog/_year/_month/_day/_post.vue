<template>
  <v-container>
    <v-layout
      wrap
    >
      <v-flex xs12>
        <v-layout row justify-center class="title">
          <p>
            {{ postMetadata.title }}
          </p>
        </v-layout>
        <v-layout row justify-center>
          Author:&nbsp;
          <nuxt-link
            :to="{ name: 'blog-author-name', params: { name:postMetadata.author } }"
          >
            {{ postMetadata.author }}
          </nuxt-link>
          &nbsp;
          || First Published: {{ postMetadata["first-published-on"] }} || Last Updated: {{ postMetadata["last-updated-on"] }}
        </v-layout>
        <v-layout row justify-center>
          Categories:&nbsp;
          <div
            v-for="item in postMetadata.categories"
            :key="item"
          >
            <nuxt-link
              :to="{ name: 'blog-category-name', params: { name:item } }"
            >
              {{ item }}
            </nuxt-link>
          &nbsp;
          </div>
          &nbsp;|| Tags:&nbsp;
          <div
            v-for="item in postMetadata.tags"
            :key="item"
          >
            <nuxt-link
              :to="{ name: 'blog-tag-name', params: { name:item } }"
            >
              {{ item }}
            </nuxt-link>
          &nbsp;
          </div>
          &nbsp;|| Post-format:&nbsp;
          <nuxt-link
            :to="{ name: 'blog-post-format-type', params: { type: postMetadata['post-format'] } }"
          >
            {{ postMetadata['post-format'] }}
          </nuxt-link>
        </v-layout>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="postContent" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
export default {
  data() {
    return {
      postContent: ''
    }
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state => state.MainNavMenu.blog.blogText + ' | '
    })
  },
  async asyncData({ store, params, env, payload }) {
    const fm = require('front-matter')
    const md = require('markdown-it')({
      html: true,
      linkify: true,
      typographer: true
    })
    if (payload) {
      const fileContent = await import('src/static/blogdata/' +
        payload.path +
        '1')
      const res = fm(fileContent.default)
      // console.log(res.attributes)
      return {
        postContent: md.render(res.body),
        postMetadata: payload,
        baseURL: env.baseURL
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const postMetadata = store.getters['BlogMetadata/getPostMetadata'](
        params.year,
        params.month,
        params.day,
        params.post
      )
      const fileContent = await axios
        .get(env.baseURL + '/blogdata/' + postMetadata.path)
        .catch(function(error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // eslint-disable-next-line no-console
            console.log(error.response.data)
            // eslint-disable-next-line no-console
            console.log(error.response.status)
            // eslint-disable-next-line no-console
            console.log(error.response.headers)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            // eslint-disable-next-line no-console
            console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            // eslint-disable-next-line no-console
            console.log('Error', error.message)
          }
          // eslint-disable-next-line no-console
          console.log(error.config)
        })
      const res = fm(fileContent.data)
      return {
        postContent: md.render(res.body),
        postMetadata: postMetadata,
        baseURL: env.baseURL
      }
    }
  },
  head() {
    /* const postMetadata = this.$store.getters['BlogMetadata/getPostMetadata'](
      this.$route.params.year,
      this.$route.params.month,
      this.$route.params.day,
      this.$route.params.post
    ) */
    return {
      title:
        this.currentPage +
        this.postMetadata.meta.title +
        ' || ' +
        this.appOwner,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.postMetadata.meta.description
        }
      ]
    }
  }
}
</script>

<style>
</style>
