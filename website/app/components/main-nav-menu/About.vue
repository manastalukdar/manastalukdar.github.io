<template>
  <v-menu class="text-center" bottom max-height="800">
    <template v-slot:activator="{ props }">
      <v-btn :aria-label="aboutText" text style="min-width: 48px" v-bind="props">
        <TreeShakenIcon :icon="aboutIcon" class="mr-1" />
        <span class="hidden-sm-and-down mr-1" v-text="aboutText" />
        <TreeShakenIcon icon="mdi-menu-down" />
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
import TreeShakenIcon from '@/components/TreeShakenIcon.vue';
const navigationStore = useNavigationStore();
const aboutText = navigationStore.about.aboutText;
const aboutIcon = navigationStore.about.icon;
</script>
