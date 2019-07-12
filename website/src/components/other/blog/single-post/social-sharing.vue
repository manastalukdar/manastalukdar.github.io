<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-card :color="cardColor" raised elevation="8" class="pa-4">
        <v-layout class="socialSharing" justify-center row wrap>
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
            <div class="socialSharingItems">
              <network network="email">
                <a><i class="socialSharingItem mdi mdi-email mdi-24px"></i></a>
              </network>
              <network network="linkedin">
                <a
                  ><i class="socialSharingItem mdi mdi-linkedin mdi-24px"></i
                ></a>
              </network>
              <network network="twitter">
                <a
                  ><i class="socialSharingItem mdi mdi-twitter mdi-24px"></i
                ></a>
              </network>
              <network network="facebook">
                <a
                  ><i class="socialSharingItem mdi mdi-facebook mdi-24px"></i
                ></a>
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
  data() {
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
.socialSharingItems {
  display: flex;
  justify-content: center;
}
.socialSharingItem {
  margin-left: 1em;
  margin-right: 1em;
}
</style>
