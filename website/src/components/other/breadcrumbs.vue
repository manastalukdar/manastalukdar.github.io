<template>
  <v-layout wrap app>
    <v-flex xs12>
      <v-card>
        <div>
          <v-breadcrumbs
            :items="breadcrumbs"
            divider=">"
            justify-center
          ></v-breadcrumbs>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
