<template>
  <div>
    <v-list-item v-for="item in aboutItems" :key="item.text" :to="item.href">
      <v-list-item-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-title v-text="item.text" />
    </v-list-item>
  </div>
</template>

<script>
import { mapState } from 'pinia'
export default {
  data: () => ({}),
  computed: mapState({
    aboutItems: (state) => state.Navigation.about.aboutItems,
  }),
}
</script>
