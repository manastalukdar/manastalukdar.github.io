<template>
  <v-menu attach bottom left offset-y max-height="500">
    <template #activator="{ on }">
      <v-btn :aria-label="aboutText" text style="min-width: 48px" v-on="on">
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
import { mapState } from 'vuex'
import AboutMenuItems from './AboutMenuItems.vue'
export default {
  components: {
    AboutMenuItems,
  },
  data: () => ({}),
  computed: mapState({
    aboutText: (state) => state.Navigation.about.aboutText,
  }),
}
</script>
