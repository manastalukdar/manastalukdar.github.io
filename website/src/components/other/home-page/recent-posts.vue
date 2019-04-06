<template>
  <v-layout column wrap>
    <v-flex xs12>
      <v-card
        color="blue-grey darken-4"
        class="pa-3"
        raised
        elevation="8"
        style="height:100%"
      >
        <recentPosts :items-to-display="itemsToDisplay" :posts-list="postsList" />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import recentPosts from '../blog/recent-posts/list.vue'
export default {
  components: {
    recentPosts
  },
  props: {
    postsList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data: () => ({
    itemsToDisplay: 5
  })
}
</script>
