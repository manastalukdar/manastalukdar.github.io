<template>
  <v-toolbar :color="headerAndFooterColor" app>
    <v-toolbar-side-icon class="hidden-sm-and-up">
      <nuxt-link to="/" tag="span" style="cursor: pointer"
        ><v-icon>mdi-home</v-icon></nuxt-link
      ></v-toolbar-side-icon
    >
    <v-toolbar-title class="hidden-xs-only headline">
      <nuxt-link to="/" tag="span" style="cursor: pointer">
        {{ appTitle }}
      </nuxt-link>
    </v-toolbar-title>
    <v-spacer />
    <v-btn flat icon @click="flipThemeMode">
      <v-icon>mdi-invert-colors</v-icon>
    </v-btn>
    <v-toolbar-items class="hidden-sm-and-down">
      <MainNavMenuBlog />
      <MainNavMenuAbout />
      <MainNavMenuLegal />
      <MainNavMenuContact />
    </v-toolbar-items>

    <v-menu class="hidden-md-and-up">
      <v-toolbar-side-icon slot="activator" @click="flipSidebarVisibility" />
    </v-menu>
  </v-toolbar>
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
      flipSidebarVisibility: 'MainNavMenu/flipSidebarVisibility',
      flipThemeMode: 'GlobalData/flipThemeMode'
    })
  }
}
</script>

<style></style>
