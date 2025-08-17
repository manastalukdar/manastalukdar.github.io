<template>
  <v-menu bottom left offset-y max-height="500">
    <template v-slot:activator="{ props }">
      <v-btn
        :aria-label="legalText"
        text
        :to="legalPath"
        style="min-width: 48px"
        v-bind="props"
      >
        <TreeShakenIcon :icon="legalIcon" class="mr-2" />
        <span class="hidden-sm-and-down mr-1" v-text="legalText" />
      </v-btn>
    </template>
  </v-menu>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
const navigationStore = useNavigationStore();
const legalText = navigationStore.legal.legalText;
const legalPath = navigationStore.legal.legalPath;
const legalIcon = navigationStore.legal.icon;
</script>
