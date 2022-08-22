<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center py-2" justify="center">
          <h1>{{ postFormatText }}:&nbsp; {{ postFormatType }}</h1>
        </v-row>
      </v-col>
      <client-only>
        <postsList :posts-list="blogMetadata" />
      </client-only>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import breadcrumbs from '../../../components/breadcrumbs'
import postsList from '../../../components/blog/posts-list/list.vue'
export default {
  components: {
    breadcrumbs,
    postsList,
  },
  async useAsyncData ({ store, params, $config, payload }) {
    if (payload) {
      const postFormatTypeTemp = payload[0]['post-format'].name
      return {
        postFormatUrlSlug: params.type,
        baseUrl: $config.baseURL,
        blogMetadata: payload,
        postFormatType: postFormatTypeTemp,
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [$config.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForPostFormat'](
        params.type
      )
      if (posts === undefined) {
        return {
          postFormatUrlSlug: params.type,
          baseUrl: $config.baseURL,
          blogMetadata: [],
          authorName: '',
        }
      }
      const postFormatTypeTemp = posts[0]['post-format'].name
      return {
        postFormatUrlSlug: params.type,
        baseUrl: $config.baseURL,
        blogMetadata: posts,
        postFormatType: postFormatTypeTemp,
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
          content: 'Blog posts of format ' + this.postFormatType,
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
          name: ':description',
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
        state.Navigation.blog.postFormatText +
        ' | ' +
        state.Navigation.blog.blogText,
      postFormatText: (state) => state.Navigation.blog.postFormatText,
      blogHref: (state) => state.Navigation.blog.blogItems[0].href,
      blogDynamicItemsPostFormat: (state) =>
        state.Navigation.blog.dynamicItems.postFormat.href,
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
          text: 'Blog Posts by Post-Format',
          disabled: false,
          to: this.blogDynamicItemsPostFormat + this.postFormatType + '/',
          exact: true,
        },
      ]
    },
  },
}
</script>

<style></style>
