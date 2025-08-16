<template>
  <v-col class="px-0 pt-5">
    <v-card color="cardColor" raised elevation="8" class="py-4">
      <div class="socialSharing" justify="center">
        <div class="socialSharingItems">
          <ShareNetwork
            network="email"
            :url="url"
            :title="title"
            :description="description"
          >
            <a><TreeShakenIcon icon="mdi-email" size="24" class="socialSharingItem" /></a>
          </ShareNetwork>
          <ShareNetwork network="linkedin" :url="url" :title="title">
            <a><TreeShakenIcon icon="mdi-linkedin" size="24" class="socialSharingItem" /></a>
          </ShareNetwork>
          <ShareNetwork
            network="twitter"
            :url="url"
            :title="title"
            :hashtags="hashtags"
            :twitter-user="twitterUser"
          >
            <a><TreeShakenIcon icon="mdi-twitter" size="24" class="socialSharingItem" /></a>
          </ShareNetwork>
          <ShareNetwork
            network="facebook"
            :url="url"
            :title="title"
            :description="description"
            :quote="quote"
            :hashtags="hashtags"
          >
            <a><TreeShakenIcon icon="mdi-facebook" size="24" class="socialSharingItem" /></a>
          </ShareNetwork>
        </div>
      </div>
      <div class="printButton col pt-2" justify="center">
        <TreeShakenIcon icon="mdi-printer" @click="print" style="cursor: pointer;" />
      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import { usePaperizer } from 'paperizer'
import TreeShakenIcon from '~/components/TreeShakenIcon.vue'
defineProps ({
  url: {
    type: String,
    required: true,
    default: '',
  },
  title: {
    type: String,
    required: true,
    default: '',
  },
  description: {
    type: String,
    required: true,
    default: '',
  },
  quote: {
    type: String,
    required: true,
    default: '',
  },
  hashtags: {
    type: String,
    required: true,
    default: '',
  },
});
const twitterUser = 'ManasTalukdar';
const { paperize } = usePaperizer('printMe',  {
  styles: [
    '/styles/print-blog-post.css'
  ]
});
const print = () => {
  paperize()
};
</script>

<style>
.socialSharingItems {
  display: flex;
  justify-content: center;
}
.socialSharingItem {
  margin-left: 1em;
  margin-right: 1em;
}
</style>
