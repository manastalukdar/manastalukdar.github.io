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
          <v-list-item prepend-icon="mdi-post" v-bind="props">
            <v-list-item-title> {{ blogText }} </v-list-item-title>
          </v-list-item>
        </template>
        <BlogMenuItems />
      </v-list-group>

      <v-list-group no-action>
        <template v-slot:activator="{props}">
        <v-list-item prepend-icon="mdi-information" v-bind="props">
          <v-list-item-title> {{ aboutText }} </v-list-item-title>
        </v-list-item>
        </template>
        <AboutMenuItems />
      </v-list-group>

      <div class="px-0">
        <v-list-item text nuxt :to="legalPath" prepend-icon="mdi-gavel" :title=legalText>
        </v-list-item>
      </div>

      <v-list-group no-action :value="contact">
        <template v-slot:activator="{props}">
        <v-list-item prepend-icon="mdi-mail" v-bind="props">
          <v-list-item-title> {{ contactText }} </v-list-item-title>
        </v-list-item>
        </template>
        <ContactMenuItems />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
import { storeToRefs } from 'pinia';
import BlogMenuItems from './BlogMenuItems.vue';
import AboutMenuItems from './AboutMenuItems.vue';
import ContactMenuItems from './ContactMenuItems.vue';
const navigationStore = useNavigationStore();
const blogText = navigationStore.blog.blogText;
const aboutText = navigationStore.about.aboutText;
const aboutPath = navigationStore.aboutPath;
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
</script>

<style></style>
