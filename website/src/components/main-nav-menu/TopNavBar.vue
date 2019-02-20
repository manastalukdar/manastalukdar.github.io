<template>
  <v-toolbar color="blue darken-3" dark app>
    <v-toolbar-title class="headline">
      <router-link to="/" tag="span" style="cursor: pointer">
          {{ appTitle }}
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <main-nav-menu-blog/>
      <main-nav-menu-about/>
      <main-nav-menu-legal/>
      <main-nav-menu-contact/>
    </v-toolbar-items>

    <v-menu class="hidden-md-and-up">
        <v-toolbar-side-icon slot="activator" @click="flipSidebarVisibility"></v-toolbar-side-icon>
    </v-menu>
  </v-toolbar>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState({
    appTitle: state => state.GlobalData.appTitle
  }),
  methods: mapActions('MainNavMenu', [
    'flipSidebarVisibility'
  ]),
  data: () => ({})
}
</script>

<style>

</style>
