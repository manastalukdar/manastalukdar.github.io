<template>
  <div>
    <v-list-tile
      v-for="item in aboutItems"
      :key="item.text"
      :to="item.href"
    >
      <v-list-tile-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-title v-text="item.text" />
    </v-list-tile>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({}),
  computed: mapState({
    aboutItems: state => state.MainNavMenu.about.aboutItems
  })
}
</script>
