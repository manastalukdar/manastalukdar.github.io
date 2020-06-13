<template>
  <v-col cols="12" class="px-0">
    <v-card color="cardColor" raised elevation="8" class="pa-4">
      <div class="comments">
        <Disqus :identifier="postId" :url="url" />
      </div>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: {
    postId: {
      type: String,
      required: true,
      default: '',
    },
    url: {
      type: String,
      required: true,
      default: '',
    },
  },
}
</script>

<style></style>
