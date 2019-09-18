<template>
  <v-col cols="12" class="px-0 py-0">
    <v-card color="cardColor" class="pa-3" raised elevation="8">
      <v-row class="title px-3" justify="center">
        <span>Featured</span>
      </v-row>
      <p />
      <v-row class="px-6 pb-6" justify="center">
        <nuxt-link to="/blog/tag/engineering-leadership/"
          >Blog Posts on Engineering Leadership</nuxt-link
        >
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
export default {}
</script>
