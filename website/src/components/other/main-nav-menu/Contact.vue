<template>
  <v-menu attach bottom left offset-y max-height="500">
    <v-btn
      slot="activator"
      :aria-label="contactText"
      flat
      style="min-width: 48px"
    >
      <span class="hidden-sm-and-down mr-1" v-text="contactText" />
      <v-icon>
        arrow_drop_down
      </v-icon>
    </v-btn>
    <v-list dense>
      <ContactMenuItems />
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
import ContactMenuItems from './ContactMenuItems.vue'
export default {
  components: {
    ContactMenuItems
  },
  data: () => ({}),
  computed: mapState({
    contactText: state => state.MainNavMenu.contact.contactText
  })
}
</script>
