<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-layout text-xs-justify wrap>
      <v-flex xs12>
        <v-layout row justify-center>
          <h1>{{ dayText }}:&nbsp; {{ dayName }}</h1>
        </v-layout>
      </v-flex>
      <postsList :posts-list="blogMetadata" />
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../../../../other/breadcrumbs'
import postsList from '../../../../../other/blog/posts-list/list.vue'
export default {
  components: {
    breadcrumbs,
    postsList
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state =>
        state.Navigation.blog.dayText + ' | ' + state.Navigation.blog.blogText,
      dayText: state => state.Navigation.blog.dayText,
      blogPostsHref: state => state.Navigation.blog.blogItems[0].href,
      blogBaseHref: state => state.Navigation.blog.dynamicItems.blogBase.href
    }),
    breadcrumbs() {
      return [
        {
          text: 'Home',
          disabled: false,
          to: '/'
        },
        {
          text: 'Blog Posts',
          disabled: false,
          to: this.blogPostsHref
        },
        {
          text: 'Blog Posts by Day',
          disabled: false,
          to: this.blogBaseHref + this.dayUrlSlug + '/'
        }
      ]
    }
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        dayUrlSlug: params.year + '/' + params.month + '/' + params.day,
        baseUrl: env.baseURL,
        blogMetadata: payload,
        dayName: params.year + '-' + params.month + '-' + params.day
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForDay'](
        params.year,
        params.month,
        params.day
      )
      if (posts === undefined) {
        return {
          dayUrlSlug: params.year + '/' + params.month + '/' + params.day,
          baseUrl: env.baseURL,
          blogMetadata: [],
          dayName: ''
        }
      }
      return {
        dayUrlSlug: params.year + '/' + params.month + '/' + params.day,
        baseUrl: env.baseURL,
        blogMetadata: posts,
        dayName: params.year + '-' + params.month + '-' + params.day
      }
    }
  },
  head() {
    const title =
      this.dayName + ' | ' + this.currentPage + ' || ' + this.appOwner
    const description = 'Blog posts on day ' + this.dayName
    const url = this.baseUrl + this.blogBaseHref + this.dayUrlSlug + '/'
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
