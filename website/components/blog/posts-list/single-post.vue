<template>
  <v-col cols="12">
    <v-card
      color="cardColor"
      hover
      class="py-3 px-5"
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
      <div class="col text-left">
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
      </div>
    </v-card>
  </v-col>
</template>

<script>
import { mapState } from 'vuex'
import postHeader from './post-header.vue'
const dayjs = require('dayjs')
export default {
  components: {
    postHeader,
  },
  props: {
    postMetadata: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  computed: {
    postLinkSlugs() {
      const dayjsObj = dayjs(this.postMetadata['first-published-on'])
      const year = dayjsObj.format('YYYY')
      const month = dayjsObj.format('MM')
      const day = dayjsObj.format('DD')
      const post = this.postMetadata['url-slug']
      return { year, month, day, post }
    },
    ...mapState({
      dynamicBlogPostRoute: (state) =>
        state.Navigation.blog.dynamicItems.blogPost.href,
    }),
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
    },
  },
}
</script>

<style></style>
