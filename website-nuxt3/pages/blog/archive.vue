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
      <v-col cols="12">
        <v-card class="my-3 pa-2" color="cardColor" raised elevation="8">
          <v-card-title>
            <div class="flex-grow-1" />
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            />
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="blogMetadata"
            :search="search"
            :items-per-page="5"
          >
            <template #body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.slug">
                  <td>
                    <nuxt-link
                      :to="
                        getLink(item['first-published-on'], item['url-slug'])
                      "
                    >
                      {{ item.title }}
                    </nuxt-link>
                  </td>
                </tr>
              </tbody>
            </template>
            <template #no-results :value="true" color="error" icon="warning">
              <v-alert>
                Your search for "{{ search }}" found no results.
              </v-alert>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../components/breadcrumbs'
const dayjs = require('dayjs')
export default {
  components: {
    breadcrumbs,
  },
  async useAsyncData ({ store, params, $config, payload }) {
    if (payload) {
      return {
        baseUrl: $config.baseURL,
        blogMetadata: payload,
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [$config.baseURL])
      }
      return {
        baseUrl: $config.baseURL,
      }
    }
  },
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Post Title',
          align: 'left',
          sortable: true,
          value: 'title',
        },
      ],
    }
  },
  head() {
    const title = this.currentPage + ' || ' + this.appOwner
    const description = 'List of all blog posts.'
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
      currentPage: (state) =>
        state.Navigation.blog.blogItems[4].text +
        ' | ' +
        state.Navigation.blog.blogText,
      blogMetadata: (state) => state.BlogMetadata.blogMetadata,
      pageTitle: (state) => state.Navigation.blog.blogItems[4].text,
      blogHref: (state) => state.Navigation.blog.blogItems[0].href,
      currentHref: (state) => state.Navigation.blog.blogItems[4].href,
      archiveText: (state) => state.Navigation.blog.blogItems[4].text,
      blogDynamicItemsBlogPost: (state) =>
        state.Navigation.blog.dynamicItems.blogPost.href,
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
          text: this.archiveText,
          disabled: false,
          to: this.currentHref,
          exact: true,
        },
      ]
    },
  },
  methods: {
    getLink(firstPublishedOn, postSlug) {
      const dayjsObj = dayjs(firstPublishedOn)
      const yearSlug = dayjsObj.format('YYYY')
      const monthSlug = dayjsObj.format('MM')
      const dateSlug = dayjsObj.format('DD')
      return (
        this.blogDynamicItemsBlogPost +
        yearSlug +
        '/' +
        monthSlug +
        '/' +
        dateSlug +
        '/' +
        postSlug +
        '/'
      )
    },
  },
}
</script>

<style></style>
