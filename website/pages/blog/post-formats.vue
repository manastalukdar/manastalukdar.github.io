<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center" justify="center">
          <h1>
            {{ pageTitle }}
          </h1>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-card class="my-3 pa-2" color="cardColor" raised elevation="8">
          <v-card-title>
            <div class="flex-grow-1"></div>
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
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.slug">
                  <td>
                    <nuxt-link :to="getLink([item.slug])">{{
                      item.name
                    }}</nuxt-link
                    >&nbsp;&nbsp;&nbsp;&nbsp;<v-icon>{{
                      getPostFormatIcon(item.name)
                    }}</v-icon>
                  </td>
                  <td class="text-right">{{ item.count }}</td>
                </tr>
              </tbody>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../components/breadcrumbs'
export default {
  components: {
    breadcrumbs
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
        postFormats
      }
    }
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
        state.Navigation.blog.blogItems[3].text +
        ' | ' +
        state.Navigation.blog.blogText,
      blogMetadata: state => state.BlogMetadata.blogMetadata,
      pageTitle: state => state.Navigation.blog.blogItems[3].text,
      blogHref: state => state.Navigation.blog.blogItems[0].href,
      currentHref: state => state.Navigation.blog.blogItems[3].href,
      postFormatsText: state => state.Navigation.blog.blogItems[3].text,
      blogDynamicItemsPostFormats: state =>
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
          text: this.postFormatsText,
          disabled: false,
          to: this.currentHref,
          exact: true
        }
      ]
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
      title,
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
