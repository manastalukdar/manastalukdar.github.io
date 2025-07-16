<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsData" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center py-2" justify="center">
          <h1>{{ postFormatText }}:&nbsp; {{ postFormatType() }}</h1>
        </v-row>
      </v-col>
      <client-only>
        <postsList :posts-list="blogMetadata" />
      </client-only>
    </v-row>
  </v-container>
</template>

<script setup>
import breadcrumbs from '../../../components/breadcrumbs'
import postsList from '../../../components/blog/posts-list/list.vue'
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
const currentPage =
  navigationStore.blog.postFormatText +
  ' | ' +
  navigationStore.blog.blogText;
const postFormatText = navigationStore.blog.postFormatText;
const blogHref = navigationStore.blog.blogItems[0].href;
const blogDynamicItemsPostFormat =
  navigationStore.blog.dynamicItems.postFormat.href;
const categoryUrlSlug = route.params.type;
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
function getPostsForPostFormat() {
  const temp = blogMetadataStore.getPostsForPostFormat(route.params.type)
  if (temp === undefined) {
    return []
  }
  return temp
};
const postFormatType = () => {
  const temp = getPostsForPostFormat();
  if (temp.length === 0) {
    return '';
  }
  return temp[0]['post-format'].name;
};
const blogMetadata = getPostsForPostFormat();
const title =
  postFormatType() + ' | ' + currentPage + ' || ' + appOwner
const description = 'Blog posts of format ' + postFormatType()
const url =
  baseUrl + blogDynamicItemsPostFormat + postFormatType() + '/'
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
    title: 'Blog Posts by Post-Format',
    disabled: false,
    href: blogDynamicItemsPostFormat + postFormatType() + '/',
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
useHead({
  title: title,
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: 'Blog posts of format ' + postFormatType,
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
      name: ':description',
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
