<template>
  <v-toolbar app>
    <v-toolbar-title class="headline">
      <router-link to="/" tag="span" style="cursor: pointer">
          {{ title }}
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

    <!--<v-menu class="hidden-md-and-up">
        <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
        <v-list>
          <v-list-tile><main-nav-menu-blog/></v-list-tile>
          <v-list-tile><main-nav-menu-about/></v-list-tile>
          <v-list-tile><main-nav-menu-legal/></v-list-tile>
          <v-list-tile><main-nav-menu-contact/></v-list-tile>
        </v-list>
    </v-menu>-->
  </v-toolbar>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState({
    title: state => state.GlobalData.appTitle
  }),
  methods: mapActions('MainNavMenu', [
    'flipSidebarVisibility'
  ]),
  data: () => ({
    //sidebar: store.sidebar.show
  })
}
</script>

<style>

</style>
