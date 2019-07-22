<template>
  <v-col cols="12">
    <v-row class="title" justify="center">
      {{ pageTitle }}
    </v-row>
    <p />
    <v-row justify="center">
      <div v-for="post in posts" :key="post['name']">
        <singlePost :post-metadata="post" />
      </div>
    </v-row>
  </v-col>
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
    posts() {
      return this.postsList.slice(0, this.itemsToDisplay)
    }
  }
}
</script>
