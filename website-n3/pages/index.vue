<template>
  <v-container>
    <v-row class="px-2 pb-2">
      <aboutBlurb />
    </v-row>
  </v-container>
</template>

<script>
import aboutBlurb from '../components/home-page/about-blurb.vue'
export default {
  components: {
    aboutBlurb,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
