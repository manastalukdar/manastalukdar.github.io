<template>
  <v-navigation-drawer
    v-model="sidebarVisibility"
    class="hidden-md-and-up"
    app
    right
    color="headerAndFooterColor"
    :disable-resize-watcher="true"
    :disable-route-watcher="true"
  >
    <v-list nav dense>
      <v-list-group no-action>
        <v-list-item slot="activator">
          <v-list-item-action>
            <v-icon>
              mdi-blogger
            </v-icon>
          </v-list-item-action>
          <v-list-item-title> {{ blogText }} </v-list-item-title>
        </v-list-item>
        <BlogMenuItems />
      </v-list-group>

      <v-list-group no-action>
        <v-list-item slot="activator">
          <v-list-item-action>
            <v-icon>mdi-information</v-icon>
          </v-list-item-action>
          <v-list-item-title> {{ aboutText }} </v-list-item-title>
        </v-list-item>
        <AboutMenuItems />
      </v-list-group>

      <div class="px-2">
        <v-list-item nuxt :to="legalPath">
          <v-list-item-action>
            <v-icon>mdi-gavel</v-icon>
          </v-list-item-action>
          <v-list-item-title> {{ legalText }} </v-list-item-title>
        </v-list-item>
      </div>

      <v-list-group no-action>
        <v-list-item slot="activator">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-title> {{ contactText }} </v-list-item-title>
        </v-list-item>
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
    ContactMenuItems,
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
      },
    },
    ...mapState({
      blogText: (state) => state.Navigation.blog.blogText,
      aboutText: (state) => state.Navigation.about.aboutText,
      aboutPath: (state) => state.Navigation.about.aboutPath,
      legalText: (state) => state.Navigation.legal.legalText,
      legalPath: (state) => state.Navigation.legal.legalPath,
      contactText: (state) => state.Navigation.contact.contactText,
    }),
  },
}
</script>

<style></style>
