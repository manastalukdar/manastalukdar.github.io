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
        return this.$store.state.Navigation.sidebarVisible
      },
      // setter
      set(value) {
        this.$store.commit('Navigation/setSidebarVisibility', value)
      }
    },
    ...mapState({
      blogText: state => state.Navigation.blog.blogText,
      aboutText: state => state.Navigation.about.aboutText,
      aboutPath: state => state.Navigation.about.aboutPath,
      legalText: state => state.Navigation.legal.legalText,
      legalPath: state => state.Navigation.legal.legalPath,
      contactText: state => state.Navigation.contact.contactText
    })
  }
}
</script>

<style></style>
