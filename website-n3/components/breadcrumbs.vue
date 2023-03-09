<template>
  <v-row class="app pt-3">
    <v-col cols="12">
      <v-card color="cardColor" raised elevation="8">
        <div>
          <v-breadcrumbs
            :items="breadcrumbs"
            class="justify-center"
          >
            <template v-slot:divider>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
          </v-breadcrumbs>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  breadcrumbs: Array
})
</script>
