<template>
  <div>
    <v-list-item :to="contactForm.href">
      <v-avatar>
        <v-icon>{{ contactForm.icon }}</v-icon>
      </v-avatar>
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
      <v-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-avatar>
      <v-list-item-title v-text="item.text" />
    </v-list-item>
  </div>
</template>

<script>
import { useNavigationStore } from '@/stores/Navigation'
const navigationStore = useNavigationStore()
export default {
  data: () => ({
    subHeaderTextSocialMedia: navigationStore.contact.subHeaderTextSocialMedia,
    contactForm: navigationStore.contact.contactForm,
    socialMediaItems: navigationStore.contact.socialMediaItems
  }),
  computed: {}
}
</script>
