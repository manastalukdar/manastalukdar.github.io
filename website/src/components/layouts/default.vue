<template>
  <v-app :dark="darkMode">
    <MainNavMenuTopNavBar />
    <MainNavMenuNavigationDrawer />

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
import Footer from '../other/footer.vue'
export default {
  /* name: 'App', */
  components: {
    MainNavMenuNavigationDrawer,
    MainNavMenuTopNavBar,
    Footer
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      darkMode: state => state.GlobalData.darkMode
    })
  },
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
/*
.application .theme--dark .v-content {
  background-color: #252a33 !important; // : var(--v-accent-lighten2)
}
*/
.theme--dark .v-list {
  background: #263238;
}
.theme--dark a {
  color: #42b983;
}
.theme--dark a:hover {
  color: #ce7720;
}
/*.theme--dark a:visited {
  color: #b1be80;
}*/

.theme--light a {
  color: #31805c;
}
.theme--light a:hover {
  color: #ca6a2a;
}
/*.theme--light a:visited {
  color: #797a33;
}*/
</style>
