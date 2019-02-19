<template>
  <v-menu
    attach
    bottom
    left
    offset-y
    max-height="500"
  >
    <v-btn
      slot="activator"
      :aria-label="contactText"
      flat
      style="min-width: 48px"
    >
      <span
        class="hidden-sm-and-down mr-1"
        v-text="contactText"
      />
      <v-icon dark>arrow_drop_down</v-icon>
    </v-btn>
    <v-list dense>
      <v-list-tile :to="contactForm.href">
        <v-list-tile-avatar>
            <v-icon>{{ contactForm.icon }}</v-icon>
          </v-list-tile-avatar>
        <v-list-tile-title v-text="contactForm.text"></v-list-tile-title>
      </v-list-tile>
      <v-divider />
      <v-subheader v-text="subHeaderTextSocialMedia.text" />
        <v-list-tile
          v-for="item in socialMediaItems"
          :key="item.text"
          :href="item.href"
          :target="item.target">
          <v-list-tile-avatar>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title v-text="item.text"></v-list-tile-title>
        </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    computed: mapState({
      contactText: state => state.MainNavMenu.contact.contactText,
      subHeaderTextSocialMedia: state => state.MainNavMenu.contact.subHeaderTextSocialMedia,
      contactForm: state => state.MainNavMenu.contact.contactForm,
      socialMediaItems: state => state.MainNavMenu.contact.socialMediaItems
    }),
    data: () => ({})
  }
</script>
