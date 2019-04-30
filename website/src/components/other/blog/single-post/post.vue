<template>
  <v-layout column wrap>
    <v-layout wrap row ma-2>
      <v-flex xs12>
        <v-card :color="cardColor" raised elevation="8" class="pa-4">
          <postHeader :post-metadata="postMetadata" />
          <p />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="blogPostContent" v-html="postContent" />
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout wrap row ma-2>
      <v-flex xs12>
        <socialSharing
          :url="url"
          :title="postMetadata.title"
          :description="postMetadata.description"
          :quote="postMetadata.excerpt"
          :hashtags="hashtags"
        />
      </v-flex>
    </v-layout>

    <v-layout wrap row ma-2>
      <v-flex xs12>
        <comments :post-id="postId" :url="url" />
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import postHeader from './post-header.vue'
import socialSharing from './social-sharing.vue'
import comments from './comments.vue'
export default {
  components: {
    postHeader,
    socialSharing,
    comments
  },
  props: {
    postMetadata: {
      type: Object,
      required: true,
      default: () => {}
    },
    postContent: {
      type: String,
      required: true,
      default: ''
    },
    url: {
      type: String,
      required: true,
      default: ''
    },
    postId: {
      type: String,
      required: true,
      default: ''
    }
  },
  computed: {
    cardColor() {
      return this.$store.getters['GlobalData/getCardColor']
    },
    hashtags() {
      const hashtagsArray = []
      this.postMetadata.categories.forEach(category => {
        const noSpecialCharNoSpaces = category.name
          .replace('[^a-zA-Z0-9]+', '')
          .replace(/\s+/g, '')
        hashtagsArray.push(noSpecialCharNoSpaces)
      })
      this.postMetadata.tags.forEach(tag => {
        const noSpecialCharNoSpaces = tag.name
          .replace('[^a-zA-Z0-9]+', '')
          .replace(/\s+/g, '')
        hashtagsArray.push(noSpecialCharNoSpaces)
      })
      return hashtagsArray.join()
    }
  }
}
</script>

<style></style>
