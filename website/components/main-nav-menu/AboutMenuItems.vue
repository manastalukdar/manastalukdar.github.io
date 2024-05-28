<template>
  <div>
    <v-menu class="text-center" location=start left offset-y max-height="800">
      <template v-slot:activator="{ props }">
        <v-list-item :key="professionalText" v-bind="props">
          <v-avatar>
            <v-icon>{{ professionalIcon }}</v-icon>
          </v-avatar>
          <v-list-item-title class="wrap-text text-center" v-text="professionalText" />
          <v-icon>mdi-menu-left</v-icon>
        </v-list-item>
      </template>
      <v-list density="default">
        <AboutProfessionalMenuItems />
      </v-list>
    </v-menu>
    <v-list-item v-for="item in aboutItems" :key="item.text" :to="item.href">
      <v-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-avatar>
      <v-list-item-title class="wrap-text" v-text="item.text" />
    </v-list-item>
  </div>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
import AboutProfessionalMenuItems from './AboutProfessionalMenuItems.vue';
const navigationStore = useNavigationStore();
const professionalText = navigationStore.about.aboutItems[0].professionalText;
const professionalIcon = navigationStore.about.aboutItems[0].icon;
const aboutItems = navigationStore.about.aboutItems.filter(function (item) {
  return 'href' in item
});
</script>
