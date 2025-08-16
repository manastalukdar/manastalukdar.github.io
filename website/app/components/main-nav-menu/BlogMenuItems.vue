<template>
  <div>
    <v-list-item v-for="item in blogItems" :key="`blog-${item.text}`" :to="item.href">
      <v-avatar>
        <TreeShakenIcon :icon="item.icon" />
      </v-avatar>
      <v-list-item-title v-text="item.text" />
    </v-list-item>
  </div>
</template>

<script>
import { useNavigationStore } from '@/stores/Navigation'
import TreeShakenIcon from '@/components/TreeShakenIcon.vue'

const navigationStore = useNavigationStore()
export default {
  components: {
    TreeShakenIcon
  },
  data: () => ({
    blogItems: navigationStore.blog.blogItems
  }),
  computed: {}
}
</script>
