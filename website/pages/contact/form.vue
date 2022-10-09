<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-row class="text-center">
      <v-col cols="12">
        <v-form
          ref="form"
          v-model="form"
          action="https://formspree.io/f/xoqblqlq"
          method="POST"
        >
          <v-text-field
            v-model="name"
            name="name"
            :rules="[rules.length(2)]"
            :counter="2"
            filled
            color="light"
            label="Name"
            type="text"
          />
          <v-text-field
            v-model="email"
            name="email"
            :rules="[rules.email]"
            filled
            color="light"
            label="Email address"
            type="email"
          />
          <v-textarea
            v-model="message"
            name="message"
            auto-grow
            :rules="[rules.length(5)]"
            :counter="5"
            filled
            color="light"
            label="Message"
          />
          <v-divider />
          <v-card-actions>
            <v-btn text @click="$refs.form.reset()"> Clear </v-btn>
            <div class="flex-grow-1" />
            <v-btn
              :disabled="!form"
              :loading="isLoading"
              class="white--text"
              color="light"
              depressed
              type="submit"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../components/breadcrumbs'
export default {
  components: {
    breadcrumbs,
  },
  asyncData({ store, params, $config, payload }) {
    return {
      baseUrl: $config.baseURL,
    }
  },
  data: () => ({
    name: undefined,
    email: undefined,
    message: '',
    form: false,
    isLoading: false,
    rules: {
      email: (v) => (v || '').match(/@/) || 'Please enter a valid email',
      length: (len) => (v) =>
        (v || '').length >= len || `Invalid character length, required ${len}`,
      required: (v) => !!v || 'This field is required',
    },
    description: 'Contact Form.',
  }),
  head() {
    const title = this.currentPage + ' || ' + this.appOwner
    const url = this.baseUrl + this.currentHref
    const breadcrumbsStructuredDataArray = this.breadcrumbs.map(
      (item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': this.baseUrl + item.to,
          name: item.text,
        },
      })
    )
    const breadcrumbsStructuredData = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbsStructuredDataArray,
    }
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description,
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: title,
        },
        {
          hid: 'og-title',
          name: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og-url',
          name: 'og:url',
          property: 'og:url',
          content: url,
        },
        {
          hid: 'og-description',
          name: 'og:description',
          property: 'og:description',
          content: this.description,
        },
      ],
      link: [{ rel: 'canonical', href: url }],
      __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          innerHTML: JSON.stringify(breadcrumbsStructuredData),
          type: 'application/ld+json',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      appOwner: (state) => state.GlobalData.appOwner,
      currentPage: (state) =>
        state.Navigation.contact.contactForm.text +
        ' | ' +
        state.Navigation.contact.contactText,
      currentHref: (state) => state.Navigation.contact.contactForm.href,
    }),
    breadcrumbs() {
      return [
        {
          text: 'Home',
          disabled: false,
          to: '/',
          exact: true,
        },
        {
          text: 'Contact Form',
          disabled: false,
          to: this.currentHref,
          exact: true,
        },
      ]
    },
  },
  methods: {
    submit() {
      this.$v.$touch()
    },
  },
}
</script>

<style></style>
