<template>
  <v-container>
    <v-row class="px-2 pb-2">
      <aboutBlurb />
    </v-row>

    <v-row class="px-2 py-2">
      <v-col sm="6" class="py-2" cols="12">
        <v-row class="fill-height">
          <recentPostsHomePage :posts-list="blogMetadata" />
        </v-row>
      </v-col>

      <v-col sm="6" class="py-2 d-flex flex-column" cols="12">
        <v-row class="flex-grow-0 pb-1 pt-4 pt-sm-0">
          <socialMediaAndResumeLinks />
        </v-row>
        <v-row class="flex-grow-1 pt-2">
          <featured />
        </v-row>
      </v-col>
    </v-row>

    <v-row class="px-2 py-2">
      <recentUpdates />
    </v-row>
  </v-container>
</template>

<script setup>
import aboutBlurb from '../components/home-page/about-blurb.vue';
import recentPostsHomePage from '../components/home-page/recent-posts.vue';
import featured from '../components/home-page/featured.vue';
import socialMediaAndResumeLinks from '../components/home-page/social-media-resume.vue';
import recentUpdates from '../components/home-page/recent-updates.vue';
import { useBlogMetadataStore } from '@/stores/BlogMetadata';
import { useNavigationStore } from '@/stores/Navigation';
import { useGlobalDataStore } from '@/stores/GlobalData';
import { computed } from 'vue';
const blogMetadataStore = useBlogMetadataStore();
const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const currentHref = '/';
const socialMediaItems = navigationStore.contact.socialMediaItems;
const aboutItems = navigationStore.about.aboutItems;
const appOwner = globalDataStore.appOwner;
const homepageTitle = globalDataStore.homepageTitle;
const runtimeConfig = useRuntimeConfig(); // $config.baseURL
const route = useRoute(); // route.params
const baseUrl = runtimeConfig.public.baseUrl;
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
const blogMetadata = blogMetadataStore.getBlogMetadata();
components: {
  aboutBlurb,
  recentPostsHomePage,
  featured,
  socialMediaAndResumeLinks,
  recentUpdates
};
const breadcrumbs = [
  {
    title: 'Home',
    disabled: false,
    href: '/',
  },
];
const breadcrumbsComputed = computed({
    get() {
      return  breadcrumbs
    }
  });
const url = baseUrl + currentHref;
const breadcrumbsStructuredDataArray = breadcrumbs.map(
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
const structuredData = {
  '@context': 'http://schema.org',
  '@type': 'Person',
  name: appOwner,
  url,
  sameAs: [
    socialMediaItems[0].href,
    socialMediaItems[1].href,
    socialMediaItems[2].href,
    'https://www.facebook.com/manas.talukdar',
    'https://www.instagram.com/manastalukdar/',
    'https://www.youtube.com/channel/UCskNDdaQXOKw1pLpPVpulbA',
  ],
};
useHead({
  title: homepageTitle,
    link: [{ rel: 'canonical', href: url }],
    __dangerouslyDisableSanitizers: ['script'],
    script: [
      {
        innerHTML: JSON.stringify(structuredData),
        type: 'application/ld+json',
      },
      {
        innerHTML: JSON.stringify(breadcrumbsStructuredData),
        type: 'application/ld+json',
      },
    ],
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
