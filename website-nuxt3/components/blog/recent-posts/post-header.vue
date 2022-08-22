<template>
  <div class="text-center" justify="center">
    <client-only>
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
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'pinia'
const dayjs = require('dayjs')
export default {
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
