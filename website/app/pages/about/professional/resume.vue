<template>
  <v-container id="container-resume" fluid>
    <breadcrumbs :breadcrumbs="breadcrumbsDataComputed" />
    <p />
    <v-card class="resume-wrapper">
      <client-only>
        <iframe
          id="resumeBox"
          title="resume"
          name="resumeBox"
          src="https://manas-talukdar-resume.netlify.app"
        >
          iframes are not supported by your browser.
        </iframe>
      </client-only>
    </v-card>
  </v-container>
</template>

<script>
import breadcrumbs from '../../../components/breadcrumbs'
import { useNavigationStore } from '@/stores/Navigation';
import { useGlobalDataStore } from '@/stores/GlobalData';
export default {
  setup() {
    const navigationStore = useNavigationStore();
    const globalDataStore = useGlobalDataStore();
    const appOwner = globalDataStore.appOwner;
    const currentPage =
            navigationStore.about.aboutItems[0].professionalItems[1].text +
            ' | ' +
            navigationStore.about.aboutItems[0].professionalText +
            ' | ' +
            navigationStore.about.aboutText;
    const currentHref = navigationStore.about.aboutItems[0].professionalItems[1].href;
    const resumeText = navigationStore.about.aboutItems[0].professionalItems[1].text;
    const runtimeConfig = useRuntimeConfig();
    const baseUrl = runtimeConfig.public.baseUrl;
    const title = currentPage + ' || ' + appOwner;
    const description = 'Manas Talukdar resume';
    const url = baseUrl + currentHref;
    const breadcrumbsData = [
        {
          title: 'Home',
          disabled: false,
          href: '/',
        },
        {
          title: 'About',
          disabled: true,
          exact: true,
        },
        {
          title: 'Professional',
          disabled: true,
          exact: true,
        },
        {
          title: resumeText,
          disabled: false,
          href: currentHref,
        },
      ];
    const breadcrumbsStructuredDataArray = breadcrumbsData.map(
      (item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': baseUrl + item.href,
          name: item.title,
        },
      })
    )
    const breadcrumbsStructuredData = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbsStructuredDataArray,
    }
    const breadcrumbsDataComputed = computed(()=>breadcrumbsData);
    useHead({
      title: title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: title,
        },
        {
          hid: 'og-title',
          name: 'og-title',
          property: 'og-title',
          content: title,
        },
        {
          hid: 'og-url',
          name: 'og-url',
          property: 'og-url',
          content: url,
        },
        {
          hid: 'og-description',
          name: 'og-description',
          property: 'og-description',
          content: description,
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
    });
    return {
      breadcrumbsDataComputed
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
    },
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
