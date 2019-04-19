<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-layout text-xs-justify wrap>
      <v-flex xs12>
        <v-layout row justify-center class="headline">
          {{ monthText }}:&nbsp; {{ monthName }}
        </v-layout>
      </v-flex>
      <postsList :posts-list="blogMetadata" />
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../../../other/breadcrumbs'
import postsList from '../../../../other/blog/posts-list/list.vue'
export default {
  components: {
    breadcrumbs,
    postsList
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state =>
        state.Navigation.blog.blogText +
        ' | ' +
        state.Navigation.blog.monthText,
      monthText: state => state.Navigation.blog.monthText,
      blogPostsHref: state => state.Navigation.blog.blogItems[0].href,
      blogBaseHref: state => state.Navigation.blog.dynamicItems.blogBase.href
    }),
    breadcrumbs: function() {
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
          text: 'Blog Posts by Month',
          disabled: false,
          to: this.blogBaseHref + this.monthUrlSlug + '/'
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
      this.currentPage + ' | ' + this.monthName + ' || ' + this.appOwner
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
      title: title,
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
