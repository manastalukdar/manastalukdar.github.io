<template>
  <v-footer
    app
    dark
    height="auto"
  >
    <v-card
      class="flex"
      flat
      tile
    >
      <v-card-actions class="dark blue darken-3 py-3 justify-center">
        &copy;&nbsp;{{copyrightStartYear}}—{{copyrightEndYear}}&nbsp;<strong>{{ appOwner }}</strong>
      </v-card-actions>
    </v-card>
  </v-footer>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
      appOwner: state => state.GlobalData.appOwner,
      copyrightStartYear: state => state.GlobalData.copyrightStartYear,
      copyrightEndYear: state => state.GlobalData.copyrightEndYear
    })
}
</script>
