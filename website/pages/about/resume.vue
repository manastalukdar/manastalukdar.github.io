<template>
  <v-container id="container-resume" fluid>
    <breadcrumbs :breadcrumbs="breadcrumbs" />
    <p />
    <v-card class="resume-wrapper">
      <client-only>
        <iframe
          id="resumeBox"
          name="resumeBox"
          frameborder="0"
          scrolling="no"
          src="https://manastalukdar.github.io/resume-cv"
        >
          <p>iframes are not supported by your browser.</p>
        </iframe>
      </client-only>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import breadcrumbs from '../../components/breadcrumbs'
export default {
  components: {
    breadcrumbs
  },
  asyncData({ store, params, env, payload }) {
    return {
      baseUrl: env.baseURL
    }
  },
  computed: {
    ...mapState({
      appOwner: state => state.GlobalData.appOwner,
      currentPage: state =>
        state.Navigation.about.aboutItems[0].text +
        ' | ' +
        state.Navigation.about.aboutText,
      currentHref: state => state.Navigation.about.aboutItems[0].href
    }),
    breadcrumbs() {
      return [
        {
          text: 'Home',
          disabled: false,
          to: '/'
        },
        {
          text: 'Resume',
          disabled: false,
          to: this.currentHref
        }
      ]
    }
  },
  mounted() {
    this.fixParentContainerWidthOnMount()
  },
  destroyed() {
    this.fixParentContainerWidthOnDestroy()
  },
  methods: {
    fixParentContainerWidthOnMount() {
      const cr = document.getElementById('container-resume')
      if (cr != null) {
        const parent = cr.parentElement
        if (parent.className.includes('content-body')) {
          parent.classList.remove('content-body')
        }
      }
    },
    fixParentContainerWidthOnDestroy() {
      const cr = document.getElementById('content-body-container')
      if (cr != null) {
        if (
          cr.className.includes('container') &&
          !cr.className.includes('content-body')
        ) {
          cr.classList.add('content-body')
        }
      }
    }
  },
  head() {
    const title = this.currentPage + ' || ' + this.appOwner
    const description = 'Manas Talukdar resume'
    const url = this.baseUrl + this.currentHref
    const breadcrumbsStructuredDataArray = this.breadcrumbs.map(
      (item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': this.baseUrl + item.to,
          name: item.text
        }
      })
    )
    const breadcrumbsStructuredData = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbsStructuredDataArray
    }
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
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
      link: [{ rel: 'canonical', href: url }],
      __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          innerHTML: JSON.stringify(breadcrumbsStructuredData),
          type: 'application/ld+json'
        }
      ]
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
