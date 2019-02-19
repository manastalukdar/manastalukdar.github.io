<template>
  <v-app dark>
    <main-nav-menu-navigationDrawer/>
    <main-nav-menu-topNavBar/>

    <v-content>
      <!-- component matched by the route will render here -->
      <router-view></router-view>
    </v-content>

    <v-footer
    dark
    height="auto"
  >
    <v-card
      class="flex"
      flat
      tile
    >
      <v-card-actions class="dark darken-2 py-3 justify-center">
        &copy;&nbsp;{{copyrightStartYear}}—{{copyrightEndYear}}&nbsp;<strong>{{ appOwner }}</strong>
      </v-card-actions>
    </v-card>
  </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: mapState({
      appOwner: state => state.GlobalData.appOwner,
      copyrightStartYear: state => state.GlobalData.copyrightStartYear,
      copyrightEndYear: state => state.GlobalData.copyrightEndYear
    }),
  components: {
  }
}
</script>
