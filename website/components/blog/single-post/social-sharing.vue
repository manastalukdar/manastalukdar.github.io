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
        <v-btn text @click="printjs"><v-icon>mdi-printer</v-icon></v-btn>
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
      printd: '',
      cssTextPrintMe: '',
      printjsCall() {}
    }
  },
  mounted() {
    this.initPrintd()
    this.initPrintjs()
  },
  methods: {
    print() {
      this.printd.print(document.getElementById('printMe'), this.cssTextPrintMe)
    },
    printjs() {
      this.printjsCall('printMe', 'html')
    },
    initPrintd() {
      const { Printd } = require('printd')
      const options = {
        parent: document.getElementById('content-body-container')
      }
      this.cssTextPrintMe = `
        #single-post-header {
          text-align: center;
        }
      `
      this.printd = new Printd(options)
    },
    initPrintjs() {
      this.printjsCall = require('print-js')
      console.log(this.printjsCall)
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
