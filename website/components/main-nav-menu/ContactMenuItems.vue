<template>
  <div>
    <v-list-item :to="contactForm.href">
      <v-avatar>
        <v-icon>{{ contactForm.icon }}</v-icon>
      </v-avatar>
      <v-list-item-title v-text="contactForm.text" />
    </v-list-item>
    <v-divider />
    <v-list-subheader class="text-center align-center">{{ subHeaderTextOtherLocationsText }}</v-list-subheader>
    <v-list-item
      v-for="item in otherLocations"
      :key="item.text"
      :href="item.href"
      :target="item.target"
    >
      <v-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-avatar>
      <v-list-item-title v-text="item.text" />
    </v-list-item>
  </div>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
const navigationStore = useNavigationStore();
const subHeaderTextOtherLocationsText = navigationStore.contact.subHeaderTextOtherLocations.text;
const contactForm = navigationStore.contact.contactForm;
const otherLocations = navigationStore.contact.otherLocations;
</script>
