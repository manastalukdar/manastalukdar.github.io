<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row justify="center">
          <h1>{{ postFormatText }}:&nbsp; {{ postFormatType }}</h1>
        </v-row>
      </v-col>
      <postsList :posts-list="blogMetadata" />
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../../other/breadcrumbs'
import postsList from '../../../other/blog/posts-list/list.vue'
export default {
  components: {
    breadcrumbs,
    postsList
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state =>
        state.Navigation.blog.postFormatText +
        ' | ' +
        state.Navigation.blog.blogText,
      postFormatText: state => state.Navigation.blog.postFormatText,
      blogHref: state => state.Navigation.blog.blogItems[0].href,
      blogDynamicItemsPostFormat: state =>
        state.Navigation.blog.dynamicItems.postFormat.href
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
          text: 'Blog Posts by Post-Format',
          disabled: false,
          to: this.blogDynamicItemsPostFormat + this.postFormatType + '/',
          exact: true
        }
      ]
    }
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      const postFormatTypeTemp = payload[0]['post-format'].name
      return {
        postFormatUrlSlug: params.type,
        baseUrl: env.baseURL,
        blogMetadata: payload,
        postFormatType: postFormatTypeTemp
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForPostFormat'](
        params.type
      )
      if (posts === undefined) {
        return {
          postFormatUrlSlug: params.type,
          baseUrl: env.baseURL,
          blogMetadata: [],
          authorName: ''
        }
      }
      const postFormatTypeTemp = posts[0]['post-format'].name
      return {
        postFormatUrlSlug: params.type,
        baseUrl: env.baseURL,
        blogMetadata: posts,
        postFormatType: postFormatTypeTemp
      }
    }
  },
  head() {
    const title =
      this.postFormatType + ' | ' + this.currentPage + ' || ' + this.appOwner
    const description = 'Blog posts of format ' + this.postFormatType
    const url =
      this.baseUrl + this.blogDynamicItemsPostFormat + this.postFormatType + '/'
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
          content: 'Blog posts of format ' + this.postFormatType
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
          name: ':description',
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
