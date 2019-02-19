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
      :to="aboutPath"
      style="min-width: 48px"
    >
      <span
        class="hidden-sm-and-down mr-1"
        v-text="aboutText"
      />
    </v-btn>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    computed: mapState({
      aboutText: state => state.MainNavMenu.about.aboutText,
      aboutPath: state => state.MainNavMenu.about.aboutPath
    }),
    data: () => ({})
  }
</script>
