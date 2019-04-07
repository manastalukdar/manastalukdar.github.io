<template>
  <v-menu attach bottom left offset-y max-height="500">
    <v-btn
      slot="activator"
      :aria-label="legalText"
      flat
      :to="legalPath"
      style="min-width: 48px"
    >
      <span class="hidden-sm-and-down mr-1" v-text="legalText" />
    </v-btn>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({}),
  computed: mapState({
    legalText: state => state.MainNavMenu.legal.legalText,
    legalPath: state => state.MainNavMenu.legal.legalPath
  })
}
</script>
