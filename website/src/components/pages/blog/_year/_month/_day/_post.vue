<template>
  <v-container>
    <v-layout
      wrap
    >
      <v-flex xs12>
        <post :post-metadata="postMetadata" :post-content="postContent" :url="url" :post-id="postId" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import post from '../../../../../other/blog/single-post/post.vue'
export default {
  components: {
    post
  },
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
    const hljs = require('highlight.js') // https://highlightjs.org/
    const fm = require('front-matter')
    const md = require('markdown-it')({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch (__) {}
        }
        return '' // use external default escaping
      }
    })
    md.use(require('markdown-it-mathjax')())
    const postIdTemp =
      'blog/' +
      params.year +
      '/' +
      params.month +
      '/' +
      params.day +
      '/' +
      params.post
    if (payload) {
      const fileContent = await import('./src/static/blogdata/' + payload.path)
      const res = fm(fileContent.default)
      // console.log(res.attributes)
      return {
        postContent: md.render(res.body),
        postMetadata: payload,
        baseURL: env.baseURL,
        postId: postIdTemp,
        url: env.baseURL + postIdTemp
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
        baseURL: env.baseURL,
        postId: postIdTemp,
        url: env.baseURL + '/' + postIdTemp
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
    const keywordsArray = []
    this.postMetadata.categories.forEach(category => {
      keywordsArray.push(category.name)
    })
    this.postMetadata.tags.forEach(tag => {
      keywordsArray.push(tag.name)
    })
    this.postMetadata.authors.forEach(author => {
      keywordsArray.push(author.name)
    })
    const keywords = keywordsArray.join()
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
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: keywords
        }
      ]
    }
  }
}
</script>

<style>
pre {
  margin: 2em;
}
code {
  margin: 0em;
  padding: 1em;
}
blockquote {
  padding: 10px 20px;
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 300;
  border-left: 2px solid #eee;
}
</style>
