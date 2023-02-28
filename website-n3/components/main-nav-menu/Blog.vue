<template>
  <v-menu attach bottom left offset-y max-height="500">
    <template #activator="{ on }">
      <v-btn text :aria-label="blogText" style="min-width: 48px">
        <span class="hidden-sm-and-down mr-1" v-text="blogText" />
        <v-icon> arrow_drop_down </v-icon>
      </v-btn>
    </template>
    <v-list color="headerAndFooterColor" dense>
      <BlogMenuItems />
    </v-list>
  </v-menu>
</template>

<script>
import { useNavigationStore } from '@/stores/Navigation'
import BlogMenuItems from './BlogMenuItems.vue'
const navigationStore = useNavigationStore()
export default {
  data: () => ({
    blogText: navigationStore.blog.blogText,
  }),
  components: {
    BlogMenuItems,
  },
  computed: {},
}
</script>
