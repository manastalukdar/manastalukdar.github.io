<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center py-2" justify="center">
          <h1>{{ tagText }}:&nbsp; {{ tagName }}</h1>
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
import breadcrumbs from '../../../components/breadcrumbs'
import postsList from '../../../components/blog/posts-list/list.vue'
export default {
  components: {
    breadcrumbs,
    postsList,
  },
  async asyncData({ store, params, $config, payload }) {
    if (payload) {
      const tagNameTemp = payload[0].tags.filter((tag) => {
        if (tag['url-slug'] === params.name) {
          return tag.name
        }
        return ''
      })
      return {
        tagUrlSlug: params.name,
        baseUrl: $config.baseURL,
        blogMetadata: payload,
        tagName: tagNameTemp[0].name,
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [$config.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForTag'](params.name)
      if (posts === undefined) {
        return {
          tagUrlSlug: params.name,
          baseUrl: $config.baseURL,
          blogMetadata: [],
          authorName: '',
        }
      }
      const tagNameTemp = posts[0].tags.filter((tag) => {
        if (tag['url-slug'] === params.name) {
          return tag.name
        }
        return ''
      })
      return {
        tagUrlSlug: params.name,
        baseUrl: $config.baseURL,
        blogMetadata: posts,
        tagName: tagNameTemp[0].name,
      }
    }
  },
  head() {
    const title =
      this.tagName + ' | ' + this.currentPage + ' || ' + this.appOwner
    const description = 'Blog posts with tag ' + this.tagName
    const url = this.baseUrl + this.blogDynamicItemsTag + this.tagUrlSlug + '/'
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
        state.Navigation.blog.tagText + ' | ' + state.Navigation.blog.blogText,
      tagText: (state) => state.Navigation.blog.tagText,
      blogHref: (state) => state.Navigation.blog.blogItems[0].href,
      blogDynamicItemsTag: (state) =>
        state.Navigation.blog.dynamicItems.tag.href,
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
          text: 'Blog Posts by Tag',
          disabled: false,
          to: this.blogDynamicItemsTag + this.tagUrlSlug + '/',
          exact: true,
        },
      ]
    },
  },
}
</script>

<style></style>
