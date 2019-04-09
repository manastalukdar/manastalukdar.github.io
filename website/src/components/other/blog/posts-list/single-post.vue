<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12>
        <v-card
          :color="cardColor"
          hover
          class="pa-3"
          nuxt
          :to="
            getBlogPostRoute(
              postLinkSlugs.year,
              postLinkSlugs.month,
              postLinkSlugs.day,
              postLinkSlugs.post
            )
          "
        >
          <postHeader :post-metadata="postMetadata" />
          <p />
          {{ postMetadata.excerpt }}&nbsp;
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
            <span>...read more</span>
          </nuxt-link>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
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
    },
    cardColor() {
      return this.$store.getters['GlobalData/getCardColor']
    },
    ...mapState({
      dynamicBlogPostRoute: state =>
        state.MainNavMenu.blog.dynamicItems.blogPost.href
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

<style></style>
