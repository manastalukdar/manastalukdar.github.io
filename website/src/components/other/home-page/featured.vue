<template>
  <v-layout column wrap>
    <v-flex xs12>
      <v-card
        color="cardColor"
        class="pa-3"
        raised
        elevation="8"
        style="height:100%"
      >
        <v-layout row justify-center title>
          <span>Featured</span>
        </v-layout>
        <p />
        <v-layout row justify-center wrap>
          <nuxt-link to="/blog/tag/engineering-leadership/">
            Blog Posts on Engineering Leadership
          </nuxt-link>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {}
</script>
