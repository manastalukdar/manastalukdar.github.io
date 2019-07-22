<template>
  <v-container>
    <v-card
      color="cardColor"
      class="pa-3"
      raised
      elevation="8"
      style="height:100%"
      :to="blogItems[0].href"
    >
      <recentPosts :items-to-display="itemsToDisplay" :posts-list="postsList" />
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
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
  }),
  computed: {
    ...mapState({
      blogItems: state => state.Navigation.blog.blogItems
    })
  }
}
</script>
