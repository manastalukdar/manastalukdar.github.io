<template light>
  <v-card class="resume-wrapper">
    <no-ssr>
      <iframe
        id="resumeBox"
        name="resumeBox"
        frameborder="0"
        scrolling="no"
        src="https://manastalukdar.github.io/resume-cv"
      >
        <p>iframes are not supported by your browser.</p>
      </iframe>
    </no-ssr>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    appOwner: state => state.GlobalData.appOwner,
    currentPage: state =>
      state.MainNavMenu.about.aboutText +
      ' | ' +
      state.MainNavMenu.about.aboutItems[0].text,
    currentHref: state => state.MainNavMenu.about.aboutItems[0].href
  }),
  asyncData({ store, params, env, payload }) {
    return {
      baseUrl: env.baseURL
    }
  },
  head() {
    const title = this.currentPage + ' || ' + this.appOwner
    const description = 'Manas Talukdar resume'
    const url = this.baseUrl + this.currentHref
    return {
      title: title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        {
          hid: 'title',
          name: 'title',
          content: title
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: title
        },
        {
          hid: 'og-title',
          name: 'og-title',
          property: 'og-title',
          content: title
        },
        {
          hid: 'og-url',
          name: 'og-url',
          property: 'og-url',
          content: url
        },
        {
          hid: 'og-description',
          name: 'og-description',
          property: 'og-description',
          content: description
        }
      ],
      link: [{ rel: 'canonical', href: url }]
    }
  }
}
</script>

<style>
.resume-wrapper {
  position: relative;
  padding-bottom: 200%; /* 56.25% = 16:9 */
  padding-top: 25px;
  height: 0;
  overflow: hidden;
}
.resume-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
}
</style>
