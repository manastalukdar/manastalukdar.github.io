<template>
  <v-menu
    attach
    bottom
    left
    offset-y
    max-height="500"
  >
    <v-btn
      slot="activator"
      :aria-label="blogText"
      flat
      style="min-width: 48px"
    >
      <span
        class="hidden-sm-and-down mr-1"
        v-text="blogText"
      />
      <v-icon dark>arrow_drop_down</v-icon>
    </v-btn>
    <v-list dense>
      <v-list-tile
        v-for="item in blogItems"
        :key="item.text"
        :to="item.href">
        <v-list-tile-avatar>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-title v-text="item.text"></v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    computed: mapState({
      blogText: state => state.MainNavMenu.blog.blogText,
      blogItems: state => state.MainNavMenu.blog.blogItems
    }),
    data: () => ({})
  }
</script>
