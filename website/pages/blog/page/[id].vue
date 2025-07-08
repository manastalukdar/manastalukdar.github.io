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
          :initial-page="currentPageNumber"
          @page-changed="onPageChanged"
          @per-page-changed="onPerPageChanged"
        />
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
const router = useRouter();
const baseUrl = runtimeConfig.public.baseUrl;

// Get current page from route params
const currentPageNumber = ref(parseInt(String(route.params.id || '1')));

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
const blogMetadata = blogMetadataStore.getBlogMetadata();
const pageTitle = computed(() => {
  const baseTitle = navigationStore.blog.blogText
  return `${baseTitle} - Page ${currentPageNumber.value}`
});
const currentHref = navigationStore.blog.blogItems[0].href;
const title = computed(() => `${pageTitle.value} || ${appOwner}`)
const description = 'Reflections on software engineering and other matters.';

const url = computed(() => {
  return baseUrl + '/blog/page/' + currentPageNumber.value
})

// Event handlers for pagination
function onPageChanged(newPage) {
  if (newPage === 1) {
    // Redirect to main blog page for page 1
    router.push('/blog')
  } else {
    // Update URL to reflect new page
    router.push(`/blog/page/${newPage}`)
  }
}

function onPerPageChanged(newPerPage) {
  // Reset to page 1 when changing items per page
  router.push('/blog')
}

// Watch for route changes
watch(() => route.params.id, (newId) => {
  currentPageNumber.value = parseInt(String(newId || '1'))
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
  {
    title: `Page ${currentPageNumber.value}`,
    disabled: false,
    href: `/blog/page/${currentPageNumber.value}`,
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
