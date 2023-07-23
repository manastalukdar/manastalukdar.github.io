<template>
  <v-app-bar color="headerAndFooterColor" app class="px-3">
    <v-app-bar-nav-icon class="hidden-sm-and-up home-icon">
      <nuxt-link v-slot="{ navigate }" to="/">
        <span role="link" @click="navigate" @keypress.enter="navigate"
          ><v-icon>mdi-home</v-icon></span
        >
      </nuxt-link>
    </v-app-bar-nav-icon>
    <v-toolbar-title class="hidden-xs text-h5 home-link">
      <nuxt-link v-slot="{ navigate }" to="/">
        <span role="link" @click="navigate" @keypress.enter="navigate" class="home-link">{{
          appTitle
        }}</span>
      </nuxt-link>
    </v-toolbar-title>
    <div class="flex-grow-1" />
<!--     <v-btn text icon @click="flipThemeMode">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn> -->
    <v-toolbar-items class="hidden-sm-and-down">
      <MainNavMenuBlog />
      <MainNavMenuAbout />
      <MainNavMenuLegal />
      <MainNavMenuContact />
    </v-toolbar-items>
    <client-only>
    <v-btn text icon class="hidden-md-and-up" @click="flipSidebarVisibility">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-btn @click="flipSettingsDialogVisibility">
      <v-icon>mdi-cog</v-icon>
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
import settings from '../settings.vue';
const appTitle = globalDataStore.appTitle;
onMounted(() => {
  //setCorrectHJsStyle();
});
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
