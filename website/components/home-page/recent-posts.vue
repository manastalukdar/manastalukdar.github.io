<template>
  <v-col cols="12">
    <v-card
      color="cardColor"
      class="pa-3 pt-5"
      raised
      elevation="8"
      style="height: 100%"
      :to="blogItems[0].href"
    >
      <recentPosts :items-to-display="itemsToDisplay" :posts-list="postsList" />
    </v-card>
  </v-col>
</template>

<script setup>
import recentPosts from '../blog/recent-posts/list.vue'
import { useNavigationStore } from '@/stores/Navigation'
const navigationStore = useNavigationStore()
defineProps({
  postsList: {
    type: Array,
    required: true,
    default() {
      return {}
    }
  },
});
const itemsToDisplay = 6;
const blogItems = navigationStore.blog.blogItems;
</script>
