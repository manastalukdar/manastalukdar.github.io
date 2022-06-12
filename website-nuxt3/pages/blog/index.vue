<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center py-2" justify="center">
          <h1>
            {{ pageTitle }}
          </h1>
        </v-row>
      </v-col>
      <client-only>
        <postsList :posts-list="blogMetadata" />
      </client-only>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../components/breadcrumbs'
import postsList from '../../components/blog/posts-list/list.vue'
export default {
  components: {
    breadcrumbs,
    postsList,
  },
  async useAsyncData ({ store, params, $config, payload }) {
    if (payload) {
      return {
        baseUrl: $config.baseURL,
        blogMetadata: payload,
      }
    } else if (store.state.BlogMetadata.blogMetadata.length === 0) {
      await store.dispatch('BlogMetadata/getBlogMetadata', [$config.baseURL])
      return {
        baseUrl: $config.baseURL,
      }
    }
  },
  head() {
    const title = this.currentPage + ' || ' + this.appOwner
    const description = 'Reflections on software engineering and other matters.'
    const url = this.baseUrl + this.currentHref
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
      currentPage: (state) => state.Navigation.blog.blogItems[0].text,
      blogMetadata: (state) => state.BlogMetadata.blogMetadata,
      pageTitle: (state) => state.Navigation.blog.blogText,
      currentHref: (state) => state.Navigation.blog.blogItems[0].href,
    }),
    breadcrumbs() {
      return [
        {
          text: 'Home',
          disabled: false,
          to: '/',
        },
        {
          text: 'Blog',
          disabled: false,
          to: this.currentHref,
        },
      ]
    },
  },
}
</script>

<style></style>
