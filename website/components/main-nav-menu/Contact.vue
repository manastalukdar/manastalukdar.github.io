<template>
  <v-menu attach bottom left offset-y max-height="500">
    <template #activator="{ on }">
      <v-btn :aria-label="contactText" text style="min-width: 48px" v-on="on">
        <span class="hidden-sm-and-down mr-1" v-text="contactText" />
        <v-icon> arrow_drop_down </v-icon>
      </v-btn>
    </template>
    <v-list color="headerAndFooterColor" dense>
      <ContactMenuItems />
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
import ContactMenuItems from './ContactMenuItems.vue'
export default {
  components: {
    ContactMenuItems,
  },
  data: () => ({}),
  computed: mapState({
    contactText: (state) => state.Navigation.contact.contactText,
  }),
}
</script>
