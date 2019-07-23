<template>
  <div>
    <v-list-item :to="contactForm.href">
      <v-list-item-avatar>
        <v-icon>{{ contactForm.icon }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-title v-text="contactForm.text" />
    </v-list-item>
    <v-divider />
    <v-subheader v-text="subHeaderTextSocialMedia.text" />
    <v-list-item
      v-for="item in socialMediaItems"
      :key="item.text"
      :href="item.href"
      :target="item.target"
    >
      <v-list-item-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-title v-text="item.text" />
    </v-list-item>
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
