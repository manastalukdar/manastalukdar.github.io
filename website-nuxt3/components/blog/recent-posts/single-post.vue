<template>
  <div class="py-4">
    <postHeader :post-metadata="postMetadata" />
  </div>
</template>

<script>
import postHeader from './post-header.vue'
export default {
  components: {
    postHeader,
  },
  props: {
    postMetadata: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
}
</script>

<style></style>
