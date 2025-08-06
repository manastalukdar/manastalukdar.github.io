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
          <h1>Board Memberships</h1>
        </v-row>
        <p />
        <!--eslint-disable-next-line vue/no-v-html-->
        <div class="pl-2 pb-2 markdown-content" v-html="boardMemberships" />

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
import fm from 'front-matter'
import mdit from 'markdown-it'
import { computedAsync } from '@vueuse/core'
import breadcrumbs from '../../../../components/breadcrumbs'
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
import getTargetBlankLinkRender from "~/utils/markdownRenderHelpers.ts";
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
const appOwner = globalDataStore.appOwner;
const currentHref = navigationStore.about.aboutItems[0].professionalItems[3].engagementsItems[2].href;
const boardMembershipsText = navigationStore.about.aboutItems[0].professionalItems[3].engagementsItems[2].text;
const professionalText = navigationStore.about.aboutItems[0].professionalText;
const engagementsText = navigationStore.about.aboutItems[0].professionalItems[3].engagementsText;
const engagementsHref = navigationStore.about.aboutItems[0].professionalItems[3].href;
const aboutText = navigationStore.about.aboutText;
const currentPage =
  boardMembershipsText +
  ' | ' +
  engagementsText +
  ' | ' +
  professionalText +
  ' | ' +
  navigationStore.about.aboutText;
const title = currentPage + ' || ' + appOwner;
const description = 'Board Memberships.';
const url = baseUrl + currentHref;
const breadcrumbsData = [
  {
    title: 'Home',
    disabled: false,
    href: '/',
    exact: true,
  },
  {
    title: aboutText,
    disabled: true,
    exact: true,
  },
  {
    title: professionalText,
    disabled: true,
    exact: true,
  },
  {
    title: engagementsText,
    disabled: false,
    href: engagementsHref,
    exact: true,
  },
  {
    title: boardMembershipsText,
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
const md = new mdit({
  html: true,
  linkify: true,
  typographer: true,
});
getTargetBlankLinkRender(md);
const boardMemberships = computedAsync(async () => {
  try {
    const fileContent = await import('../content-engagements/board-memberships.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const { paperize } = usePaperizer('printMe',  {
  styles: [
  //'https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css',
    '/styles/print-generic.css'
  ]
});
const print = () => {
  paperize()
};
</script>
