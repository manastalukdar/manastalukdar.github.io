<template>
  <div>
    <v-list-item :key="engagementsText" :to="engagementsHref">
      <v-avatar>
        <TreeShakenIcon :icon="engagementsIcon" />
      </v-avatar>
      <v-list-item-title class="wrap-text" v-text="engagementsText" />
    </v-list-item>
    <v-list-item v-for="item in aboutProfessionalEngagementsItems" :key="item.text" :to="item.href">
      <v-avatar>
        <TreeShakenIcon :icon="item.icon" />
      </v-avatar>
      <v-list-item-title class="wrap-text" v-text="item.text" />
    </v-list-item>
  </div>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
import TreeShakenIcon from '@/components/TreeShakenIcon.vue';

const navigationStore = useNavigationStore();
const aboutProfessionalEngagementsItems = navigationStore.about.aboutItems[0].professionalItems[3].engagementsItems;
const engagementsText = "Summary"; //navigationStore.about.aboutItems[0].professionalItems[3].engagementsText;
const engagementsHref = navigationStore.about.aboutItems[0].professionalItems[3].href;
const engagementsIcon = navigationStore.about.aboutItems[0].professionalItems[3].icon;
</script>
