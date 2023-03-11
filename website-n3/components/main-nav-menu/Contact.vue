<template>
  <v-menu attach bottom left offset-y max-height="500">
    <template #activator="{ on }">
      <v-btn :aria-label="contactText" text style="min-width: 48px">
        <span class="hidden-sm-and-down mr-1" v-text="contactText" />
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list color="headerAndFooterColor" dense>
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
