<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12>
        <v-card
          color="cardColor"
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
import moment from 'moment'
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
    postLinkSlugs() {
      const momentObj = moment(this.postMetadata['first-published-on'])
      const year = momentObj.format('YYYY')
      const month = momentObj.format('MM')
      const day = momentObj.format('DD')
      const post = this.postMetadata['url-slug']
      return { year, month, day, post }
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

<style></style>
