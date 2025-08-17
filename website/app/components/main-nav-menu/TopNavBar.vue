<template>
  <v-app-bar color="headerAndFooterColor" app class="px-3">
    <v-app-bar-nav-icon class="hidden-lg-and-up home-icon">
      <nuxt-link v-slot="{ navigate }" to="/">
        <span role="link" @click="navigate" @keypress.enter="navigate"
          ><TreeShakenIcon icon="mdi-home" /></span
        >
      </nuxt-link>
    </v-app-bar-nav-icon>
    <v-toolbar-title class="hidden-md-and-down text-h5 home-link">
      <nuxt-link v-slot="{ navigate }" to="/">
        <span role="link" @click="navigate" @keypress.enter="navigate" class="home-link">{{
          appTitle
        }}</span>
      </nuxt-link>
    </v-toolbar-title>
    <div class="flex-grow-1" />
<!--     <v-btn text icon @click="flipThemeMode">
      <TreeShakenIcon icon="mdi-theme-light-dark" />
    </v-btn> -->
    <v-toolbar-items class="hidden-sm-and-down">
      <MainNavMenuBlog />
      <MainNavMenuAbout />
      <MainNavMenuLegal />
      <MainNavMenuContact />
      <v-btn text to="/search">
        <TreeShakenIcon icon="mdi-magnify" class="mr-2" />
        Search
      </v-btn>
      <BookmarksNavButton />
    </v-toolbar-items>
    <client-only>
    <v-btn text icon class="hidden-md-and-up" @click="flipSidebarVisibility">
      <TreeShakenIcon icon="mdi-menu" />
    </v-btn>
    <v-btn @click="flipSettingsDialogVisibility">
      <TreeShakenIcon icon="mdi-cog" />
      <settings>
      </settings>
    </v-btn>
  </client-only>
  </v-app-bar>
</template>

<script setup>
import { useGlobalDataStore } from '@/stores/GlobalData';
import { useNavigationStore } from '@/stores/Navigation';
const globalDataStore = useGlobalDataStore();
const navigationStore = useNavigationStore();
import MainNavMenuBlog from './Blog.vue';
import MainNavMenuAbout from './About.vue';
import MainNavMenuLegal from './Legal.vue';
import MainNavMenuContact from './Contact.vue';
import BookmarksNavButton from './BookmarksNavButton.vue';
import settings from '../settings.vue';
const appTitle = globalDataStore.appTitle;
function flipSidebarVisibility() {
  navigationStore.flipSidebarVisibility();
};
function flipSettingsDialogVisibility() {
  navigationStore.flipSettingsDialogVisibility();
};
</script>

<style scoped>
.home-link a:link {
  cursor: pointer;
  text-decoration: none;
}
</style>
