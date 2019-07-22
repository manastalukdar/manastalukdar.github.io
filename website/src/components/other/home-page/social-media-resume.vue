<template>
  <v-col cols="12">
    <v-card color="cardColor" class="pa-3" raised elevation="8">
      <v-row class="pa-3">
        <v-list>
          <v-list-item
            v-for="item in socialMediaItems"
            :key="item.text"
            :href="item.href"
            :target="item.target"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item>
        </v-list>
      </v-row>
      <v-row class="pa-3" justify="center">
        <v-list>
          <v-list-item
            :key="aboutItems[0].text"
            :to="aboutItems[0].href"
            class="text-center"
          >
            <v-list-item-title v-text="aboutItems[0].text" />
          </v-list-item>
        </v-list>
      </v-row>
    </v-card>
  </v-col>
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
