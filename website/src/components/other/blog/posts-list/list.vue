<template>
  <v-layout
    wrap
  >
    <v-flex xs12>
      <v-data-iterator
        :items="postsList"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        content-tag="v-layout"
        row
        wrap
      >
        <template v-slot:item="props">
          <singlePost :post-metadata="props.item" />
          <hr>
        </template>
      </v-data-iterator>
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
    }
  },
  data: () => ({
    rowsPerPageItems: [1, 5, 10],
    pagination: {
      rowsPerPage: 5
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
