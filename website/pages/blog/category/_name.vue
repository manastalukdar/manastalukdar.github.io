<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center" justify="center">
          <h1>{{ categoryText }}:&nbsp; {{ categoryName }}</h1>
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
      const catName = payload[0].categories.filter((category) => {
        if (category['url-slug'] === params.name) {
          return category.name
        }
        return ''
      })
      return {
        categoryUrlSlug: params.name,
        baseUrl: $config.baseURL,
        blogMetadata: payload,
        categoryName: catName[0].name,
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [$config.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForCategory'](
        params.name
      )
      if (posts === undefined) {
        return {
          categoryUrlSlug: params.name,
          baseUrl: $config.baseURL,
          blogMetadata: [],
          authorName: '',
        }
      }
      const catName = posts[0].categories.filter((category) => {
        if (category['url-slug'] === params.name) {
          return category.name
        }
        return ''
      })
      return {
        categoryUrlSlug: params.name,
        baseUrl: $config.baseURL,
        blogMetadata: posts,
        categoryName: catName[0].name,
      }
    }
  },
  head() {
    const title =
      this.categoryName + ' | ' + this.currentPage + ' || ' + this.appOwner
    const description = 'Blog posts in category ' + this.categoryName
    const url =
      this.baseUrl + this.blogDynamicItemsCategory + this.categoryUrlSlug + '/'
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
        state.Navigation.blog.categoryText +
        ' | ' +
        state.Navigation.blog.blogText,
      categoryText: (state) => state.Navigation.blog.categoryText,
      blogHref: (state) => state.Navigation.blog.blogItems[0].href,
      blogDynamicItemsCategory: (state) =>
        state.Navigation.blog.dynamicItems.category.href,
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
          text: 'Blog Posts by Category',
          disabled: false,
          to: this.blogDynamicItemsCategory + this.categoryUrlSlug + '/',
          exact: true,
        },
      ]
    },
  },
}
</script>

<style></style>
