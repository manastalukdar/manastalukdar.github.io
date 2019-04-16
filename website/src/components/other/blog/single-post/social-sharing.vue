<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-card :color="cardColor" raised elevation="8" class="pa-4">
        <v-layout class="socialSharing" align-center justify-space-around row>
          <social-sharing
            v-cloak
            :url="url"
            :title="title"
            :description="description"
            :quote="quote"
            :hashtags="hashtags"
            :twitter-user="twitterUser"
            inline-template
          >
            <div>
              <network network="email">
                <a><i class="mdi mdi-email mdi-24px"></i></a> </network
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <network network="linkedin">
                <a><i class="mdi mdi-linkedin mdi-24px"></i></a> </network
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <network network="twitter">
                <a><i class="mdi mdi-twitter mdi-24px"></i></a> </network
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <network network="facebook">
                <a><i class="mdi mdi-facebook mdi-24px"></i></a>
              </network>
            </div>
          </social-sharing>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
      default: ''
    },
    title: {
      type: String,
      required: true,
      default: ''
    },
    description: {
      type: String,
      required: true,
      default: ''
    },
    quote: {
      type: String,
      required: true,
      default: ''
    },
    hashtags: {
      type: String,
      required: true,
      default: ''
    }
  },
  data: function() {
    return {
      twitterUser: 'ManasTalukdar'
    }
  },
  computed: {
    cardColor() {
      return this.$store.getters['GlobalData/getCardColor']
    }
  }
}
</script>

<style>
.theme--dark .socialSharing a {
  color: #fff !important;
}
.theme--light .socialSharing a {
  color: rgba(0, 0, 0, 0.54) !important;
}
</style>
