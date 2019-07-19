<template>
  <v-layout wrap>
    <v-flex xs12 py-2>
      <v-data-iterator
        :items="postsList"
        :items-per-page.sync="itemsPerPage"
        :footer-props="{ itemsPerPageOptions }"
        row
        wrap
      >
        <template v-slot:item="props">
          <singlePost :post-metadata="props.item" />
          <!--<hr>-->
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
    itemsPerPageOptions: [5, 10],
    itemsPerPage: 5
  })
}
</script>
