<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsComputed" />
    <p />
    <v-row class="text-justify">
      <v-col cols="12">
        <v-row class="text-center" justify="center">
          <h1>{{ yearText }}:&nbsp; {{ yearName }}</h1>
        </v-row>
      </v-col>
      <postsList :posts-list="blogMetadata" />
    </v-row>
  </v-container>
</template>

<script setup>
import breadcrumbs from '../../../components/breadcrumbs'
import postsList from '../../../components/blog/posts-list/list.vue'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs'
dayjs.extend(customParseFormat)
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const blogMetadataStore = useBlogMetadataStore();
const appOwner = globalDataStore.appOwner;
const currentPage =
        navigationStore.blog.yearText +
        ' | ' +
        navigationStore.blog.blogText;
const yearText = navigationStore.blog.yearText;
const blogHref = navigationStore.blog.blogItems[0].href;
const blogBaseHref = navigationStore.blog.dynamicItems.blogBase.href;
const currentHref = navigationStore.about.aboutItems[0].href;
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const baseUrl = runtimeConfig.public.baseUrl;
const yearName = route.params.year
const yearUrlSlug = route.params.year
const title = yearName + ' | ' + currentPage + ' || ' + appOwner
const description = 'Blog posts on year ' + yearName
const url = baseUrl + blogBaseHref + yearUrlSlug + '/'
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
function getPostsByYear() {
  const posts = blogMetadataStore.getPostsForYear(route.params.year)
  if (posts === undefined) {
    return []
  }
  return posts
};
const blogMetadata = getPostsByYear();
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
      title: 'Blog Posts by Year',
      disabled: false,
      href: blogBaseHref + yearUrlSlug + '/',
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
const breadcrumbsComputed = computed({
    get() {
      return  breadcrumbsData
    }
});
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
const validate = ({ params }) => {
  // Must be a number and must be a year
  return (
    /^\d+$/.test(params.year) && dayjs(params.year, 'YYYY', true).isValid()
  )
};
/*async asyncData({ store, params, $config, payload }) {
if (payload) {
  return {
    yearUrlSlug: params.year,
    baseUrl: $config.baseURL,
    blogMetadata: payload,
    yearName: params.year,
  }
} else {
  if (store.state.BlogMetadata.blogMetadata.length === 0) {
    await store.dispatch('BlogMetadata/getBlogMetadata', [$config.baseURL])
  }
  const posts = store.getters['BlogMetadata/getPostsForYear'](params.year)
  if (posts === undefined) {
    return {
      yearUrlSlug: params.year,
      baseUrl: $config.baseURL,
      blogMetadata: [],
      yearName: '',
    }
  }
  return {
    yearUrlSlug: params.year,
    baseUrl: $config.baseURL,
    blogMetadata: posts,
    yearName: params.year,
  }
}
},*/
</script>

<style></style>
