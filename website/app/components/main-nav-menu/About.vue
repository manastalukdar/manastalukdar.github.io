<template>
  <v-menu class="text-center" bottom max-height="800">
    <template v-slot:activator="{ props }">
      <v-btn :aria-label="aboutText" text style="min-width: 48px" v-bind="props">
        <v-icon start>{{ aboutIcon }}</v-icon>
        <span class="hidden-sm-and-down mr-1" v-text="aboutText" />
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list density="default">
      <AboutMenuItems />
    </v-list>
  </v-menu>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
import AboutMenuItems from './AboutMenuItems.vue';
const navigationStore = useNavigationStore();
const aboutText = navigationStore.about.aboutText;
const aboutIcon = navigationStore.about.icon;
</script>
