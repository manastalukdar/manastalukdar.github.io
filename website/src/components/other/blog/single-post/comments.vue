<template>
  <v-row>
    <v-col cols="12">
      <v-card color="cardColor" raised elevation="8" class="pa-4">
        <div class="comments">
          <vue-disqus
            :shortname="disqusShortname"
            :identifier="postId"
            :url="url"
          />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    postId: {
      type: String,
      required: true,
      default: ''
    },
    url: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      disqusShortname: 'manastalukdar'
    }
  }
}
</script>

<style></style>
