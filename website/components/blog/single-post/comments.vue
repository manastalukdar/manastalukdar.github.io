<template>
  <v-col cols="12" class="px-0">
    <v-card color="cardColor" raised elevation="8" class="pa-6">
      <div class="comments" aria-labelledby="comment">
        <DisqusComments :identifier="postId" :url="url" />
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
