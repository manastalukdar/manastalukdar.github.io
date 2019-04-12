<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-layout wrap>
      <v-flex xs12>
        This a personal website and has nothing to do with my employers, past
        and present. Any content here does not constitute endorsement or
        guarantees of anything. I hold the right to determine exclusions to this
        disclaimer. My resume provided via this site being an obvious exclusion.
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../other/breadcrumbs'
export default {
  components: {
    breadcrumbs
  },
  data: function() {
    return {
      description: 'Legal disclaimer.',
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/'
        },
        {
          text: 'Legal',
          disabled: true,
          href: '/Legal/' // currentHref
        }
      ]
    }
  },
  computed: mapState({
    appOwner: state => state.GlobalData.appOwner,
    currentPage: state => state.Navigation.legal.legalText,
    currentHref: state => state.Navigation.legal.legalPath
  }),
  asyncData({ store, params, env, payload }) {
    return {
      baseUrl: env.baseURL
    }
  },
  head() {
    const title = this.currentPage + ' || ' + this.appOwner
    const url = this.baseUrl + this.currentHref
    return {
      title: title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description
        },
        {
          hid: 'title',
          name: 'title',
          content: title
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
          content: this.description
        }
      ],
      link: [{ rel: 'canonical', href: url }]
    }
  }
}
</script>

<style></style>
