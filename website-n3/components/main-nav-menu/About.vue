<template>
  <v-menu attach bottom left offset-y max-height="500">
    <template #activator="{ on }">
      <v-btn :aria-label="aboutText" text style="min-width: 48px">
        <span class="hidden-sm-and-down mr-1" v-text="aboutText" />
        <v-icon> arrow_drop_down </v-icon>
      </v-btn>
    </template>
    <v-list color="headerAndFooterColor" dense>
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
