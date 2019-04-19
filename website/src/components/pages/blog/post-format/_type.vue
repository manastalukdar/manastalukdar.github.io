<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-layout text-xs-justify wrap>
      <v-flex xs12>
        <v-layout row justify-center class="headline">
          {{ postFormatText }}:&nbsp; {{ postFormatType }}
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
        state.Navigation.blog.postFormatText,
      postFormatText: state => state.Navigation.blog.postFormatText,
      blogPostsHref: state => state.Navigation.blog.blogItems[0].href,
      blogDynamicItemsPostFormat: state =>
        state.Navigation.blog.dynamicItems.postFormat.href
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
          text: 'Blog Posts by Post-Format',
          disabled: false,
          to: this.blogDynamicItemsPostFormat + this.postFormatType + '/'
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
      this.currentPage + ' | ' + this.postFormatType + ' || ' + this.appOwner
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
      title: title,
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
