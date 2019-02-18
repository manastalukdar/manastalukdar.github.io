<template>
  <v-navigation-drawer v-model="sidebar" app right>
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
  data: () => ({
    //sidebar: store.sidebar.show
  })
}
</script>

<style>

</style>
