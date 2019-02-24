<template>
  <v-app dark>
    <MainNavMenuNavigationDrawer />
    <MainNavMenuTopNavBar />

    <v-content>
      <!-- component matched by the route will render here -->
      <nuxt />
    </v-content>

    <Footer />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import MainNavMenuNavigationDrawer from '../other/main-nav-menu/NavigationDrawer.vue'
import MainNavMenuTopNavBar from '../other/main-nav-menu/TopNavBar.vue'
import Footer from '../other/Footer.vue'
export default {
  /* name: 'App', */
  components: {
    MainNavMenuNavigationDrawer,
    MainNavMenuTopNavBar,
    Footer
  },
  computed: mapState({
    appOwner: state => state.GlobalData.appOwner
  }),
  head() {
    return {
      title: this.appOwner
    }
  }
}
</script>
