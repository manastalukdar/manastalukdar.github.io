<template>
  <v-menu bottom left offset-y max-height="500">
    <template v-slot:activator="{ props }">
      <v-btn :aria-label="contactText" text style="min-width: 48px" v-bind="props">
        <span class="hidden-sm-and-down mr-1" v-text="contactText" />
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list density="default">
      <ContactMenuItems />
    </v-list>
  </v-menu>
</template>

<script>
import { useNavigationStore } from '@/stores/Navigation'
const navigationStore = useNavigationStore()
import ContactMenuItems from './ContactMenuItems.vue'
export default {
  data: () => ({
    contactText: navigationStore.contact.contactText
  }),
  components: {
    ContactMenuItems,
  },
  computed: {}
}
</script>
