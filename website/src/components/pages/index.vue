<template>
  <v-container>
    <!--fluid-->
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex xs12>
        <v-list>
          <v-layout row justify-center>
            <v-list-tile
              v-for="item in socialMediaItems"
              :key="item.text"
              :href="item.href"
              :target="item.target"
            >
              <v-list-tile-avatar>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-avatar>
            </v-list-tile>
          </v-layout>
        </v-list>
      </v-flex>
      <v-flex xs12>
        <v-list>
          <v-layout row justify-center>
            <v-list-tile
              :key="aboutItems[0].text"
              :to="aboutItems[0].href"
            >
              <v-list-tile-title v-text="aboutItems[0].text" />
            </v-list-tile>
          </v-layout>
        </v-list>
      </v-flex>
    </v-layout>

    <v-layout pa-2>
      <aboutBlurb />
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
import aboutBlurb from '../other/home-page/about-blurb.vue'
import highlights from '../other/home-page/highlights.vue'
import recentPostsHomePage from '../other/home-page/recent-posts.vue'
import interests from '../other/home-page/interests.vue'
import recentUpdates from '../other/home-page/recent-updates.vue'
export default {
  components: {
    aboutBlurb,
    highlights,
    recentPostsHomePage,
    interests,
    recentUpdates
  },
  computed: {
    ...mapState({
      socialMediaItems: state => state.MainNavMenu.contact.socialMediaItems,
      aboutItems: state => state.MainNavMenu.about.aboutItems,
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
a {
  color: #42b983;
}
</style>
