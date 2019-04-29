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
.theme--dark .v-navigation-drawer {
  background-color: #263238; /* var(--v-cardColorDark) */
}
.theme--dark .v-list {
  background: #263238;
}
.theme--dark a {
  color: #42b983;
}
.theme--dark a:hover {
  color: #ce7720;
}
.theme--dark a:active {
  color: #e90e0e;
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
.theme--light a:active {
  color: #e90e0e;
}
/*.theme--light a:visited {
  color: #797a33;
}*/

p {
  margin-top: 16px;
}
video {
  width: 100%;
  max-height: 100%;
  padding: 2em;
}
.table-of-contents {
  margin: 2em;
}
img {
  display: block;
  max-width: 100%;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  padding: 1em;
}
h2,
h3 {
  margin: 1em;
}
.footnotes-sep {
  margin-top: 2em;
  margin-bottom: 2em;
}
pre {
  margin: 1.5em;
}
pre code {
  margin: 0em;
  padding: 1em;
}
code {
  margin: 0.2em;
}
</style>
