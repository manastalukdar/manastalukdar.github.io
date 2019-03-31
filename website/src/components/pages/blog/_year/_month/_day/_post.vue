<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex xs12>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="postContent" />
        {{ postMetadata }}
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
      const fileContent = await import('./src/static/blogdata/' + payload.path)
      const res = fm(fileContent.default)
      // console.log(res.attributes)
      return {
        postContent: md.render(res.body),
        postMetadata: payload
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
      const fileContent = await axios.get(
        env.baseURL + '/blogdata/' + postMetadata.path
      )
      const res = fm(fileContent.data)
      return {
        postContent: md.render(res.body),
        postMetadata: postMetadata
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
