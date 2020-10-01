<template>
  <v-row>
    <v-col class="py-2" cols="12">
      <v-data-iterator
        :items="postsList"
        :items-per-page.sync="itemsPerPage"
        :footer-props="{ itemsPerPageOptions }"
        row
        wrap
      >
        <template #item="props">
          <singlePost :post-metadata="props.item" />
          <!--<hr>-->
        </template>
      </v-data-iterator>
    </v-col>
  </v-row>
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
  },
  data: () => ({
    itemsPerPageOptions: [5, 10],
    itemsPerPage: 5,
  }),
}
</script>
