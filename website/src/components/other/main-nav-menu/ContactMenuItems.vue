<template>
  <div>
    <v-list-tile :to="contactForm.href">
      <v-list-tile-avatar>
        <v-icon>{{ contactForm.icon }}</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-title v-text="contactForm.text" />
    </v-list-tile>
    <v-divider />
    <v-subheader v-text="subHeaderTextSocialMedia.text" />
    <v-list-tile
      v-for="item in socialMediaItems"
      :key="item.text"
      :href="item.href"
      :target="item.target"
    >
      <v-list-tile-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-title v-text="item.text" />
    </v-list-tile>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({}),
  computed: mapState({
    subHeaderTextSocialMedia: state =>
      state.Navigation.contact.subHeaderTextSocialMedia,
    contactForm: state => state.Navigation.contact.contactForm,
    socialMediaItems: state => state.Navigation.contact.socialMediaItems
  })
}
</script>
