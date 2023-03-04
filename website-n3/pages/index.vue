<template>
  <v-container>
    <v-row class="px-2 pb-2">
      <aboutBlurb />
    </v-row>

    <v-row class="px-2 py-2">
      <v-col sm="6" class="py-2" cols="12">
        <v-row class="fill-height">
          <recentPostsHomePage :posts-list="blogMetadata" />
        </v-row>
      </v-col>

      <v-col sm="6" class="py-2 d-flex flex-column" cols="12">
        <v-row class="flex-grow-0 pb-2">
          <socialMediaAndResumeLinks />
        </v-row>
        <v-row class="flex-grow-1 pt-2">
          <featured />
        </v-row>
      </v-col>
    </v-row>

    <v-row class="px-2 py-2">
      <highlights />
    </v-row>

    <v-row class="px-2 py-2">
      <interests />
    </v-row>

    <v-row class="px-2 py-2">
      <recentUpdates />
    </v-row>
  </v-container>
</template>

<script>
import aboutBlurb from '../components/home-page/about-blurb.vue'
import recentPostsHomePage from '../components/home-page/recent-posts.vue'
import featured from '../components/home-page/featured.vue'
import socialMediaAndResumeLinks from '../components/home-page/social-media-resume.vue'
import highlights from '../components/home-page/highlights.vue'
import interests from '../components/home-page/interests.vue'
import recentUpdates from '../components/home-page/recent-updates.vue'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
const blogMetadataStore = useBlogMetadataStore()
const navigationStore = useNavigationStore()
const globalDataStore = useGlobalDataStore()
export default {
  setup() {

  },
  components: {
    aboutBlurb,
    recentPostsHomePage,
    featured,
    socialMediaAndResumeLinks,
    highlights,
    interests,
    recentUpdates
  },
  async asyncData({ store, params, $config, payload }) {
    if (payload) {
      return {
        baseUrl: $config.baseURL,
        blogMetadata: payload,
      }
    } else {
      if (blogMetadataStore.blogMetadata.length === 0) {
        blogMetadataStore.getBlogMetadata($config.baseURL)
      }
      return {
        baseUrl: $config.baseURL,
      }
    }
  },
  data() {
    return {
      currentHref: '/',
      socialMediaItems: navigationStore.contact.socialMediaItems,
      aboutItems: navigationStore.about.aboutItems,
      appOwner: globalDataStore.appOwner,
      blogMetadata: blogMetadataStore.blogMetadata,
    }
  },
  head() {
    const url = this.baseUrl + this.currentHref
    const breadcrumbsStructuredDataArray = this.breadcrumbs.map(
      (item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': this.baseUrl + item.to,
          name: item.text,
        },
      })
    )
    const breadcrumbsStructuredData = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbsStructuredDataArray,
    }
    const structuredData = {
      '@context': 'http://schema.org',
      '@type': 'Person',
      name: this.appOwner,
      url,
      sameAs: [
        this.socialMediaItems[0].href,
        this.socialMediaItems[1].href,
        this.socialMediaItems[2].href,
        'https://www.facebook.com/manas.talukdar',
        'https://www.instagram.com/manastalukdar/',
        'https://www.youtube.com/channel/UCskNDdaQXOKw1pLpPVpulbA',
      ],
    }
    return {
      title: this.appOwner,
      link: [{ rel: 'canonical', href: url }],
      __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          innerHTML: JSON.stringify(structuredData),
          type: 'application/ld+json',
        },
        {
          innerHTML: JSON.stringify(breadcrumbsStructuredData),
          type: 'application/ld+json',
        },
      ],
    }
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: 'Home',
          disabled: false,
          to: '/',
        },
      ]
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
