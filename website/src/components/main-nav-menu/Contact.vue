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
      :aria-label="contactText"
      flat
      style="min-width: 48px"
    >
      <span
        class="hidden-sm-and-down mr-1"
        v-text="contactText"
      />
      <v-icon dark>arrow_drop_down</v-icon>
    </v-btn>
    <v-list dense>
      <main-nav-menu-contactMenuItems/>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    computed: mapState({
      contactText: state => state.MainNavMenu.contact.contactText
    }),
    data: () => ({})
  }
</script>
