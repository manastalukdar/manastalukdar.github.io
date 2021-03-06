<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center" justify="center">
          <h1>{{ dayText }}:&nbsp; {{ dayName }}</h1>
        </v-row>
      </v-col>
      <postsList :posts-list="blogMetadata" />
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../../../../components/breadcrumbs'
import postsList from '../../../../../components/blog/posts-list/list.vue'
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
export default {
  components: {
    breadcrumbs,
    postsList,
  },
  validate({ params }) {
    // Must be a number and must be a year, month and day
    return (
      /^\d+$/.test(params.year) &&
      dayjs(params.year, 'YYYY', true).isValid() &&
      dayjs(params.month, 'MM', true).isValid() &&
      dayjs(params.day, 'DD', true).isValid()
    )
  },
  async asyncData({ store, params, $config, payload }) {
    if (payload) {
      return {
        dayUrlSlug: params.year + '/' + params.month + '/' + params.day,
        baseUrl: $config.baseURL,
        blogMetadata: payload,
        dayName: params.year + '-' + params.month + '-' + params.day,
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [$config.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForDay'](
        params.year,
        params.month,
        params.day
      )
      if (posts === undefined) {
        return {
          dayUrlSlug: params.year + '/' + params.month + '/' + params.day,
          baseUrl: $config.baseURL,
          blogMetadata: [],
          dayName: '',
        }
      }
      return {
        dayUrlSlug: params.year + '/' + params.month + '/' + params.day,
        baseUrl: $config.baseURL,
        blogMetadata: posts,
        dayName: params.year + '-' + params.month + '-' + params.day,
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
          content: url,
        },
        {
          hid: 'og-description',
          name: 'og:description',
          property: 'og:description',
          content: description,
        },
      ],
      link: [{ rel: 'canonical', href: url }],
      __dangerouslyDisableSanitizers: ['script'],
      script: [
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
      currentPage: (state) =>
        state.Navigation.blog.dayText + ' | ' + state.Navigation.blog.blogText,
      dayText: (state) => state.Navigation.blog.dayText,
      blogHref: (state) => state.Navigation.blog.blogItems[0].href,
      blogBaseHref: (state) => state.Navigation.blog.dynamicItems.blogBase.href,
    }),
    breadcrumbs() {
      return [
        {
          text: 'Home',
          disabled: false,
          to: '/',
          exact: true,
        },
        {
          text: 'Blog',
          disabled: false,
          to: this.blogHref,
          exact: true,
        },
        {
          text: 'Blog Posts by Day',
          disabled: false,
          to: this.blogBaseHref + this.dayUrlSlug + '/',
          exact: true,
        },
      ]
    },
  },
}
</script>

<style></style>
