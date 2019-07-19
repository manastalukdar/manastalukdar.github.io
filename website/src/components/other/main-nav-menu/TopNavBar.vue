<template>
  <v-app-bar :color="headerAndFooterColor" app>
    <v-app-bar-nav-icon class="hidden-sm-and-up">
      <nuxt-link to="/" tag="span" style="cursor: pointer"
        ><v-icon>mdi-home</v-icon></nuxt-link
      ></v-app-bar-nav-icon
    >
    <v-toolbar-title class="hidden-xs-only headline">
      <nuxt-link to="/" tag="span" style="cursor: pointer">
        {{ appTitle }}
      </nuxt-link>
    </v-toolbar-title>
    <v-spacer />
    <v-btn text icon @click="flipThemeMode">
      <v-icon>mdi-invert-colors</v-icon>
    </v-btn>
    <v-toolbar-items class="hidden-sm-and-down">
      <MainNavMenuBlog />
      <MainNavMenuAbout />
      <MainNavMenuLegal />
      <MainNavMenuContact />
    </v-toolbar-items>

    <!--
    <v-menu class="hidden-md-and-up">
      <template v-slot:activator="{ on }">
        <v-app-bar-nav-icon @click="flipSidebarVisibility" v-on="on" />
      </template>
    </v-menu>
    -->

    <v-btn text icon class="hidden-md-and-up" @click="flipSidebarVisibility">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MainNavMenuBlog from './Blog.vue'
import MainNavMenuAbout from './About.vue'
import MainNavMenuLegal from './Legal.vue'
import MainNavMenuContact from './Contact.vue'
export default {
  components: {
    MainNavMenuBlog,
    MainNavMenuAbout,
    MainNavMenuLegal,
    MainNavMenuContact
  },
  data: () => ({}),
  computed: {
    darkMode: {
      // getter
      get() {
        return this.$store.state.GlobalData.darkMode
      },
      // setter
      set(value) {
        this.$store.commit('GlobalData/setThemeMode', value)
      }
    },
    ...mapState({
      appTitle: state => state.GlobalData.appTitle
    }),
    headerAndFooterColor() {
      return this.$store.getters['GlobalData/getHeaderAndFooterColor']
    }
  },
  methods: {
    ...mapActions({
      flipSidebarVisibility: 'Navigation/flipSidebarVisibility',
      flipThemeMode: 'GlobalData/flipThemeMode'
    })
  }
}
</script>

<style></style>
