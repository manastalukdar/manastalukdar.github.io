<template>
  <v-navigation-drawer
    v-model="sidebarVisibility"
    class="hidden-md-and-up"
    app
    right
    :disable-resize-watcher="true"
    :disable-route-watcher="true"
  >
    <v-list>
      <v-list-group no-action>
        <v-list-tile slot="activator">
          <v-list-tile-action>
            <v-icon>
              mdi-blogger
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-title> {{ blogText }} </v-list-tile-title>
        </v-list-tile>
        <BlogMenuItems />
      </v-list-group>

      <v-list-group no-action>
        <v-list-tile slot="activator">
          <v-list-tile-action>
            <v-icon>mdi-information</v-icon>
          </v-list-tile-action>
          <v-list-tile-title> {{ aboutText }} </v-list-tile-title>
        </v-list-tile>
        <AboutMenuItems />
      </v-list-group>

      <v-list-tile nuxt :to="legalPath">
        <v-list-tile-action>
          <v-icon>mdi-gavel</v-icon>
        </v-list-tile-action>
        <v-list-tile-title> {{ legalText }} </v-list-tile-title>
      </v-list-tile>

      <v-list-group no-action>
        <v-list-tile slot="activator">
          <v-list-tile-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-title> {{ contactText }} </v-list-tile-title>
        </v-list-tile>
        <ContactMenuItems />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
import BlogMenuItems from './BlogMenuItems.vue'
import AboutMenuItems from './AboutMenuItems.vue'
import ContactMenuItems from './ContactMenuItems.vue'
export default {
  components: {
    BlogMenuItems,
    AboutMenuItems,
    ContactMenuItems
  },
  computed: {
    sidebarVisibility: {
      // getter
      get() {
        return this.$store.state.MainNavMenu.sidebarVisible
      },
      // setter
      set(value) {
        this.$store.commit('MainNavMenu/setSidebarVisibility', value)
      }
    },
    ...mapState({
      blogText: state => state.MainNavMenu.blog.blogText,
      aboutText: state => state.MainNavMenu.about.aboutText,
      aboutPath: state => state.MainNavMenu.about.aboutPath,
      legalText: state => state.MainNavMenu.legal.legalText,
      legalPath: state => state.MainNavMenu.legal.legalPath,
      contactText: state => state.MainNavMenu.contact.contactText
    })
  }
}
</script>

<style></style>
