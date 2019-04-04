<template>
  <v-layout
    wrap
  >
    <v-flex xs12>
      <v-card
        color="blue-grey darken-4"
        raised
        class="pa-4"
      >
        <postHeader :post-metadata="postMetadata" />
        <p />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="postContent" />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import postHeader from './post-header.vue'
export default {
  components: {
    postHeader
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
    }
  }
}
</script>

<style>
</style>
