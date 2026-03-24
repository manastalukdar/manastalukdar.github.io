<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsData" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center" justify="center">
          <h1>{{ dayText }}:&nbsp; {{ dayName }}</h1>
        </v-row>
      </v-col>
      <postsList :posts-list="blogMetadata" />
    </v-row>
  </v-container>
</template>

<script setup>
import breadcrumbs from '../../../../../components/breadcrumbs'
import postsList from '../../../../../components/blog/posts-list/list.vue'
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
const appOwner = globalDataStore.appOwner;
const currentPage = navigationStore.blog.dayText + ' | ' + navigationStore.blog.blogText;
const dayText = navigationStore.blog.dayText;
const blogHref = navigationStore.blog.blogItems[0].href;
const blogBaseHref = navigationStore.blog.dynamicItems.blogBase.href;
const dayName = route.params.year + '-' + route.params.month + '-' + route.params.day;
const dayUrlSlug = route.params.year + '/' + route.params.month + '/' + route.params.day;
const title =
  dayName + ' | ' + currentPage + ' || ' + appOwner
const description = 'Blog posts on day ' + dayName
const url = baseUrl + blogBaseHref + dayUrlSlug + '/'
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
function getPostsForDay() {
  const posts = blogMetadataStore.getPostsForDay(route.params.year, route.params.month, route.params.day)
  if (posts === undefined) {
    return []
  }
  return posts
};
const blogMetadata = getPostsForDay();
const breadcrumbsData = [
    {
      title: 'Home',
      disabled: false,
      href: '/',
      exact: true,
    },
    {
      title: 'Blog',
      disabled: false,
      href: blogHref,
      exact: true,
    },
    {
      title: 'Blog Posts by Day',
      disabled: false,
      href: blogBaseHref + dayUrlSlug + '/',
      exact: true,
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
const validate = ({ params }) => {
  // Must be a number and must be a year, month and day
  return (
    /^\d+$/.test(params.year) &&
    dayjs(params.year, 'YYYY', true).isValid() &&
    dayjs(params.month, 'MM', true).isValid() &&
    dayjs(params.day, 'DD', true).isValid()
  )
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
</script>

<style></style>
