<template>
  <div>
    <v-menu class="text-center" location=end left offset-y max-height="800">
      <template v-slot:activator="{ props }">
        <v-list-item :key="engagementsText" v-bind="props">
          <v-avatar>
            <v-icon>{{ engagementsIcon }}</v-icon>
          </v-avatar>
          <v-list-item-title class="wrap-text text-center" v-text="engagementsText" />
          <v-icon>mdi-menu-right</v-icon>
        </v-list-item>
      </template>
      <v-list density="default">
        <AboutProfessionalEngagementsItems />
      </v-list>
    </v-menu>
    <v-list-item v-for="item in aboutProfessionalItems" :key="item.text" :to="item.href">
      <v-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-avatar>
      <v-list-item-title class="wrap-text text-center" v-text="item.text" />
    </v-list-item>
  </div>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation'
import AboutProfessionalEngagementsItems from './AboutProfessionalEngagementsMenuItems.vue';
const navigationStore = useNavigationStore();
const aboutProfessionalItems = navigationStore.about.aboutItems[0].professionalItems.filter(function (item) {
  return 'text' in item
});
const engagementsText = navigationStore.about.aboutItems[0].professionalItems[3].engagementsText;
const engagementsIcon = navigationStore.about.aboutItems[0].professionalItems[3].icon;
</script>
