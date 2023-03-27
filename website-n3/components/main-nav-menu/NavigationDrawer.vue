<template>
  <v-navigation-drawer
    v-model="sidebarVisible"
    class="hidden-md-and-up"
    app
    location="right"
    temporary
    color="headerAndFooterColor"
    :disable-resize-watcher="true"
    :disable-route-watcher="true"
  >
    <v-list nav density="default">
      <v-list-group no-action>
        <v-list-item slot="activator">
          <v-list-item-action>
            <v-icon> mdi-blogger </v-icon>
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

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
import { ref } from 'vue'
import BlogMenuItems from './BlogMenuItems.vue';
import AboutMenuItems from './AboutMenuItems.vue';
import ContactMenuItems from './ContactMenuItems.vue';
const navigationStore = useNavigationStore();
const blogText = navigationStore.blog.blogText;
const aboutText = navigationStore.about.aboutText;
const aboutPath = navigationStore.aboutPath;
const legalText = navigationStore.legalText;
const legalPath = navigationStore.legalPath;
const contactText = navigationStore.contactText;
const sidebarVisible = navigationStore.sidebarVisible;
console.log('HERE2')
console.log(sidebarVisible)
components: {
  BlogMenuItems,
  AboutMenuItems,
  ContactMenuItems
}
</script>

<style></style>
