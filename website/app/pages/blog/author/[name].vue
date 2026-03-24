<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsData" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center py-2" justify="center">
          <h1>{{ authorText }}:&nbsp; {{ authorName() }}</h1>
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
  navigationStore.blog.authorText +
  ' | ' +
  navigationStore.blog.blogText;
const authorText = navigationStore.blog.authorText;
const blogHref = navigationStore.blog.blogItems[0].href;
const blogDynamicItemsAuthor = navigationStore.blog.dynamicItems.author.href;
const authorUrlSlug = route.params.name;
const url =
  baseUrl + blogDynamicItemsAuthor + authorUrlSlug + '/'
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
function getPostsForAuthor() {
  const temp = blogMetadataStore.getPostsForAuthor(route.params.name)
  if (temp === undefined) {
    return []
  }
  return temp
};
const authorName = () => {
  const temp = getPostsForAuthor()
  if (!temp || temp.length === 0 || !temp[0].authors) {
    return 'Unknown Author'
  }
  const authName = temp[0].authors.filter((author) => {
    if (author['url-slug'] === route.params.name) {
      return author.name
    }
    return ''
  });
  if (authName.length > 0 && authName[0].name) {
    return authName[0].name;
  }
  return 'Unknown Author'
}
const blogMetadata = getPostsForAuthor();
const title =
  authorName() + ' | ' + currentPage + ' || ' + appOwner
const description = 'Blog posts by author ' + authorName()
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
    title: 'Blog Posts by Author',
    disabled: false,
    href: blogDynamicItemsAuthor + authorUrlSlug + '/',
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
