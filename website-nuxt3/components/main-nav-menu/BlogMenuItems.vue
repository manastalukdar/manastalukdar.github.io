<template>
  <div>
    <v-list-item v-for="item in blogItems" :key="item.text" :to="item.href">
      <v-list-item-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-title v-text="item.text" />
    </v-list-item>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({}),
  computed: mapState({
    blogItems: (state) => state.Navigation.blog.blogItems,
  }),
}
</script>
