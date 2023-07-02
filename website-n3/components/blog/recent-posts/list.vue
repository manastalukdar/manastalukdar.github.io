<template>
  <div class="px-3 py-3">
    <v-row class="text-h6" justify="center">
      {{ pageTitle }}
    </v-row>
    <p />
    <v-row
      v-for="post in posts"
      :key="post['url-slug']"
      class="px-2"
      justify="center"
    >
      <singlePost :post-metadata="post" />
    </v-row>
  </div>
</template>

<script>
import singlePost from './single-post.vue'
export default {
  components: {
    singlePost,
  },
  props: {
    postsList: {
      type: Array,
      required: true,
      default: () => [],
    },
    itemsToDisplay: {
      type: Number,
      required: true,
      default: 5,
    },
  },
  data: () => ({
    pageTitle: 'Recent Posts',
  }),
  computed: {
    posts() {
      console.log(this.postsList.slice(0, this.itemsToDisplay)[0])
      return this.postsList.slice(0, this.itemsToDisplay)
    },
  },
}
</script>
