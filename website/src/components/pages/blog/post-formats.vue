<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-layout text-xs-justify wrap>
      <v-flex xs12>
        <v-layout row justify-center headline>
          {{ pageTitle }}
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <v-card class="ma-3 pa-2" raised elevation="8">
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="postFormats"
            :search="search"
          >
            <template v-slot:items="props">
              <td>
                <nuxt-link :to="getLink([props.item.slug])">{{
                  props.item.name
                }}</nuxt-link
                >&nbsp;<v-icon>{{ getPostFormatIcon(props.item.name) }}</v-icon>
              </td>
              <td class="text-xs-right">{{ props.item.count }}</td>
            </template>
            <v-alert
              v-slot:no-results
              :value="true"
              color="error"
              icon="warning"
            >
              Your search for "{{ search }}" found no results.
            </v-alert>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../other/breadcrumbs'
export default {
  components: {
    breadcrumbs
  },
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Post Format',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'Number of posts', align: 'right', value: 'count' }
      ]
    }
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state =>
        state.Navigation.blog.blogText +
        ' | ' +
        state.Navigation.blog.blogItems[3].text,
      blogMetadata: state => state.BlogMetadata.blogMetadata,
      pageTitle: state => state.Navigation.blog.blogItems[3].text,
      blogPostsHref: state => state.Navigation.blog.blogItems[0].href,
      currentHref: state => state.Navigation.blog.blogItems[3].href,
      postFormatsText: state => state.Navigation.blog.blogItems[3].text,
      blogDynamicItemsPostFormats: state =>
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
          text: this.postFormatsText,
          disabled: false,
          to: this.currentHref
        }
      ]
    },
    cardColor() {
      return this.$store.getters['GlobalData/getCardColor']
    }
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        baseUrl: env.baseURL,
        postFormats: payload
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const postFormats = store.getters['BlogMetadata/getPostFormats']
      if (postFormats === undefined) {
        return {
          baseUrl: env.baseURL,
          postFormats: []
        }
      }
      return {
        baseUrl: env.baseURL,
        postFormats: postFormats
      }
    }
  },
  methods: {
    getLink(postFormatsSlug) {
      return this.blogDynamicItemsPostFormats + postFormatsSlug + '/'
    },
    getPostFormatIcon(name) {
      return this.$store.getters['BlogMetadata/getPostFormatIcon'](name)
    }
  },
  head() {
    const title = this.currentPage + ' || ' + this.appOwner
    const description = 'List of all post formats from blog.'
    const url = this.baseUrl + this.currentHref
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
