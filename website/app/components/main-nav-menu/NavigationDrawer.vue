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
        <template v-slot:activator="{props}">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <TreeShakenIcon icon="mdi-newspaper" class="mr-4" />
            </template>
            <v-list-item-title> {{ blogText }} </v-list-item-title>
            <template v-slot:append>
              <TreeShakenIcon icon="mdi-chevron-down" />
            </template>
          </v-list-item>
        </template>
        <BlogMenuItems />
      </v-list-group>

      <v-list-group no-action>
        <template v-slot:activator="{props}">
        <v-list-item v-bind="props">
          <template v-slot:prepend>
            <TreeShakenIcon icon="mdi-information" class="mr-4" />
          </template>
          <v-list-item-title> {{ aboutText }} </v-list-item-title>
          <template v-slot:append>
            <TreeShakenIcon icon="mdi-chevron-down" />
          </template>
        </v-list-item>
        </template>
        <AboutMenuItems />
      </v-list-group>

      <div class="px-0">
        <v-list-item nuxt :to="legalPath">
          <template v-slot:prepend>
            <TreeShakenIcon icon="mdi-gavel" class="mr-4" />
          </template>
          <v-list-item-title>{{ legalText }}</v-list-item-title>
        </v-list-item>
      </div>

      <v-list-group no-action :value="contact">
        <template v-slot:activator="{props}">
        <v-list-item v-bind="props">
          <template v-slot:prepend>
            <TreeShakenIcon icon="mdi-mail" class="mr-4" />
          </template>
          <v-list-item-title> {{ contactText }} </v-list-item-title>
          <template v-slot:append>
            <TreeShakenIcon icon="mdi-chevron-down" />
          </template>
        </v-list-item>
        </template>
        <ContactMenuItems />
      </v-list-group>

      <div class="px-0">
        <v-list-item key="bookmarks-standalone" @click="navigateToBookmarks">
          <template v-slot:prepend>
            <TreeShakenIcon icon="mdi-bookmark" class="mr-4" />
          </template>
          <v-list-item-title>Bookmarks</v-list-item-title>
        </v-list-item>
      </div>

      <div class="px-0">
        <v-list-item nuxt to="/search">
          <template v-slot:prepend>
            <TreeShakenIcon icon="mdi-magnify" class="mr-4" />
          </template>
          <v-list-item-title>Search</v-list-item-title>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
import { storeToRefs } from 'pinia';
import BlogMenuItems from './BlogMenuItems.vue';
import AboutMenuItems from './AboutMenuItems.vue';
import ContactMenuItems from './ContactMenuItems.vue';
import TreeShakenIcon from '@/components/TreeShakenIcon.vue';

const navigationStore = useNavigationStore();
const blogText = navigationStore.blog.blogText;
const aboutText = navigationStore.about.aboutText;
const legalText = navigationStore.legal.legalText;
const legalPath = navigationStore.legal.legalPath;
const contactText = navigationStore.contact.contactText;
const { sidebarVisible } = storeToRefs(navigationStore);
//const blog = ref(false);
//const about = ref(false);
const contact = ref(false);
watch(sidebarVisible, () => {
  //console.log('sidebarVisible changed', sidebarVisible)
});

const navigateToBookmarks = () => {
  navigateTo('/bookmarks/');
};
</script>

<style></style>
