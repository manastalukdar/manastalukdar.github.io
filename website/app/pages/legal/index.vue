<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsDataComputed.breadcrumbsData" />
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
          <v-row class="text-h6 px-3 py-3 page-header justify-center">
            <h1>Legal Information & Licensing</h1>
          </v-row>
          <p />

          <client-only>
            <v-expansion-panels multiple v-model="panelLegal">

              <!-- Copyright & Ownership Section -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon>mdi-copyright</v-icon>&nbsp;&nbsp;Copyright & Ownership
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pl-2 pb-2 markdown-content" v-html="copyrightContent" />
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Creative Commons License Section -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon>mdi-creative-commons</v-icon>&nbsp;&nbsp;Creative Commons License (CC BY-NC-ND 4.0)
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pl-2 pb-2 markdown-content" v-html="ccLicenseContent" />
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- AI Training Policy Section -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon>mdi-robot</v-icon>&nbsp;&nbsp;AI Training & Data Usage Policy
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pl-2 pb-2 markdown-content" v-html="aiPolicyContent" />
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Professional Disclaimer Section -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon>mdi-account-tie</v-icon>&nbsp;&nbsp;Professional Disclaimer
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pl-2 pb-2 markdown-content" v-html="professionalDisclaimerContent" />
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Website Terms Section -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon>mdi-file-document-outline</v-icon>&nbsp;&nbsp;Website Terms & Conditions
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pl-2 pb-2 markdown-content" v-html="websiteTermsContent" />
                </v-expansion-panel-text>
              </v-expansion-panel>

            </v-expansion-panels>
          </client-only>

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
import breadcrumbs from "~/components/breadcrumbs";
import { useNavigationStore } from '@/stores/Navigation';
import { useGlobalDataStore } from '@/stores/GlobalData';
import getTargetBlankLinkRender from '~/utils/markdownRenderHelpers.ts';

const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const appOwner = globalDataStore.appOwner;
const currentPage = navigationStore.legal.legalText;
const currentHref = navigationStore.legal.legalPath;
const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public.baseUrl;
const description = 'Legal information, Creative Commons licensing, and terms of use for manastalukdar.github.io';

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
      '@id': baseUrl + item.href,
      name: item.title,
    },
  })
);

const breadcrumbsStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbsStructuredDataArray,
};

// Legal page structured data
const legalPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Legal Information & Licensing',
  description: description,
  url: url,
  license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  copyrightHolder: {
    '@type': 'Person',
    name: appOwner
  },
  copyrightYear: new Date().getFullYear(),
  inLanguage: 'en-US'
};

const breadcrumbsDataComputed = reactive({ breadcrumbsData: breadcrumbsData });

// Markdown setup - following awards.vue pattern
const md = new mdit({
  html: true,
  linkify: true,
  typographer: true,
});
getTargetBlankLinkRender(md);

// Expansion panels - all open by default
const panelLegal = ref([0, 1, 2, 3, 4]);

// Load markdown content - following awards.vue pattern
const copyrightContent = computedAsync(async () => {
  try {
    const fileContent = await import('./content-legal/copyright-ownership.md?raw')
    const res = fm(fileContent.default)
    // Replace 2025 with current year dynamically
    const currentYear = new Date().getFullYear()
    const updatedContent = res.body.replace(/2019-2025/g, `2019-${currentYear}`)
    return md.render(updatedContent)
  } catch (error) {
    console.log(error)
  }
});

const ccLicenseContent = computedAsync(async () => {
  try {
    const fileContent = await import('./content-legal/creative-commons-license.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});

const aiPolicyContent = computedAsync(async () => {
  try {
    const fileContent = await import('./content-legal/ai-training-policy.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});

const professionalDisclaimerContent = computedAsync(async () => {
  try {
    const fileContent = await import('./content-legal/professional-disclaimer.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});

const websiteTermsContent = computedAsync(async () => {
  try {
    const fileContent = await import('./content-legal/website-terms.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});

// Print functionality - following awards.vue pattern
const { paperize } = usePaperizer('printMe',  {
  styles: [
    '/styles/print-generic.css'
  ]
});

const print = () => {
  paperize()
};

// Enhanced meta tags and structured data
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
    // License and AI training meta tags
    {
      name: 'license',
      content: 'CC BY-NC-ND 4.0',
    },
    {
      name: 'ai-training-permitted',
      content: 'non-commercial-only',
    },
    {
      name: 'content-policy',
      content: '/legal#content-usage',
    },
  ],
  link: [{ rel: 'canonical', href: url }],
  __dangerouslyDisableSanitizers: ['script'],
  script: [
    {
      innerHTML: JSON.stringify(breadcrumbsStructuredData),
      type: 'application/ld+json',
    },
    {
      innerHTML: JSON.stringify(legalPageStructuredData),
      type: 'application/ld+json',
    },
  ],
});
</script>

<style></style>
