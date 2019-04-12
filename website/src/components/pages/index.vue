<template>
  <v-container>
    <!--fluid-->

    <v-layout pa-2>
      <aboutBlurb />
    </v-layout>
    <v-layout pa-2>
      <socialMediaAndResumeLinks />
    </v-layout>

    <v-layout row wrap>
      <v-flex sm6>
        <v-layout pa-2 column style="height:100%">
          <highlights />
        </v-layout>
      </v-flex>

      <v-flex sm6>
        <v-layout pa-2 column style="height:100%">
          <recentPostsHomePage :posts-list="blogMetadata" />
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout pa-2>
      <interests />
    </v-layout>

    <v-layout pa-2>
      <recentUpdates />
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import socialMediaAndResumeLinks from '../other/home-page/social-media-resume.vue'
import aboutBlurb from '../other/home-page/about-blurb.vue'
import highlights from '../other/home-page/highlights.vue'
import recentPostsHomePage from '../other/home-page/recent-posts.vue'
import interests from '../other/home-page/interests.vue'
import recentUpdates from '../other/home-page/recent-updates.vue'
export default {
  components: {
    socialMediaAndResumeLinks,
    aboutBlurb,
    highlights,
    recentPostsHomePage,
    interests,
    recentUpdates
  },
  computed: {
    ...mapState({
      socialMediaItems: state => state.Navigation.contact.socialMediaItems,
      aboutItems: state => state.Navigation.about.aboutItems,
      appOwner: state => state.GlobalData.appOwner,
      blogMetadata: state => state.BlogMetadata.blogMetadata
    })
  },
  async asyncData({ store, params, env, payload }) {
    if (payload) {
      return {
        blogMetadata: payload
      }
    } else if (store.state.BlogMetadata.blogMetadata.length === 0) {
      await store.dispatch('BlogMetadata/getBlogMetadata', [env.baseURL])
    }
  },
  head() {
    return {
      title: this.appOwner
    }
  },
  beforeMount() {
    this.$store.dispatch('Navigation/setHome', true)
  },
  beforeDestroy() {
    this.$store.dispatch('Navigation/setHome', false)
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
