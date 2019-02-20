<template>
  <div>
    <v-list-tile
      v-for="item in blogItems"
      :key="item.text"
      :to="item.href">
      <v-list-tile-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-title v-text="item.text"></v-list-tile-title>
    </v-list-tile>
  </div>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    computed: mapState({
      blogItems: state => state.MainNavMenu.blog.blogItems
    }),
    data: () => ({})
  }
</script>
