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
          <otherLocationsAndResumeLinks />
        </v-row>
        <v-row class="flex-grow-1 pt-2">
          <featured />
        </v-row>
      </v-col>
    </v-row>

    <v-row class="px-2 py-2">
      <testimonialCarousel />
    </v-row>

    <v-row class="px-2 py-2">
      <recentUpdates />
    </v-row>
  </v-container>
</template>

<script setup>
import aboutBlurb from "~/components/home-page/about-blurb.vue";
import recentPostsHomePage from "~/components/home-page/recent-posts.vue";
import featured from "~/components/home-page/featured.vue";
import otherLocationsAndResumeLinks from "~/components/home-page/other-locations-resume.vue";
import recentUpdates from "~/components/home-page/recent-updates.vue";
import testimonialCarousel from "~/components/home-page/testimonial-carousel.vue";
import { useBlogMetadataStore } from '@/stores/BlogMetadata';
import { useNavigationStore } from '@/stores/Navigation';
import { useGlobalDataStore } from '@/stores/GlobalData';
import { computed } from 'vue';
const blogMetadataStore = useBlogMetadataStore();
const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const currentHref = '/';
const otherLocations = navigationStore.contact.otherLocations;
const aboutItems = navigationStore.about.aboutItems;
const appOwner = globalDataStore.appOwner;
const homepageTitle = globalDataStore.homepageTitle;
const runtimeConfig = useRuntimeConfig(); // $config.baseURL
const route = useRoute(); // route.params
const baseUrl = runtimeConfig.public.baseUrl;
// Progressive enhancement: Load blog metadata without blocking page render
let blogMetadata = blogMetadataStore.getBlogMetadata();

// If no cached data, show skeleton and load in background
if (blogMetadata.length === 0) {
  // Start loading in background
  setupBlogMetadata().catch(console.error);
}

async function setupBlogMetadata() {
  try {
    if (blogMetadataStore.blogMetadata.length < runtimeConfig.public.blogPostCount) {
      await blogMetadataStore.setupBlogMetadata(runtimeConfig.public.baseUrl);
      // Update reactive reference after loading
      blogMetadata = blogMetadataStore.getBlogMetadata();
    }
  } catch (error) {
    console.log(error)
  }
};
components: {
  aboutBlurb,
  recentPostsHomePage,
  featured,
  otherLocationsAndResumeLinks,
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
    otherLocations[0].href,
    otherLocations[1].href,
    otherLocations[2].href,
    'https://www.facebook.com/manas.talukdar',
    'https://www.instagram.com/manastalukdar/',
    'https://www.youtube.com/channel/UCskNDdaQXOKw1pLpPVpulbA',
  ],
};

const organizationStructuredData = {
  '@context': 'http://schema.org',
  '@type': 'Organization',
  name: 'Manas Talukdar',
  url: baseUrl,
  logo: baseUrl + '/images/android-chrome-512x512.png',
  sameAs: [
    otherLocations[0].href,
    otherLocations[1].href,
    otherLocations[2].href,
    'https://www.facebook.com/manas.talukdar',
    'https://www.instagram.com/manastalukdar/',
    'https://www.youtube.com/channel/UCskNDdaQXOKw1pLpPVpulbA',
  ],
  description: 'AI and Data products leader, Enterprise AI expert'
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
        innerHTML: JSON.stringify(organizationStructuredData),
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
