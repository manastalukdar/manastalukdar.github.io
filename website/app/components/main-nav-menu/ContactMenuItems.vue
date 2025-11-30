<template>
  <div>
    <v-list-item :to="contactForm.href">
      <v-avatar>
        <TreeShakenIcon :icon="contactForm.icon" />
      </v-avatar>
      <v-list-item-title v-text="contactForm.text" />
    </v-list-item>
    <v-divider />
    <v-list-subheader>{{ subHeaderTextOtherLocationsText }}</v-list-subheader>
    <v-list-item
      v-for="item in otherLocations"
      :key="item.text"
      :href="item.href"
      :target="item.target"
    >
      <v-avatar>
        <TreeShakenIcon :icon="item.icon" />
      </v-avatar>
      <v-list-item-title v-text="item.text" />
    </v-list-item>
  </div>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
import TreeShakenIcon from '@/components/TreeShakenIcon.vue';

const navigationStore = useNavigationStore();
const subHeaderTextOtherLocationsText = navigationStore.contact.subHeaderTextOtherLocations.text;
const contactForm = navigationStore.contact.contactForm;
const otherLocations = navigationStore.contact.otherLocations;
</script>
