<template>
  <v-container>
    <v-layout
      wrap
    >
      <v-flex xs12>
        <v-layout row justify-center wrap title>
          <p>
            {{ postMetadata.title }}
          </p>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    postMetadata: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
}
</script>
