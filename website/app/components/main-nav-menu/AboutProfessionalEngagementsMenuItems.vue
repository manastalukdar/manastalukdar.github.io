<template>
  <div>
    <v-list-item :key="engagementsText" :to="engagementsHref">
      <v-avatar>
        <v-icon>{{ engagementsIcon }}</v-icon>
      </v-avatar>
      <v-list-item-title class="wrap-text" v-text="engagementsText" />
    </v-list-item>
    <v-list-item v-for="item in aboutProfessionalEngagementsItems" :key="item.text" :to="item.href">
      <v-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-avatar>
      <v-list-item-title class="wrap-text" v-text="item.text" />
    </v-list-item>
  </div>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
const navigationStore = useNavigationStore();
const aboutProfessionalEngagementsItems = navigationStore.about.aboutItems[0].professionalItems[3].engagementsItems;
const engagementsText = "Summary"; //navigationStore.about.aboutItems[0].professionalItems[3].engagementsText;
const engagementsHref = navigationStore.about.aboutItems[0].professionalItems[3].href;
const engagementsIcon = navigationStore.about.aboutItems[0].professionalItems[3].icon;
</script>
