<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsDataComputed.breadcrumbsData" />
    <p />
    <v-row>
      <v-col cols="12">
        This a personal website and has nothing to do with my employers, past
        and present. Any content here does not constitute endorsement or
        guarantees of anything. I hold the right to determine exclusions to this
        disclaimer. My resume provided through this site being an obvious exclusion.
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import breadcrumbs from '../components/breadcrumbs';
import { computed } from 'vue';
import { useNavigationStore } from '@/stores/Navigation';
import { useGlobalDataStore } from '@/stores/GlobalData';
const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const appOwner = globalDataStore.appOwner;
const currentPage = navigationStore.legal.legalText;
const currentHref = navigationStore.legal.legalPath;
const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public.baseUrl;
const description = 'Legal disclaimer.';
const breadcrumbsData = [
  {
    title: 'Home',
    disabled: false,
    href: '/',
    exact: true,
  },
  {
    title: 'Legal',
    disabled: false,
    href: currentHref,
    exact: true,
  },
];
const title = currentPage + ' || ' + appOwner;
const url = baseUrl + currentHref;
const breadcrumbsStructuredDataArray = breadcrumbsData.map(
  (item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@id': baseUrl + item.to,
      name: item.text,
    },
  })
);
const breadcrumbsStructuredData = {
  '@context': 'http://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbsStructuredDataArray,
};
const breadcrumbsDataComputed = reactive({ breadcrumbsData: breadcrumbsData });
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
components: {
  breadcrumbs
}
</script>

<style></style>
