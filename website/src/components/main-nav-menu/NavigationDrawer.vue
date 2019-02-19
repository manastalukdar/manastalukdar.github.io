<template>
  <v-navigation-drawer v-model="sidebarVisibility" app right>
    <v-list>
        <v-list-tile><main-nav-menu-blog/></v-list-tile>
        <v-list-tile><main-nav-menu-about/></v-list-tile>
        <v-list-tile><main-nav-menu-legal/></v-list-tile>
        <v-list-tile><main-nav-menu-contact/></v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

export default {
  computed: {
    sidebarVisibility: {
      // getter
      get() {
        return this.$store.state.MainNavMenu.sidebarVisible
      },
      // setter
      set(value) {
        this.$store.commit('MainNavMenu/setSidebarVisibility', value)
      }
    }
  },
  data: () => ({ })
}
</script>

<style>

</style>
