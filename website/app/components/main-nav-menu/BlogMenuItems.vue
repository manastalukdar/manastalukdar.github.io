<template>
  <div>
    <v-list-item v-for="item in blogItems" :key="`blog-${item.text}`" :to="item.href">
      <v-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-avatar>
      <v-list-item-title v-text="item.text" />
    </v-list-item>
  </div>
</template>

<script>
import { useNavigationStore } from '@/stores/Navigation'
const navigationStore = useNavigationStore()
export default {
  data: () => ({
    blogItems: navigationStore.blog.blogItems
  }),
  computed: {}
}
</script>
