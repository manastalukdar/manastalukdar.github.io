<template>
  <v-menu class="text-center" bottom left offset-y max-height="500">
    <template v-slot:activator="{ props }">
      <v-btn :aria-label="contactText" text style="min-width: 48px" v-bind="props">
        <v-icon start>{{contactIcon}}</v-icon>
        <span class="hidden-sm-and-down mr-1" v-text="contactText" />
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list density="default">
      <ContactMenuItems />
    </v-list>
  </v-menu>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
const navigationStore = useNavigationStore();
import ContactMenuItems from './ContactMenuItems.vue';
const contactText = navigationStore.contact.contactText;
const contactIcon = navigationStore.contact.icon;
</script>
