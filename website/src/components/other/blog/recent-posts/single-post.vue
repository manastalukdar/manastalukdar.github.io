<template>
  <v-col>
    <postHeader :post-metadata="postMetadata" />
  </v-col>
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

<style></style>
