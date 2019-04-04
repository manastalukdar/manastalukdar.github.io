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

    <v-layout wrap ma-2>
      <v-flex xs12>
        <v-card
          color="blue-grey darken-4"
          class="pa-3"
        >
          <!--eslint-disable-next-line vue/no-v-html-->
          <div class="text-xs-justify" v-html="aboutBlurb" />
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex sm6>
        <v-layout column wrap style="height:100%">
          <v-card
            color="blue-grey darken-4"
            class="pa-3 ma-2"
            style="height:100%"
          >
            <v-layout row justify-center title>
              <span>Highlights</span>
            </v-layout>
            <p />
            <!--eslint-disable-next-line vue/no-v-html-->
            <div v-html="highlights" />
          </v-card>
        </v-layout>
      </v-flex>

      <v-flex sm6>
        <v-layout column wrap style="height:100%">
          <v-card
            color="blue-grey darken-4"
            class="pa-3 ma-2"
            style="height:100%"
          >
            <recentPosts :posts-list="blogMetadata" />
          </v-card>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout wrap ma-2>
      <v-flex xs12>
        <v-card
          color="blue-grey darken-4"
          class="pa-3"
        >
          <v-layout row justify-center title>
            <span>Interests</span>
          </v-layout>
          <p />
          <!--eslint-disable-next-line vue/no-v-html-->
          <div v-html="interests" />
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout wrap ma-2>
      <v-flex xs12>
        <v-card
          color="blue-grey darken-4"
          class="pa-3"
        >
          <v-layout row justify-center title>
            <span>Recent</span>
          </v-layout>
          <p />
          <!--eslint-disable-next-line vue/no-v-html-->
          <div v-html="recentUpdates" />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import recentPosts from '../other/blog/recent-posts/list.vue'
const fm = require('front-matter')
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
})
export default {
  components: {
    recentPosts
  },
  computed: {
    ...mapState({
      socialMediaItems: state => state.MainNavMenu.contact.socialMediaItems,
      aboutItems: state => state.MainNavMenu.about.aboutItems,
      appOwner: state => state.GlobalData.appOwner,
      aboutBlurbRaw: state => state.HomePageData.aboutBlurb,
      highlightsRaw: state => state.HomePageData.highlights,
      interestsRaw: state => state.HomePageData.interests,
      recentUpdatesRaw: state => state.HomePageData.recentUpdates,
      blogMetadata: state => state.BlogMetadata.blogMetadata
    }),
    aboutBlurb: function() {
      const res = fm(this.aboutBlurbRaw)
      return md.render(res.body)
    },
    highlights: function() {
      let result = '<ul>'
      this.highlightsRaw.forEach(item => {
        const res = fm(item)
        const body = md.render(res.body)
        result =
          result +
          '<li>' +
          body.replace('<p>', '').replace('</p>', '') +
          '</li>'
      })
      return result + '</ul>'
    },
    interests: function() {
      let result = '<ul>'
      this.interestsRaw.forEach(item => {
        const resKey = fm(item.name)
        const bodyKey = md.render(resKey.body)
        const resValue = fm(item.value)
        const bodyValue = md.render(resValue.body)
        result =
          result +
          '<li><b><u>' +
          bodyKey
            .replace('<p>', '')
            .replace('</p>', '')
            .trim() +
          '</b></u>: ' +
          bodyValue.replace('<p>', '').replace('</p>', '') +
          '</li>'
      })
      return result + '</ul>'
    },
    recentUpdates: function() {
      let result = ''
      this.recentUpdatesRaw.forEach(item => {
        for (const [key, value] of Object.entries(item)) {
          // eslint-disable-next-line no-console
          console.log(key)
          // eslint-disable-next-line no-console
          console.log(value)
          value.forEach(val => {})
          const resKey = fm(item.name)
          const bodyKey = md.render(resKey.body)
          const resValue = fm(item.value)
          const bodyValue = md.render(resValue.body)
          result =
            result +
            '<li><b><u>' +
            bodyKey
              .replace('<p>', '')
              .replace('</p>', '')
              .trim() +
            '</b></u>: ' +
            bodyValue.replace('<p>', '').replace('</p>', '') +
            '</li>'
        }
      })
      return result + '</ul>'
    }
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
