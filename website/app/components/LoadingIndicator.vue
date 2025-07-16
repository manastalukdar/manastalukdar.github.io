<template>
  <v-overlay
    v-model="loadingStore.isLoading"
    class="loading-overlay"
    persistent
    scrim="rgba(0, 0, 0, 0.4)"
  >
    <div class="loading-container">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="4"
      />
      <v-fade-transition>
        <div
          v-if="loadingStore.loadingMessage"
          class="loading-message mt-4"
        >
          {{ loadingStore.loadingMessage }}
        </div>
      </v-fade-transition>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
import { useLoadingStore } from '~/stores/Loading'

const loadingStore = useLoadingStore()
</script>

<style scoped>
.loading-overlay {
  z-index: 9999;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-message {
  color: white;
  text-align: center;
  font-size: 1rem;
  max-width: 300px;
}
</style>