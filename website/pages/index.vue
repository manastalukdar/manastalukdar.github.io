<template>
  <v-container>
    <v-row class="px-2">
      <aboutBlurb />
    </v-row>

    <v-row class="px-2">
      <v-col md="6" class="d-flex py-0" cols="12">
        <v-row style="height:100%;">
          <recentPostsHomePage :posts-list="blogMetadata" />
        </v-row>
      </v-col>

      <v-col md="6" class="d-flex py-0" cols="12">
        <v-row class="justify-center" style="width:100%;">
          <v-row class="d-flex px-0 py-0 col-12">
            <socialMediaAndResumeLinks />
          </v-row>
          <v-row class="d-flex px-0 py-0 col-12">
            <featured />
          </v-row>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="px-2">
      <highlights />
    </v-row>

    <v-row class="px-2">
      <interests />
    </v-row>

    <v-row class="px-2">
      <recentUpdates />
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import featured from '../components/home-page/featured.vue'
import socialMediaAndResumeLinks from '../components/home-page/social-media-resume.vue'
import aboutBlurb from '../components/home-page/about-blurb.vue'
import highlights from '../components/home-page/highlights.vue'
import recentPostsHomePage from '../components/home-page/recent-posts.vue'
import interests from '../components/home-page/interests.vue'
import recentUpdates from '../components/home-page/recent-updates.vue'
export default {
  components: {
    featured,
    socialMediaAndResumeLinks,
    aboutBlurb,
    highlights,
    recentPostsHomePage,
    interests,
    recentUpdates
  },
  data() {
    return {
      currentHref: '/'
    }
  },
  computed: {
    ...mapState({
      socialMediaItems: state => state.Navigation.contact.socialMediaItems,
      aboutItems: state => state.Navigation.about.aboutItems,
      appOwner: state => state.GlobalData.appOwner,
      blogMetadata: state => state.BlogMetadata.blogMetadata
    }),
    breadcrumbs() {
      return [
        {
          text: 'Home',
          disabled: false,
          to: '/'
        }
      ]
    }
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        baseUrl: env.baseURL,
        blogMetadata: payload
      }
    } else {
      if (store.state.BlogMetadata.blogMetadata.length === 0) {
        await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
      }
      return {
        baseUrl: env.baseURL
      }
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
          name: item.text
        }
      })
    )
    const breadcrumbsStructuredData = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbsStructuredDataArray
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
        'https://www.youtube.com/channel/UCskNDdaQXOKw1pLpPVpulbA'
      ]
    }
    return {
      title: this.appOwner,
      link: [{ rel: 'canonical', href: url }],
      __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          innerHTML: JSON.stringify(structuredData),
          type: 'application/ld+json'
        },
        {
          innerHTML: JSON.stringify(breadcrumbsStructuredData),
          type: 'application/ld+json'
        }
      ]
    }
  }
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
