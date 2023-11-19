<template>
  <v-menu bottom left offset-y max-height="500">
    <template v-slot:activator="{ props }">
      <v-btn :aria-label="aboutText" text style="min-width: 48px" v-bind="props">
        <span class="hidden-sm-and-down mr-1" v-text="aboutText" />
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list density="default">
      <AboutMenuItems />
    </v-list>
  </v-menu>
</template>

<script>
import { useNavigationStore } from '@/stores/Navigation'
import AboutMenuItems from './AboutMenuItems.vue'
const navigationStore = useNavigationStore()
export default {
  data: () => ({
    aboutText: navigationStore.about.aboutText
  }),
  components: {
    AboutMenuItems,
  },
  computed: {}
}
</script>
