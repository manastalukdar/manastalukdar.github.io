<template>
  <v-col class="px-0 pt-5">
    <v-card color="cardColor" raised elevation="8" class="py-4">
      <div class="socialSharing" justify="center">
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
              <a><i class="socialSharingItem mdi mdi-linkedin mdi-24px"></i></a>
            </network>
            <network network="twitter">
              <a><i class="socialSharingItem mdi mdi-twitter mdi-24px"></i></a>
            </network>
            <network network="facebook">
              <a><i class="socialSharingItem mdi mdi-facebook mdi-24px"></i></a>
            </network>
          </div>
        </social-sharing>
      </div>
      <div class="printButton col pt-2" justify="center">
        <v-icon @click="print">mdi-printer</v-icon>
      </div>
    </v-card>
  </v-col>
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
      twitterUser: 'ManasTalukdar',
      cssTextPrintMe: '',
      printjsCall() {}
    }
  },
  mounted() {
    this.initPrintJs()
  },
  methods: {
    print() {
      this.printjsCall({
        printable: 'printMe',
        type: 'html',
        style:
          '#single-post-header {text-align: center; justify-content: center;} .row {display: flex; flex-wrap: wrap; flex: 1 1 auto;} .col {flex-basis: 0; flex-grow: 1; max-width: 100%} .col-12 {flex: 0 0 100%}'
      })
    },
    initPrintJs() {
      this.printjsCall = require('print-js')
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
