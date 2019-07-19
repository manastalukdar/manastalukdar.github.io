<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-card color="cardColor" class="pa-3" raised elevation="8">
        <v-flex xs12>
          <v-list>
            <v-layout row justify-center>
              <v-list-item
                v-for="item in socialMediaItems"
                :key="item.text"
                :href="item.href"
                :target="item.target"
                class="justify-center"
              >
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item>
            </v-layout>
          </v-list>
        </v-flex>
        <v-flex xs12>
          <v-list>
            <v-layout row justify-center wrap>
              <v-list-item
                :key="aboutItems[0].text"
                :to="aboutItems[0].href"
                class="text-xs-center"
              >
                <v-list-item-title v-text="aboutItems[0].text" />
              </v-list-item>
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
      socialMediaItems: state => state.Navigation.contact.socialMediaItems,
      aboutItems: state => state.Navigation.about.aboutItems
    })
  }
}
</script>

<style></style>
