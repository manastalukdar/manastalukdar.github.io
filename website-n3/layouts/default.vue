<template>
  <v-app>
    <MainNavMenuTopNavBar />
    <MainNavMenuNavigationDrawer />

    <v-main>
      <v-container id="content-body-container" class="content-body pa-3">
        <transition name="fade">
          <!-- component matched by the route will render here -->
          <div>
            <NuxtPage />
          </div>
        </transition>
      </v-container>
    </v-main>

    <Footer />
  </v-app>
  <slot />
</template>

<script>
import { useGlobalDataStore } from '@/stores/GlobalData'
const globalDataStore = useGlobalDataStore()
// import MainNavMenuNavigationDrawer from '../components/main-nav-menu/NavigationDrawer.vue'
import MainNavMenuTopNavBar from '../components/main-nav-menu/TopNavBar.vue'
import Footer from '../components/footer.vue'
export default {
  pageTransition: {
    name: 'fade',
    mode: 'out-in',
  },
  data: () => ({
    appOwner: globalDataStore.appOwner,
  }),
  /* name: 'App', */
  components: {
    // MainNavMenuNavigationDrawer,
    MainNavMenuTopNavBar,
    Footer,
  },
  head() {
    return {
      title: this.appOwner,
    }
  },
  computed: {
  },
  mounted() {
    // this.$vuetify.theme.dark = true
    /* addBackToTop({
      diameter: 40,
      zIndex: 3,
    }) */
  },
}
</script>

<style>
</style>
