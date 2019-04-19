<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-layout text-xs-justify wrap>
      <v-flex xs12>
        <v-layout row justify-center class="headline">
          {{ categoryText }}:&nbsp; {{ categoryName }}
        </v-layout>
      </v-flex>
      <postsList :posts-list="blogMetadata" />
    </v-layout>
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
        state.Navigation.blog.blogText +
        ' | ' +
        state.Navigation.blog.categoryText,
      categoryText: state => state.Navigation.blog.categoryText,
      blogPostsHref: state => state.Navigation.blog.blogItems[0].href,
      blogDynamicItemsCategory: state =>
        state.Navigation.blog.dynamicItems.category.href
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
          text: 'Blog Posts by Category',
          disabled: false,
          to: this.blogDynamicItemsCategory + this.categoryUrlSlug + '/'
        }
      ]
    }
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      const catName = payload[0].categories.filter(category => {
        if (category['url-slug'] === params.name) {
          return category.name
        }
      })
      return {
        categoryUrlSlug: params.name,
        baseUrl: env.baseURL,
        blogMetadata: payload,
        categoryName: catName[0].name
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const posts = store.getters['BlogMetadata/getPostsForCategory'](
        params.name
      )
      if (posts === undefined) {
        return {
          categoryUrlSlug: params.name,
          baseUrl: env.baseURL,
          blogMetadata: [],
          authorName: ''
        }
      }
      const catName = posts[0].categories.filter(category => {
        if (category['url-slug'] === params.name) {
          return category.name
        }
      })
      return {
        categoryUrlSlug: params.name,
        baseUrl: env.baseURL,
        blogMetadata: posts,
        categoryName: catName[0].name
      }
    }
  },
  head() {
    const title =
      this.currentPage + ' | ' + this.categoryName + ' || ' + this.appOwner
    const description = 'Blog posts in category ' + this.categoryName
    const url =
      this.baseUrl + this.blogDynamicItemsCategory + this.categoryUrlSlug + '/'
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
