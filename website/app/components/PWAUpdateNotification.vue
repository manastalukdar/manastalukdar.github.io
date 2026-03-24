<template>
  <v-snackbar
    v-model="showNotification"
    :timeout="-1"
    color="primary"
    location="bottom"
    class="pwa-update-notification"
    elevation="8"
  >
    <div class="d-flex align-center justify-space-between w-100">
      <div class="d-flex align-center">
        <v-icon class="mr-3">mdi-download</v-icon>
        <div>
          <div class="text-subtitle-2 font-weight-medium">
            New version available
          </div>
          <div class="text-caption text-medium-emphasis">
            Tap update to get the latest features
          </div>
        </div>
      </div>
      <div class="d-flex align-center ml-4">
        <v-btn
          variant="text"
          size="small"
          @click="dismissUpdate"
          class="mr-2"
        >
          Later
        </v-btn>
        <v-btn
          variant="elevated"
          size="small"
          color="white"
          class="text-primary font-weight-medium"
          @click="applyUpdate"
          :loading="updating"
        >
          Update
        </v-btn>
      </div>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
interface PWAUpdateStore {
  hasUpdate: boolean
  showNotification: boolean
  updating: boolean
  applyUpdate: () => Promise<void>
  dismissUpdate: () => void
}

// Global composable for PWA update state
const { $pwaUpdate } = useNuxtApp()
const updateStore = $pwaUpdate as PWAUpdateStore

const showNotification = computed(() => updateStore?.showNotification || false)
const updating = computed(() => updateStore?.updating || false)

const applyUpdate = async () => {
  if (updateStore?.applyUpdate) {
    await updateStore.applyUpdate()
  }
}

const dismissUpdate = () => {
  if (updateStore?.dismissUpdate) {
    updateStore.dismissUpdate()
  }
}
</script>

<style scoped>
.pwa-update-notification {
  /* Ensure notification appears above other elements */
  z-index: 2000;
}

.pwa-update-notification :deep(.v-snackbar__wrapper) {
  min-height: 80px;
}

.text-medium-emphasis {
  opacity: 0.8;
}
</style>