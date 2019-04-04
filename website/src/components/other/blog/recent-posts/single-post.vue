<template>
  <v-layout
    wrap
  >
    <v-flex xs12>
      <postHeader :post-metadata="postMetadata" />
      <p />
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
    }
  }
}
</script>

<style>
</style>
