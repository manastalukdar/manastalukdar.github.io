<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-layout text-xs-center wrap>
      <v-flex xs12>
        <v-form
          ref="form"
          v-model="form"
          action="https://formspree.io/manas.talukdar@gmail.com"
          method="POST"
        >
          <v-text-field
            v-model="name"
            name="name"
            :rules="[rules.length(2)]"
            :counter="2"
            box
            color="light"
            label="Name"
            type="text"
          />
          <v-text-field
            v-model="email"
            name="email"
            :rules="[rules.email]"
            box
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
            box
            color="light"
            label="Message"
          />
          <v-divider />
          <v-card-actions>
            <v-btn flat @click="$refs.form.reset()">
              Clear
            </v-btn>
            <v-spacer />
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../other/breadcrumbs'
export default {
  components: {
    breadcrumbs
  },
  data: () => ({
    name: undefined,
    email: undefined,
    message: '',
    form: false,
    isLoading: false,
    rules: {
      email: v => (v || '').match(/@/) || 'Please enter a valid email',
      length: len => v =>
        (v || '').length >= len || `Invalid character length, required ${len}`,
      required: v => !!v || 'This field is required'
    },
    description: 'Contact Form.'
  }),
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state =>
        state.Navigation.contact.contactText +
        ' | ' +
        state.Navigation.contact.contactForm.text,
      currentHref: state => state.Navigation.contact.contactForm.href
    }),
    breadcrumbs: function() {
      return [
        {
          text: 'Home',
          disabled: false,
          to: '/'
        },
        {
          text: 'Contact Form',
          disabled: false,
          to: this.currentHref
        }
      ]
    }
  },
  asyncData({ store, params, env, payload }) {
    return {
      baseUrl: env.baseURL
    }
  },
  head() {
    const title = this.currentPage + ' || ' + this.appOwner
    const url = this.baseUrl + this.currentHref
    return {
      title: title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: title
        },
        {
          hid: 'og-title',
          name: 'og:title',
          property: 'og:title',
          content: title
        },
        {
          hid: 'og-url',
          name: 'og:url',
          property: 'og:url',
          content: url
        },
        {
          hid: 'og-description',
          name: 'og:description',
          property: 'og:description',
          content: this.description
        }
      ],
      link: [{ rel: 'canonical', href: url }]
    }
  },
  methods: {
    submit() {
      this.$v.$touch()
    }
  }
}
</script>

<style></style>
