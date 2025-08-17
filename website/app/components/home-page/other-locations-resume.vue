<template>
  <v-col cols="12">
    <v-card color="cardColor" class="pa-3  pt-5 fill-height" raised elevation="8">
      <v-row class="pa-3 px-15 justify-space-evenly">
        <v-list-item
          v-for="item in otherLocations"
          :key="item.text"
          :href="item.href"
          :target="item.target"
          class="col-4 px-2 justify-center"
        >
          <TreeShakenIcon :icon="item.icon" size="large" />
        </v-list-item>
      </v-row>
      <v-row class="pa-3" justify="center">
        <v-list-item
          :key="aboutItems[0].professionalItems[1].text"
          :to="aboutItems[0].professionalItems[1].href"
          class="text-center"
        >
          <v-list-item-title
            class="font-weight-medium"
            v-text="aboutItems[0].professionalItems[1].text"
          />
        </v-list-item>
      </v-row>
    </v-card>
  </v-col>
</template>

<script setup>
import { mapState } from 'pinia'
import { useNavigationStore } from '@/stores/Navigation'
const navigationStore = useNavigationStore()
const otherLocations = navigationStore.contact.otherLocations.filter(item => !item.text.includes('Scholar'));
const aboutItems = navigationStore.about.aboutItems;
</script>

<style></style>
