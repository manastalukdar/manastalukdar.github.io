<template>
  <div>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    computed: mapState({
      subHeaderTextSocialMedia: state => state.MainNavMenu.contact.subHeaderTextSocialMedia,
      contactForm: state => state.MainNavMenu.contact.contactForm,
      socialMediaItems: state => state.MainNavMenu.contact.socialMediaItems
    }),
    data: () => ({})
  }
</script>
