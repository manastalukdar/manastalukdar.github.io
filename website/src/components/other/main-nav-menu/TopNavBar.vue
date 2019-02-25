<template>
  <v-toolbar color="blue darken-3" dark app>
    <v-toolbar-title class="headline">
      <nuxt-link to="/" tag="span" style="cursor: pointer">
        {{ appTitle }}
      </nuxt-link>
    </v-toolbar-title>
    <v-spacer />
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
  computed: mapState({
    appTitle: state => state.GlobalData.appTitle
  }),
  methods: mapActions('MainNavMenu', ['flipSidebarVisibility'])
}
</script>

<style>
</style>
