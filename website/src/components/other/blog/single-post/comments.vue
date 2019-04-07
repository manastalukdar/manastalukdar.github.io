<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-card :color="cardColor" raised class="pa-4">
        <div class="comments">
          <vue-disqus
            :shortname="disqusShortname"
            :identifier="postId"
            :url="url"
          />
        </div>
      </v-card>
    </v-flex>
  </v-layout>
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
  data: function() {
    return {
      disqusShortname: 'manastalukdar'
    }
  },
  computed: {
    cardColor() {
      return this.$store.getters['GlobalData/getCardColor']
    }
  }
}
</script>

<style></style>
