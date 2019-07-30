<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row justify="center">
          <h1>{{ monthText }}:&nbsp; {{ monthName }}</h1>
        </v-row>
      </v-col>
      <postsList :posts-list="blogMetadata" />
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import breadcrumbs from '../../../../components/breadcrumbs'
import postsList from '../../../../components/blog/posts-list/list.vue'
export default {
  validate({ params }) {
    // Must be a number and must be a year and a month
    return (
      /^\d+$/.test(params.month) &&
      moment(params.year, 'YYYY', true).isValid() &&
      moment(params.month, 'MM', true).isValid()
    )
  },
  components: {
    breadcrumbs,
    postsList
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state =>
        state.Navigation.blog.monthText +
        ' | ' +
        state.Navigation.blog.blogText,
      monthText: state => state.Navigation.blog.monthText,
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
          text: 'Blog Posts by Month',
          disabled: false,
          to: this.blogBaseHref + this.monthUrlSlug + '/',
          exact: true
        }
      ]
    }
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
      this.monthName + ' | ' + this.currentPage + ' || ' + this.appOwner
    const description = 'Blog posts on month ' + this.monthName
    const url = this.baseUrl + this.blogBaseHref + this.monthUrlSlug + '/'
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
