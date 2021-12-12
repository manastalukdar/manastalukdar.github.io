<template>
  <v-menu attach bottom left offset-y max-height="500">
    <template #activator="{ on }">
      <v-btn
        :aria-label="legalText"
        text
        :to="legalPath"
        style="min-width: 48px"
        v-on="on"
      >
        <span class="hidden-sm-and-down mr-1" v-text="legalText" />
      </v-btn>
    </template>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({}),
  computed: mapState({
    legalText: (state) => state.Navigation.legal.legalText,
    legalPath: (state) => state.Navigation.legal.legalPath,
  }),
}
</script>
