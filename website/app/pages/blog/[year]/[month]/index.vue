<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsData" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center" justify="center">
          <h1>{{ monthText }}:&nbsp; {{ monthName }}</h1>
        </v-row>
      </v-col>
      <postsList :posts-list="blogMetadata" />
    </v-row>
  </v-container>
</template>

<script setup>
import breadcrumbs from '../../../../components/breadcrumbs'
import postsList from '../../../../components/blog/posts-list/list.vue'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs'
dayjs.extend(customParseFormat)
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const blogMetadataStore = useBlogMetadataStore();
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const baseUrl = runtimeConfig.public.baseUrl;
const monthName = route.params.year + '-' + route.params.month;
const monthUrlSlug = route.params.year + '/' + route.params.month;
const appOwner = globalDataStore.appOwner;
const currentPage =
  navigationStore.blog.monthText +
  ' | ' +
  navigationStore.blog.blogText;
const monthText = navigationStore.blog.monthText;
const blogHref = navigationStore.blog.blogItems[0].href;
const blogBaseHref = navigationStore.blog.dynamicItems.blogBase.href;
const title =
  monthName + ' | ' + currentPage + ' || ' + appOwner
const description = 'Blog posts on month ' + monthName
const url = baseUrl + blogBaseHref + monthUrlSlug + '/'
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
function getPostsForMonth() {
  const posts = blogMetadataStore.getPostsForMonth(route.params.year, route.params.month)
  if (posts === undefined) {
    return []
  }
  return posts
};
const blogMetadata = getPostsForMonth();
const breadcrumbsData = [
  {
    title: 'Home',
    disabled: false,
    href: '/',
  },
  {
    title: 'Blog',
    disabled: false,
    href: blogHref,
  },
  {
    title: 'Blog Posts by Month',
    disabled: false,
    href: blogBaseHref + monthUrlSlug + '/',
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
);
const breadcrumbsStructuredData = {
  '@context': 'http://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbsStructuredDataArray,
}
const validate = ({ params }) => {
  // Must be a number and must be a year and a month
  return (
    /^\d+$/.test(params.month) &&
    dayjs(params.year, 'YYYY', true).isValid() &&
    dayjs(params.month, 'MM', true).isValid()
  )
};
useHead({
  title: title,
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: title,
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
</script>

<style></style>
