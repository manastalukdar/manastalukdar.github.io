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
      <client-only>
        <postsList 
          :posts-list="blogMetadata" 
          :initial-page="currentPage"
          @page-changed="onPageChanged"
          @per-page-changed="onPerPageChanged"
        />
      </client-only>
    </v-row>
  </v-container>
</template>

<script setup>
import breadcrumbs from "~/components/breadcrumbs"
import postsList from "~/components/blog/posts-list/list.vue"
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const blogMetadataStore = useBlogMetadataStore();
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const baseUrl = runtimeConfig.public.baseUrl;

// Get current page from route or default to 1
const currentPage = ref(parseInt(String(route.query.page || '1')));
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
const currentPageText = navigationStore.blog.blogItems[0].text;
const blogMetadata = blogMetadataStore.getBlogMetadata();
const pageTitle = navigationStore.blog.blogText;
const currentHref = navigationStore.blog.blogItems[0].href;
const title = computed(() => {
  if (currentPage.value > 1) {
    return `${currentPageText} - Page ${currentPage.value} || ${appOwner}`
  }
  return `${currentPageText} || ${appOwner}`
})
const description = 'Reflections on software engineering and other matters.';
const url = computed(() => {
  if (currentPage.value > 1) {
    return baseUrl + currentHref + '?page=' + currentPage.value
  }
  return baseUrl + currentHref
})

// Event handlers for pagination
function onPageChanged(newPage) {
  currentPage.value = newPage
  updateURL()
}

function onPerPageChanged(newPerPage) {
  // Reset to page 1 when changing items per page
  currentPage.value = 1
  updateURL()
}

function updateURL() {
  const query = {}
  if (currentPage.value > 1) {
    query.page = currentPage.value
  }
  
  router.push({
    path: '/blog',
    query: query
  })
}

// Watch for route changes (browser back/forward)
watch(() => route.query.page, (newPage) => {
  currentPage.value = parseInt(String(newPage || '1'))
})

const breadcrumbsData = [
  {
    title: 'Home',
    disabled: false,
    href: '/',
  },
  {
    title: 'Blog',
    disabled: false,
    href: currentHref,
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
