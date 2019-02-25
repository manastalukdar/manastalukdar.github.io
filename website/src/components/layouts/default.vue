<template>
  <v-app dark>
    <MainNavMenuNavigationDrawer />
    <MainNavMenuTopNavBar />

    <v-content>
      <transition name="fade">
        <!-- component matched by the route will render here -->
        <nuxt />
      </transition>
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
