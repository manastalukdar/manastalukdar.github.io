<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-layout text-xs-justify wrap>
      <v-flex xs12>
        <v-layout row justify-center>
          <h1>
            {{ pageTitle }}
          </h1>
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
            :items="tags"
            :search="search"
            :items-per-page="5"
          >
            <template v-slot:items="props">
              <tbody>
                <tr v-for="item in props" :key="item.slug">
                  <td>
                    <nuxt-link :to="getLink([item.slug])">{{
                      item.name
                    }}</nuxt-link>
                  </td>
                  <td class="text-xs-right">{{ item.count }}</td>
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
          text: 'Tag',
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
        state.Navigation.blog.blogItems[2].text +
        ' | ' +
        state.Navigation.blog.blogText,
      blogMetadata: state => state.BlogMetadata.blogMetadata,
      pageTitle: state => state.Navigation.blog.blogItems[2].text,
      blogPostsHref: state => state.Navigation.blog.blogItems[0].href,
      currentHref: state => state.Navigation.blog.blogItems[2].href,
      tagsText: state => state.Navigation.blog.blogItems[2].text,
      blogDynamicItemsTag: state => state.Navigation.blog.dynamicItems.tag.href
    }),
    breadcrumbs() {
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
          text: this.tagsText,
          disabled: false,
          to: this.currentHref
        }
      ]
    }
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        baseUrl: env.baseURL,
        tags: payload
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      const tags = store.getters['BlogMetadata/getTags']
      if (tags === undefined) {
        return {
          baseUrl: env.baseURL,
          tags: []
        }
      }
      return {
        baseUrl: env.baseURL,
        tags
      }
    }
  },
  methods: {
    getLink(tagSlug) {
      return this.blogDynamicItemsTag + tagSlug + '/'
    }
  },
  head() {
    const title = this.currentPage + ' || ' + this.appOwner
    const description = 'List of all tags from blog.'
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
