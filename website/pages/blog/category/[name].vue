<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsData" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center py-2" justify="center">
          <h1>{{ categoryText }}:&nbsp; {{ categoryName() }}</h1>
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
  navigationStore.blog.categoryText +
  ' | ' +
  navigationStore.blog.blogText;
const categoryText = navigationStore.blog.categoryText;
const blogHref = navigationStore.blog.blogItems[0].href;
const blogDynamicItemsCategory =
  navigationStore.blog.dynamicItems.category.href;
const categoryUrlSlug = route.params.name;
async function setupBlogMetadata() {
    try {
        if (blogMetadataStore.blogMetadata.length === 0) {
          await blogMetadataStore.setupBlogMetadata(runtimeConfig.public.baseUrl);
        }
    } catch (error) {
      console.log(error)
    }
};
await setupBlogMetadata();
function getPostsForCategory() {
  const temp = blogMetadataStore.getPostsForCategory(route.params.name)
  if (temp === undefined) {
    return []
  }
  return temp
};
const categoryName = () => {
  const temp = getPostsForCategory()
  const catName = temp[0].categories.filter((category) => {
    if (category['url-slug'] === route.params.name) {
      return category.name
    }
    return ''
  });
  return catName[0].name;
};
const blogMetadata = getPostsForCategory();
const title =
  categoryName() + ' | ' + currentPage + ' || ' + appOwner;
const description = 'Blog posts in category ' + categoryName;
const url =
  baseUrl + blogDynamicItemsCategory + categoryUrlSlug + '/';
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
    title: 'Blog Posts by Category',
    disabled: false,
    href: blogDynamicItemsCategory + categoryUrlSlug + '/',
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
