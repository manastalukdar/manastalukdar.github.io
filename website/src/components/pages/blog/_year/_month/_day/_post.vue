<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex xs12>
        Post: {{ $route }}
        <!--{{ postMetadata.excerpt }}-->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    appOwner: state => state.GlobalData.appOwner,
    currentPage: state =>
      state.MainNavMenu.blog.blogText + ' | ' + this.postMetaTitle
  }),
  asyncData(context, params) {
    // check if you got a payload first
    if (context.payload) {
      // extract the user object passed from nuxt.config.js
      return {
        postMetaTitle: context.payload.meta.title,
        postMetadata: context.payload
      }
    } else {
      // if you got no context, go ahead and make the API request, or log error
      // console.log("Failed to retrive data")
    }
  },
  head() {
    return {
      title: this.currentPage + ' || ' + this.appOwner,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.postMetadata.meta.description
        }
      ]
    }
  }
}
</script>

<style>
</style>
