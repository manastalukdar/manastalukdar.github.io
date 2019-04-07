<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-card :color="cardColor" class="pa-3" raised elevation="8">
        <v-flex xs12>
          <v-list>
            <v-layout row justify-center>
              <v-list-tile
                v-for="item in socialMediaItems"
                :key="item.text"
                :href="item.href"
                :target="item.target"
              >
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
              <v-list-tile :key="aboutItems[0].text" :to="aboutItems[0].href">
                <v-list-tile-title v-text="aboutItems[0].text" />
              </v-list-tile>
            </v-layout>
          </v-list>
        </v-flex>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      socialMediaItems: state => state.MainNavMenu.contact.socialMediaItems,
      aboutItems: state => state.MainNavMenu.about.aboutItems
    }),
    cardColor() {
      return this.$store.getters['GlobalData/getCardColor']
    }
  }
}
</script>

<style scoped>
.theme--dark .v-list {
  background: #263238 !important;
}
</style>
