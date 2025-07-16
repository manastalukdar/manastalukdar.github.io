<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsData" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center py-2" justify="center">
          <h1>
            {{ pageTitle }}
          </h1>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-card class="my-3 pa-2" color="cardColor" raised elevation="8">
          <v-card-title>
            <div class="flex-grow-1" />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-title>
          <v-data-table :headers="headers" :items="categories" :search="search"
            :items-per-page="10">
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <nuxt-link :to="getLink([item.slug])">
                    {{ item.name }}
                  </nuxt-link>
                </td>
                <td class="text-left">
                  {{ item.count }}
                </td>
              </tr>
            </template>
            <template #no-results :value="true" color="error" icon="warning">
              <v-alert>
                Your search for "{{ search }}" found no results.
              </v-alert>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import breadcrumbs from "~/components/breadcrumbs"
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const blogMetadataStore = useBlogMetadataStore();
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
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
const appOwner = globalDataStore.appOwner;
const currentPage =
  navigationStore.blog.blogItems[1].text +
  ' | ' +
  navigationStore.blog.blogText;
const blogMetadata = blogMetadataStore.getBlogMetadata();
const pageTitle = navigationStore.blog.blogItems[1].text;
const blogHref = navigationStore.blog.blogItems[0].href;
const currentHref = navigationStore.blog.blogItems[1].href;
const categoriesText = navigationStore.blog.blogItems[1].text;
const blogDynamicItemsCategory =
  navigationStore.blog.dynamicItems.category.href;
const categories = blogMetadataStore.getCategories();
//console.log(categories)
const title = currentPage + ' || ' + appOwner
const description = 'List of all categories from blog.'
const url = baseUrl + currentHref
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
    title: categoriesText,
    disabled: false,
    href: currentHref,
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
);
const breadcrumbsStructuredData = {
  '@context': 'http://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbsStructuredDataArray,
};
const search = ref('');
const headers = [
  {
    title: 'Category',
    align: 'left',
    sortable: true,
    key: 'name',
  },
  { title: 'Number of posts', align: 'left', sortable: true, key: 'count' },
];
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
function getLink(categorySlug) {
  return blogDynamicItemsCategory + categorySlug + '/'
};
</script>

<style></style>
