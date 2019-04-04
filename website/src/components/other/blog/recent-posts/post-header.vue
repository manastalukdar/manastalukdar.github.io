<template>
  <v-layout
    wrap
  >
    <v-flex xs12>
      <v-layout row justify-center wrap>
        <nuxt-link
          :to="{ name: 'blog-year-month-day-post', params: { year:postLinkSlugs.year, month:postLinkSlugs.month, day: postLinkSlugs.day, post: postLinkSlugs.post } }"
        >
          {{ postMetadata.title }}
        </nuxt-link>
      </v-layout>
      <!--<v-layout row justify-center wrap>
        Published: {{ postMetadata["first-published-on"] }}
      </v-layout>-->
    </v-flex>
  </v-layout>
</template>

<script>
export default {
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
