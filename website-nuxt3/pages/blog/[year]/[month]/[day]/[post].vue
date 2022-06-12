<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row>
      <post
        :post-metadata="postMetadata"
        :post-content="postContent"
        :url="url"
        :post-id="postId"
      />
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItTocDoneRight from 'markdown-it-toc-done-right'
import markdownItTextualUml from 'markdown-it-textual-uml'
import mermaid from 'mermaid/dist/mermaid.js'
import post from '../../../../../components/blog/single-post/post.vue'
import breadcrumbs from '../../../../../components/breadcrumbs'
const hljs = require('highlight.js/lib/core') // https://highlightjs.org/
hljs.registerLanguage('java', require('highlight.js/lib/languages/java'))
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
)
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'))
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'))
hljs.registerLanguage('csharp', require('highlight.js/lib/languages/csharp'))
hljs.registerLanguage('shell', require('highlight.js/lib/languages/shell'))
hljs.registerLanguage(
  'powershell',
  require('highlight.js/lib/languages/powershell')
)
hljs.registerLanguage(
  'markdown',
  require('highlight.js/lib/languages/markdown')
)
hljs.registerLanguage(
  'plaintext',
  require('highlight.js/lib/languages/plaintext')
)
hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'))
const fm = require('front-matter')
const markdownRenderHelpers = require('../../../../../utils/markdownRenderHelpers.js')
// let mermaid = null
export default {
  components: {
    breadcrumbs,
    post,
  },
  async useAsyncData ({ store, params, $config, payload }) {
    const md = require('markdown-it')({
      html: true,
      xhtmlOut: true,
      linkify: true,
      typographer: true,
      highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            const langClass = 'language-' + lang
            return (
              '<pre><div class="' +
              langClass +
              ' hljs">' +
              hljs.highlight(str, { language: lang, ignoreIllegals: true })
                .value +
              '</div></pre>'
            )
            // return hljs.highlight(lang, str).value
            // eslint-disable-next-line no-empty
          } catch (__) {}
        }
        return (
          '<pre><div class="hljs">' + md.utils.escapeHtml(str) + '</div></pre>'
        )
        // return '' // use external default escaping
      },
    })
      .use(require('markdown-it-mathjax')())
      .use(require('markdown-it-html5-embed'), {
        html5embed: {
          useImageSyntax: true, // Enables video/audio embed with ![]() syntax (default)
          useLinkSyntax: false, // Enables video/audio embed with []() syntax
        },
      })
      .use(require('markdown-it-container'), 'iframe-container', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            // const textToProcess = tokens[idx].info
            // const m = textToProcess.match(/\(.*\)/)
            // const url = m[0].replace('(', '').replace(')', '')
            // opening tag
            return '<div class="iframe-container">\n'
          } else {
            // closing tag
            return '</div>\n'
          }
        },
      })
      .use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.headerLink(),
        // permalinkBefore: true,
        // permalinkSymbol: '', // §
      })
      .use(markdownItTocDoneRight, {
        level: 2,
      })
      .use(require('markdown-it-footnote'))
      .use(markdownItTextualUml)
    markdownRenderHelpers.default.functions.getTargetBlankLinkRender(md)
    const postIdTemp =
      '/blog/' +
      params.year +
      '/' +
      params.month +
      '/' +
      params.day +
      '/' +
      params.post +
      '/'
    if (payload) {
      // static page mode
      const fileContent = await import('~/static/blogdata/' + payload.path)
      const res = fm(fileContent.default)
      // console.log(res.attributes)
      return {
        postContent: md.render(res.body),
        postMetadata: payload,
        baseUrl: $config.baseURL,
        postId: postIdTemp,
        url: $config.baseURL + postIdTemp,
      }
    } else {
      // server mode
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [$config.baseURL])
      }
      const postMetadata = store.getters['BlogMetadata/getPostMetadata'](
        params.year,
        params.month,
        params.day,
        params.post
      )
      const fileContent = await axios
        .get($config.baseURL + '/blogdata/' + postMetadata.path)
        .catch(function (error) {
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
        postMetadata,
        baseUrl: $config.baseURL,
        postId: postIdTemp,
        url: $config.baseURL + '/' + postIdTemp,
      }
    }
  },
  data() {
    return {
      postContent: '',
    }
  },
  head() {
    /* const postMetadata = this.$store.getters['BlogMetadata/getPostMetadata'](
      this.$route.params.year,
      this.$route.params.month,
      this.$route.params.day,
      this.$route.params.post
    ) */
    const title =
      this.postMetadata.title +
      ' | ' +
      this.currentPage +
      ' || ' +
      this.appOwner
    const description = this.postMetadata.meta.description
    const keywordsArray = []
    const categoriesArray = []
    const tagsArray = []
    const authorsArray = []
    const authorsStructuredData = []
    this.postMetadata.categories.forEach((cat) => {
      categoriesArray.push(cat.name)
      keywordsArray.push(cat.name)
    })
    this.postMetadata.tags.forEach((tag) => {
      tagsArray.push(tag.name)
      keywordsArray.push(tag.name)
    })
    this.postMetadata.authors.forEach((author) => {
      authorsArray.push(author.name)
      keywordsArray.push(author.name)
      authorsStructuredData.push({
        '@type': 'Person',
        name: author.name,
      })
    })
    const keywords = keywordsArray.join()
    const tags = tagsArray.join()
    const category = categoriesArray[0]

    const datePublished = this.postMetadata['first-published-on']
    const dateModified = this.postMetadata['last-updated-on']
    const headline = this.postMetadata.title
    const articleBody = this.postMetadata.excerpt + ' ...'
    const structuredData = {
      '@context': 'http://schema.org',
      '@type': 'BlogPosting',
      datePublished,
      dateModified,
      headline,
      description,
      articleBody,
      genre: category,
      keywords,
      author: authorsStructuredData,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': this.url,
      },
      publisher: {
        '@type': 'Organization',
        name: this.appOwner + ' - Personal Website',
        logo: {
          '@type': 'ImageObject',
          url: this.baseUrl + '/images/android-chrome-512x512.png',
        },
      },
      image: this.baseUrl + '/images/android-chrome-512x512.png',
    }
    const breadcrumbsStructuredDataArray = this.breadcrumbs.map(
      (item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': this.baseUrl + item.to,
          name: item.text,
        },
      })
    )
    const breadcrumbsStructuredData = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbsStructuredDataArray,
    }
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: keywords,
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: title,
        },
        {
          hid: 'og-title',
          name: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og-url',
          name: 'og:url',
          property: 'og:url',
          content: this.url,
        },
        {
          hid: 'og-description',
          name: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og-type',
          name: 'og:type',
          property: 'og:type',
          content: 'article',
        },
        {
          name: 'og:article:section',
          property: 'og:article:section',
          content: category,
        },
        {
          name: 'og:article:tag',
          property: 'og:article:tag',
          content: tags,
        },
      ],
      link: [{ rel: 'canonical', href: this.url }],
      __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          innerHTML: JSON.stringify(structuredData),
          type: 'application/ld+json',
        },
        {
          innerHTML: JSON.stringify(breadcrumbsStructuredData),
          type: 'application/ld+json',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      appOwner: (state) => state.GlobalData.appOwner,
      currentPage: (state) => state.Navigation.blog.blogText,
      blogHref: (state) => state.Navigation.blog.blogItems[0].href,
      blogBaseHref: (state) => state.Navigation.blog.dynamicItems.blogBase.href,
    }),
    breadcrumbs() {
      return [
        {
          text: 'Home',
          disabled: false,
          to: '/',
          nuxt: true,
          exact: true,
        },
        {
          text: 'Blog',
          disabled: false,
          to: this.blogHref,
          nuxt: true,
          exact: true,
        },
        {
          text: this.postMetadata.title,
          disabled: false,
          to: this.postId,
          nuxt: true,
          exact: true,
        },
      ]
    },
  },
  mounted() {
    // if (mermaid == null) {
    //   mermaid = require('mermaid')
    // }
    mermaid.initialize({
      startOnLoad: true,
      theme: 'forest',
    })
  },
}
</script>

<style scoped></style>
