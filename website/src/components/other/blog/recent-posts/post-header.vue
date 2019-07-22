<template>
  <v-row class="text-center" justify="center">
    <NoSsr>
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
    </NoSsr>
  </v-row>
</template>

<script>
import moment from 'moment'
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
