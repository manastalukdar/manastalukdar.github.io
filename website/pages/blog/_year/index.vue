<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center" justify="center">
          <h1>{{ yearText }}:&nbsp; {{ yearName }}</h1>
        </v-row>
      </v-col>
      <postsList :posts-list="blogMetadata" />
    </v-row>
  </v-container>
</template>

<script>
import breadcrumbs from '../../../components/breadcrumbs'
import postsList from '../../../components/blog/posts-list/list.vue'
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  validate({ params }) {
    // Must be a number and must be a year
    return (
      /^\d+$/.test(params.year) && moment(params.year, 'YYYY', true).isValid()
    )
  },
  components: {
    breadcrumbs,
    postsList
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        yearUrlSlug: params.year,
        baseUrl: env.baseURL,
        blogMetadata: payload,
        yearName: params.year
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForYear'](params.year)
      if (posts === undefined) {
        return {
          yearUrlSlug: params.year,
          baseUrl: env.baseURL,
          blogMetadata: [],
          yearName: ''
        }
      }
      return {
        yearUrlSlug: params.year,
        baseUrl: env.baseURL,
        blogMetadata: posts,
        yearName: params.year
      }
    }
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state =>
        state.Navigation.blog.yearText + ' | ' + state.Navigation.blog.blogText,
      yearText: state => state.Navigation.blog.yearText,
      blogHref: state => state.Navigation.blog.blogItems[0].href,
      blogBaseHref: state => state.Navigation.blog.dynamicItems.blogBase.href
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
          text: 'Blog Posts by Year',
          disabled: false,
          to: this.blogBaseHref + this.yearUrlSlug + '/',
          exact: true
        }
      ]
    }
  },
  head() {
    const title =
      this.yearName + ' | ' + this.currentPage + ' || ' + this.appOwner
    const description = 'Blog posts on year ' + this.yearName
    const url = this.baseUrl + this.blogBaseHref + this.yearUrlSlug + '/'
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
