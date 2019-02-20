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
      :aria-label="aboutText"
      flat
      style="min-width: 48px"
    >
      <span
        class="hidden-sm-and-down mr-1"
        v-text="aboutText"
      />
      <v-icon dark>arrow_drop_down</v-icon>
    </v-btn>
    <v-list dense>
      <main-nav-menu-aboutMenuItems/>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    computed: mapState({
      aboutText: state => state.MainNavMenu.about.aboutText
    }),
    data: () => ({})
  }
</script>
