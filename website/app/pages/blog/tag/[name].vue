<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsData" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center py-2" justify="center">
          <h1>{{ tagText }}:&nbsp; {{ tagName() }}</h1>
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
  navigationStore.blog.tagText + ' | ' + navigationStore.blog.blogText;
const tagText = navigationStore.blog.tagText;
const blogHref = navigationStore.blog.blogItems[0].href;
const blogDynamicItemsTag = navigationStore.blog.dynamicItems.tag.href;
const tagUrlSlug = route.params.name;
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
function getPostsForTag() {
  const temp = blogMetadataStore.getPostsForTag(route.params.name)
  if (temp === undefined) {
    return []
  }
  return temp
};
const tagName = () => {
  const temp = getPostsForTag()
  if (!temp || temp.length === 0 || !temp[0].tags) {
    return 'Unknown Tag'
  }
  const tagNameTemp = temp[0].tags.filter((tag) => {
    if (tag['url-slug'] === route.params.name) {
      return tag.name
    }
    return ''
  });
  if (tagNameTemp.length > 0 && tagNameTemp[0].name) {
    return tagNameTemp[0].name;
  }
  return 'Unknown Tag'
};
const blogMetadata = getPostsForTag();
const title =
  tagName() + ' | ' + currentPage + ' || ' + appOwner;
const description = 'Blog posts with tag ' + tagName();
const url = baseUrl + blogDynamicItemsTag + tagUrlSlug + '/';
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
    title: 'Blog Posts by Tag',
    disabled: false,
    href: blogDynamicItemsTag + tagUrlSlug + '/',
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
