<template>
  <v-menu bottom left class="text-center" offset-y max-height="500">
    <template v-slot:activator="{ props }">
      <v-btn text :aria-label="blogText" style="min-width: 48px" v-bind="props">
        <v-icon start>{{ blogIcon }}</v-icon>
        <span class="hidden-sm-and-down mr-1" v-text="blogText" />
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list density="default">
      <BlogMenuItems />
    </v-list>
  </v-menu>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
import BlogMenuItems from './BlogMenuItems.vue';
const navigationStore = useNavigationStore();
const blogText = navigationStore.blog.blogText;
const blogIcon = navigationStore.blog.icon;
</script>
