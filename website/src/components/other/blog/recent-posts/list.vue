<template>
  <v-layout
    wrap
  >
    <v-flex xs12>
      <v-layout row justify-center title>
        {{ pageTitle }}
      </v-layout>
    </v-flex>
    <v-flex xs12 py-2>
      <div
        v-for="post in posts"
        :key="post['name']"
      >
        <singlePost :post-metadata="post" />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import singlePost from './single-post.vue'
export default {
  components: {
    singlePost
  },
  props: {
    postsList: {
      type: Array,
      required: true,
      default: () => []
    },
    itemsToDisplay: {
      type: Number,
      required: true,
      default: 5
    }
  },
  data: () => ({
    pageTitle: 'Recent Posts'
  }),
  computed: {
    posts: function() {
      return this.postsList.slice(0, this.itemsToDisplay)
    }
  }
}
</script>
