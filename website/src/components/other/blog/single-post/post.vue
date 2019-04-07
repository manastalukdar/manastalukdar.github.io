<template>
  <v-layout wrap>
    <v-layout wrap ma-2>
      <v-flex xs12>
        <v-card color="cardColorDark" raised class="pa-4">
          <postHeader :post-metadata="postMetadata" />
          <p />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="postContent" />
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout wrap ma-2>
      <v-flex xs12>
        <comments :post-id="postId" :url="url" />
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import postHeader from './post-header.vue'
import comments from './comments.vue'
export default {
  components: {
    postHeader,
    comments
  },
  props: {
    postMetadata: {
      type: Object,
      required: true,
      default: () => {}
    },
    postContent: {
      type: String,
      required: true,
      default: ''
    },
    url: {
      type: String,
      required: true,
      default: ''
    },
    postId: {
      type: String,
      required: true,
      default: ''
    }
  }
}
</script>

<style></style>
