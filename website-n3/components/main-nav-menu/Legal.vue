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
        <span class="hidden-sm-and-down mr-1" v-text="legalText" />
      </v-btn>
    </template>
  </v-menu>
</template>

<script>
import { useNavigationStore } from '@/stores/Navigation'
const navigationStore = useNavigationStore()
export default {
  data: () => ({
    legalText: navigationStore.legal.legalText,
    legalPath: navigationStore.legal.legalPath,
  }),
  computed: {}
}
</script>
