<template>
  <v-progress-linear
    v-model="loadingStore.linearProgress"
    :active="loadingStore.isLoading"
    :indeterminate="loadingStore.linearProgress === null"
    color="primary"
    height="3"
    class="linear-loading-indicator"
    absolute
    top
  />
</template>

<script setup lang="ts">
import { useLoadingStore } from '~/stores/Loading'

const loadingStore = useLoadingStore()
</script>

<style scoped>
.linear-loading-indicator {
  z-index: 10000;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
}

/* Ensure it shows above navigation */
.linear-loading-indicator :deep(.v-progress-linear__background) {
  opacity: 0.1;
}

.linear-loading-indicator :deep(.v-progress-linear__determinate) {
  transition: width 0.3s ease;
}
</style>