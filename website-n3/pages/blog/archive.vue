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
          <v-data-table
            :headers="headers"
            :items="blogMetadata"
            item-value="title"
            :search="search"
            :items-per-page="5"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <nuxt-link
                    :to="
                      getLink(item.selectable['first-published-on'], item.selectable['url-slug'])
                    "
                  >
                    {{ item.selectable.title }}
                  </nuxt-link>
                </td>
                <td>{{ getFirstPublishedDateTime(item.selectable['first-published-on']) }}</td>
                <td>{{ getLastUpdatedDateTime(item.selectable['last-updated-on']) }}</td>
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
import dayjs from 'dayjs'
import breadcrumbs from '../../components/breadcrumbs'
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const blogMetadataStore = useBlogMetadataStore();
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const baseUrl = runtimeConfig.public.baseUrl;
//console.log(baseUrl)
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
const appOwner = globalDataStore.appOwner;
const currentPage =
  navigationStore.blog.blogItems[4].text +
  ' | ' +
  navigationStore.blog.blogText;
const blogMetadata = blogMetadataStore.getBlogMetadata();
//console.log(blogMetadata)
const pageTitle = navigationStore.blog.blogItems[4].text;
const blogHref = navigationStore.blog.blogItems[0].href;
const currentHref = navigationStore.blog.blogItems[4].href;
const archiveText = navigationStore.blog.blogItems[4].text;
const blogDynamicItemsBlogPost =
  navigationStore.blog.dynamicItems.blogPost.href;
const search = ref('');
const headers = [
  {
    title: 'Post Title',
    align: 'left',
    sortable: false,
    key: 'title',
  },
  {
    title: 'First Published On',
    align: 'left',
    sortable: true,
    key: 'first-published-on',
  },
  {
    title: 'Last Updated On',
    align: 'left',
    sortable: true,
    key: 'last-updated-on',
  },
];
const title = currentPage + ' || ' + appOwner;
const description = 'List of all blog posts.';
const url = baseUrl + currentHref;
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
    title: archiveText,
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
      '@id': baseUrl + item.to,
      name: item.text,
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
function getLink(firstPublishedOn, postSlug) {
  const dayjsObj = dayjs(firstPublishedOn)
  const yearSlug = dayjsObj.format('YYYY')
  const monthSlug = dayjsObj.format('MM')
  const dateSlug = dayjsObj.format('DD')
  return (
    blogDynamicItemsBlogPost +
    yearSlug +
    '/' +
    monthSlug +
    '/' +
    dateSlug +
    '/' +
    postSlug +
    '/'
  )
};
function getFirstPublishedDateTime(firstPublishedOn) {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(firstPublishedOn).toLocaleDateString("en-US", options)
};
function getLastUpdatedDateTime(lastUpdatedOn) {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(lastUpdatedOn).toLocaleDateString("en-US", options)
};
</script>

<style></style>
