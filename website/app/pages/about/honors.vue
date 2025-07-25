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
          <span>Honors</span>
        </v-row>
        <p />
        <client-only>
          <v-expansion-panels multiple v-model="panelHonors">
            <v-expansion-panel>
              <v-expansion-panel-title>
                Member, Forbes Technology Council
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="pl-2 pb-2 markdown-content" v-html="forbesTechnologyCouncil" />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>
                Fellow of the British Computer Society (BCS)
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="pl-2 pb-2 markdown-content" v-html="bcsFellow" />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <!--<v-expansion-panel>
              <v-expansion-panel-title>
                Listed in Marquis Who's Who
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="pl-2 pb-2 markdown-content" v-html="marquisWhosWho" />
              </v-expansion-panel-text>
            </v-expansion-panel>-->
            <v-expansion-panel>
              <v-expansion-panel-title>
                Member, American Society for AI
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="pl-2 pb-2 markdown-content" v-html="americanSocietyForAi" />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <!--<v-expansion-panel>
              <v-expansion-panel-title>
                Ambassador, AI Frontier Network
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="pl-2 pb-2 markdown-content" v-html="aiFontierNetworkAmbassador" />
              </v-expansion-panel-text>
            </v-expansion-panel>-->
            <v-expansion-panel>
              <v-expansion-panel-title>
                IEEE Senior Membership
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="pl-2 pb-2 markdown-content" v-html="ieeeSeniorMembership" />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>
                Other
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="pl-2 pb-2 markdown-content" v-html="other" />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </client-only>
        <p />
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
import breadcrumbs from "~/components/breadcrumbs"
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
const currentPage =
  navigationStore.about.aboutItems[3].text +
  ' | ' +
  navigationStore.about.aboutText;
const currentHref = navigationStore.about.aboutItems[3].href;
const honorsText = navigationStore.about.aboutItems[3].text;
const title = currentPage + ' || ' + appOwner;
const description = 'Listing of recognition through honors.';
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
    title: honorsText,
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
const panelHonors = ref([0, 1, 2, 3, 4, 5, 6]);
const forbesTechnologyCouncil = computedAsync(async () => {
  try {
    const fileContent = await import('./content-honors/forbes-technology-council.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const bcsFellow = computedAsync(async () => {
  try {
    const fileContent = await import('./content-honors/bcs-fellowship.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const marquisWhosWho = computedAsync(async () => {
  try {
    const fileContent = await import('./content-honors/marquis-who’s-who.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const americanSocietyForAi = computedAsync(async () => {
  try {
    const fileContent = await import('./content-honors/american-society-for-ai.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const aiFontierNetworkAmbassador = computedAsync(async () => {
  try {
    const fileContent = await import('./content-honors/ai-frontier-network-ambassador.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const ieeeSeniorMembership = computedAsync(async () => {
  try {
    const fileContent = await import('./content-honors/ieee-senior-membership.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const other = computedAsync(async () => {
  try {
    const fileContent = await import('./content-honors/other.md?raw')
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
