<template>
  <v-layout wrap class="text-xs-center">
    <v-flex xs12>
      <v-layout row justify-center wrap>
        <nuxt-link
          :to="
            getBlogPostRoute(
              postLinkSlugs.year,
              postLinkSlugs.month,
              postLinkSlugs.day,
              postLinkSlugs.post
            )
          "
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
import { mapState } from 'vuex'
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
    },
    ...mapState({
      dynamicBlogPostRoute: state =>
        state.Navigation.blog.dynamicItems.blogPost.href
    })
  },
  methods: {
    getBlogPostRoute(year, month, day, post) {
      return (
        this.dynamicBlogPostRoute +
        year +
        '/' +
        month +
        '/' +
        day +
        '/' +
        post +
        '/'
      )
    }
  }
}
</script>
