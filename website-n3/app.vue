<template>
  <v-app>
    <v-main>
      <v-container id="content-body-container" class="content-body pa-3">
        <transition name="fade">
          <!-- component matched by the route will render here -->
          <NuxtPage />
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
export default {
};
</script>
