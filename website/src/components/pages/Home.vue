<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap>
      <v-flex xs12>
          <v-list>
            <v-layout row justify-center>
              <v-list-tile
                v-for="item in socialMediaItems"
                :key="item.text"
                :href="item.href"
                :target="item.target">
                <v-list-tile-avatar>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>
            </v-layout>
          </v-list>
      </v-flex>
      <v-flex xs12>
        <v-list>
            <v-layout row justify-center>
              <v-list-tile
                :key="aboutItems[0].text"
                :to="aboutItems[0].href">
                <v-list-tile-title v-text="aboutItems[0].text"></v-list-tile-title>
              </v-list-tile>
            </v-layout>
          </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: mapState({
      socialMediaItems: state => state.MainNavMenu.contact.socialMediaItems,
      aboutItems: state => state.MainNavMenu.about.aboutItems
    })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
a {
  color: #42b983;
}
</style>
