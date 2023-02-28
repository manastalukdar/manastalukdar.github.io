<template>
  <v-menu attach bottom left offset-y max-height="500">
    <template #activator="{ on }">
      <v-btn
        :aria-label="legalText"
        text
        :to="legalPath"
        style="min-width: 48px"

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
