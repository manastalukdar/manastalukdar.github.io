<template>
  <v-menu attach bottom left offset-y max-height="500">
    <v-btn slot="activator" :aria-label="blogText" flat style="min-width: 48px">
      <span class="hidden-sm-and-down mr-1" v-text="blogText" />
      <v-icon dark>
        arrow_drop_down
      </v-icon>
    </v-btn>
    <v-list dense>
      <BlogMenuItems />
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
import BlogMenuItems from './BlogMenuItems.vue'

export default {
  components: {
    BlogMenuItems
  },
  data: () => ({}),
  computed: mapState({
    blogText: state => state.MainNavMenu.blog.blogText
  })
}
</script>
