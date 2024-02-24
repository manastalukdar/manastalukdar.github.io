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
          <span>Professional Commitments</span>
        </v-row>
        <p />
        <v-expansion-panels multiple v-model="panel">
          <v-expansion-panel>
            <v-expansion-panel-title>
              Professional Memberships and Affiliations
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="pl-2 pb-2 markdown-content" v-html="membershipsAffiliations" />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              Fellowships
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="pl-2 pb-2 markdown-content" v-html="fellowships" />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              Board Memberships
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="pl-2 pb-2 markdown-content" v-html="boardMemberships" />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              Judging Roles
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="pl-2 pb-2 markdown-content" v-html="judgingRoles" />
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    Past
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div class="pl-2 pb-2 markdown-content" v-html="judgingRolesPast" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              Advisory Roles
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="pl-2 pb-2 markdown-content" v-html="advisoryRoles" />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              Talks
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="pl-2 pb-2 markdown-content" v-html="talks" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <div>
        <p/>
          I am open to similar roles. For details please see <nuxt-link to="/about/services/">here</nuxt-link>.
        </div>
        <!--eslint-disable-next-line vue/no-v-html-->
        <!-- <div class="pl-2 pb-2 markdown-content" v-html="professionalCommitments" /> -->

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
import breadcrumbs from '../../components/breadcrumbs'
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
import getTargetBlankLinkRender from '../../utils/markdownRenderHelpers.ts';
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
  navigationStore.about.aboutItems[2].text +
  ' | ' +
  navigationStore.about.aboutText;
const currentHref = navigationStore.about.aboutItems[2].href;
const professionalCommitmentsText = navigationStore.about.aboutItems[2].text;
const title = currentPage + ' || ' + appOwner;
const description = 'Listing of professional commitments outside of day job.';
const url = baseUrl + currentHref;
const breadcrumbsData = [
  {
    title: 'Home',
    disabled: false,
    href: '/',
    exact: true,
  },
  {
    title: professionalCommitmentsText,
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
const panel = ref([0, 1, 2, 3, 4, 5]);
const membershipsAffiliations = computedAsync(async () => {
  try {
    const fileContent = await import('./pc-content/memberships-affiliations.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const fellowships = computedAsync(async () => {
  try {
    const fileContent = await import('./pc-content/fellowships.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const boardMemberships = computedAsync(async () => {
  try {
    const fileContent = await import('./pc-content/board-memberships.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const judgingRoles = computedAsync(async () => {
  try {
    const fileContent = await import('./pc-content/judging-roles.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const judgingRolesPast = computedAsync(async () => {
  try {
    const fileContent = await import('./pc-content/judging-roles-past.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const advisoryRoles = computedAsync(async () => {
  try {
    const fileContent = await import('./pc-content/advisory-roles.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const talks = computedAsync(async () => {
  try {
    const fileContent = await import('./pc-content/talks.md?raw')
    const res = fm(fileContent.default)
    return md.render(res.body)
  } catch (error) {
    console.log(error)
  }
});
const { paperize } = usePaperizer('printMe',  {
  styles: [
  //'https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css',
    '/style/print-generic.css'
  ]
});
const print = () => {
  paperize()
};
</script>
