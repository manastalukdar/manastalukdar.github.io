<template>
  <v-container>
    <v-row class="px-2 pb-2">
      <aboutBlurb />
    </v-row>

    <v-row class="px-2 py-2">
      <v-col sm="6" class="py-2" cols="12">
        <v-row class="fill-height">
          <!-- <recentPostsHomePage :posts-list="blogMetadata" /> -->
        </v-row>
      </v-col>

      <v-col sm="6" class="py-2 d-flex flex-column" cols="12">
        <v-row class="flex-grow-0 pb-2">
          <!-- <socialMediaAndResumeLinks /> -->
        </v-row>
        <v-row class="flex-grow-1 pt-2">
          <featured />
        </v-row>
      </v-col>
    </v-row>

    <v-row class="px-2 py-2">
      <!-- <highlights /> -->
    </v-row>

    <v-row class="px-2 py-2">
      <!-- <interests /> -->
    </v-row>

    <v-row class="px-2 py-2">
      <!-- <recentUpdates /> -->
    </v-row>
  </v-container>
</template>

<script>
import aboutBlurb from '../components/home-page/about-blurb.vue'
import featured from '../components/home-page/featured.vue'
export default {
  components: {
    aboutBlurb,
    featured
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
