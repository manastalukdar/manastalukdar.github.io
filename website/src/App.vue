<template>
  <v-app dark>
    <main-nav-menu-navigationDrawer/>
    <main-nav-menu-topNavBar/>

    <v-content>
      <!-- component matched by the route will render here -->
      <router-view></router-view>
    </v-content>

    <layout-footer/>

  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>
