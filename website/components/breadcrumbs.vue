<template>
  <v-row class="app">
    <v-col cols="12">
      <v-card color="cardColor" raised elevation="8">
        <div>
          <v-breadcrumbs
            :items="breadcrumbs"
            divider=">"
            class="justify-center"
          ></v-breadcrumbs>
        </div>
      </v-card>
    </v-col>
  </v-row>
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
