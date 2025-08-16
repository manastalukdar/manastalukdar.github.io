<template>
  <v-menu class="text-center" bottom left offset-y max-height="500">
    <template v-slot:activator="{ props }">
      <v-btn :aria-label="contactText" text style="min-width: 48px" v-bind="props">
        <TreeShakenIcon :icon="contactIcon" class="mr-1" />
        <span class="hidden-sm-and-down mr-1" v-text="contactText" />
        <TreeShakenIcon icon="mdi-menu-down" />
      </v-btn>
    </template>
    <v-list density="default">
      <ContactMenuItems />
    </v-list>
  </v-menu>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
import ContactMenuItems from './ContactMenuItems.vue';
import TreeShakenIcon from '@/components/TreeShakenIcon.vue';

const navigationStore = useNavigationStore();
const contactText = navigationStore.contact.contactText;
const contactIcon = navigationStore.contact.icon;
</script>
