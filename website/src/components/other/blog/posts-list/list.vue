<template>
  <v-layout
    wrap
  >
    <v-flex xs12>
      <div
        v-for="post in postsList"
        :key="post['path']"
      >
        <singlePost :post-metadata="post" />
        <hr>
      </div>
    </v-flex>
    <v-layout justify-center class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages" />
    </v-layout>
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
    }
  },
  data: () => ({
    pagination: {
      itemsPerPage: 5
    }
  }),
  computed: {
    pages() {
      return this.pagination.itemsPerPage
        ? Math.ceil(this.postsList.length / this.pagination.itemsPerPage)
        : 0
    }
  }
}
</script>
