<template>
  <div class="py-4">
    <postHeader :post-metadata="postMetadata" />
  </div>
</template>

<script setup>
import postHeader from './post-header.vue'
defineProps({
  postMetadata: {
    type: Object,
    required: true,
    default() {
      return {}
    }
  },
})
</script>

<style></style>
