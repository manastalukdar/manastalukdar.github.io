<template>
  <v-col>
    <v-row>
      <v-col>
        <v-card color="cardColor" raised elevation="8" class="py-4 px-6">
          <postHeader :post-metadata="postMetadata" />
          <p />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="blogPostContent" v-html="postContent" />
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <no-ssr>
        <v-col>
          <socialSharing
            :url="url"
            :title="postMetadata.title"
            :description="postMetadata.description"
            :quote="postMetadata.excerpt"
            :hashtags="hashtags"
          />
        </v-col>
      </no-ssr>
    </v-row>

    <v-row>
      <v-col>
        <comments :post-id="postId" :url="url" />
      </v-col>
    </v-row>
  </v-col>
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
