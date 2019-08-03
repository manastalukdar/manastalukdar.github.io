<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center" justify="center">
          <h1>{{ authorText }}:&nbsp; {{ authorName }}</h1>
        </v-row>
      </v-col>
      <postsList :posts-list="blogMetadata" />
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../../components/breadcrumbs'
import postsList from '../../../components/blog/posts-list/list.vue'
export default {
  components: {
    breadcrumbs,
    postsList
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state =>
        state.Navigation.blog.authorText +
        ' | ' +
        state.Navigation.blog.blogText,
      authorText: state => state.Navigation.blog.authorText,
      blogHref: state => state.Navigation.blog.blogItems[0].href,
      blogDynamicItemsAuthor: state =>
        state.Navigation.blog.dynamicItems.author.href
    }),
    breadcrumbs() {
      return [
        {
          text: 'Home',
          disabled: false,
          to: '/',
          exact: true
        },
        {
          text: 'Blog',
          disabled: false,
          to: this.blogHref,
          exact: true
        },
        {
          text: 'Blog Posts by Author',
          disabled: false,
          to: this.blogDynamicItemsAuthor + this.authorUrlSlug + '/',
          exact: true
        }
      ]
    }
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
      this.authorName + ' | ' + this.currentPage + ' || ' + this.appOwner
    const description = 'Blog posts by author ' + this.authorName
    const url =
      this.baseUrl + this.blogDynamicItemsAuthor + this.authorUrlSlug + '/'
    const breadcrumbsStructuredDataArray = this.breadcrumbs.map(
      (item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': this.baseUrl + item.to,
          name: item.text
        }
      })
    )
    const breadcrumbsStructuredData = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbsStructuredDataArray
    }
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
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
      link: [{ rel: 'canonical', href: url }],
      __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          innerHTML: JSON.stringify(breadcrumbsStructuredData),
          type: 'application/ld+json'
        }
      ]
    }
  }
}
</script>

<style></style>
