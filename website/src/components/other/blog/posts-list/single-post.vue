<template>
  <v-container>
    <v-layout
      wrap
    >
      <v-flex xs12>
        <v-card
          color="blue-grey darken-4"
          hover
          raised
          class="pa-3"
          nuxt
          :to="{ name: 'blog-year-month-day-post', params: { year:postLinkSlugs.year, month:postLinkSlugs.month, day: postLinkSlugs.day, post: postLinkSlugs.post } }"
        >
          <postHeader :post-metadata="postMetadata" />
          <p />
          {{ postMetadata.excerpt }}&nbsp;
          <nuxt-link
            :to="{ name: 'blog-year-month-day-post', params: { year:postLinkSlugs.year, month:postLinkSlugs.month, day: postLinkSlugs.day, post: postLinkSlugs.post } }"
          >
            <span>...read more</span>
          </nuxt-link>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import postHeader from './post-header.vue'
export default {
  components: {
    postHeader
  },
  props: {
    postMetadata: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    postLinkSlugs: function() {
      const items = this.postMetadata['first-published-on'].split('-')
      const year = items[0]
      const month = items[1]
      const day = items[2]
      const post = this.postMetadata['url-slug']
      return { year: year, month: month, day: day, post: post }
    }
  }
}
</script>

<style>
</style>
