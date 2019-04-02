<template>
  <v-container>
    <v-layout
      wrap
    >
      <v-flex xs12>
        <postHeader :post-metadata="postMetadata" />
        <p />
        {{ postMetadata.excerpt }}
      </v-flex>
    </v-layout>
  </v-container>
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
