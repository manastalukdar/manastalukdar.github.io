<template>
  <v-container>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <p />
  <v-row>
    <v-col cols="12">
      <v-card
        color="cardColor"
        class="pa-8"
        raised
        elevation="8"
        style="height: 100%"
        id="printMe"
      >
        <v-row class="text-h5 px-3 py-3 page-header justify-center">
          <span>Interests</span>
        </v-row>
        <p />
        <interests />

        <v-row class="printButton row py-10 justify-center">
          <v-icon class="justify-center" @click="print">mdi-printer</v-icon>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script setup>
import { usePaperizer } from 'paperizer'
import breadcrumbs from '../../components/breadcrumbs'
import interests from '../components/about/interests.vue';
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const blogMetadataStore = useBlogMetadataStore();
const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public.baseUrl;
//console.log(baseUrl)
async function setupBlogMetadata() {
    try {
        if (blogMetadataStore.blogMetadata.length < runtimeConfig.public.blogPostCount) {
          await blogMetadataStore.setupBlogMetadata(runtimeConfig.public.baseUrl);
        }
    } catch (error) {
      console.log(error)
    }
};
await setupBlogMetadata();
components: {
  interests
};
const appOwner = globalDataStore.appOwner;
const currentPage =
  navigationStore.about.aboutItems[2].text +
  ' | ' +
  navigationStore.about.aboutText;
const currentHref = navigationStore.about.aboutItems[2].href;
const interestsText = navigationStore.about.aboutItems[2].text;
const title = currentPage + ' || ' + appOwner;
const description = 'Interests';
const url = baseUrl + currentHref;
const breadcrumbsData = [
  {
    title: 'Home',
    disabled: false,
    href: '/',
    exact: true,
  },
  {
    title: 'About',
    disabled: true,
    exact: true,
  },
  {
    title: interestsText,
    disabled: false,
    href: currentHref,
    exact: true,
  }
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
);
const breadcrumbsStructuredData = {
  '@context': 'http://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbsStructuredDataArray,
};
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
const { paperize } = usePaperizer('printMe',  {
  styles: [
  //'https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css',
    '/styles/print-recruiters.css'
  ]
});
const print = () => {
  paperize()
};
</script>
