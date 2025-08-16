<template>
  <v-menu bottom left class="text-center" offset-y max-height="500">
    <template v-slot:activator="{ props }">
      <v-btn text :aria-label="blogText" style="min-width: 48px" v-bind="props">
        <TreeShakenIcon :icon="blogIcon" class="mr-1" />
        <span class="hidden-sm-and-down mr-1" v-text="blogText" />
        <TreeShakenIcon icon="mdi-menu-down" />
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
import TreeShakenIcon from '@/components/TreeShakenIcon.vue';
const navigationStore = useNavigationStore();
const blogText = navigationStore.blog.blogText;
const blogIcon = navigationStore.blog.icon;
</script>
