<template>
  <v-layout wrap class="text-xs-center">
    <v-flex xs12>
      <v-layout row justify-center title>
        <div class="text-xs-center align-right mr-2">
          <p>
            {{ postMetadata.title }}
          </p>
        </div>
        <div xs2 class="text-xs-right align-left ml-2">
          <p>
            <v-icon>{{ postFormatIcon }}</v-icon>
          </p>
        </div>
        <p />
      </v-layout>
      <v-layout row justify-center wrap>
        Authors:&nbsp;
        <div v-for="item in postMetadata.authors" :key="item['name']">
          <nuxt-link :to="getAuthorRoute(item['url-slug'])">
            <span>{{ item['name'] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
        &nbsp; || Published: {{ postMetadata['first-published-on'] }}
      </v-layout>
      <v-layout row justify-center wrap>
        Categories:&nbsp;
        <div v-for="item in postMetadata.categories" :key="item['name']">
          <nuxt-link :to="getCategoryRoute(item['url-slug'])">
            <span>{{ item['name'] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
        &nbsp;|| Tags:&nbsp;
        <div v-for="item in postMetadata.tags" :key="item['name']">
          <nuxt-link :to="getTagRoute(item['url-slug'])">
            <span>{{ item['name'] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    postMetadata: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    postFormatIcon() {
      return this.$store.getters['BlogMetadata/getPostFormatIcon'](
        this.postMetadata['post-format'].name
      )
    },
    ...mapState({
      dynamicCategoryRoute: state =>
        state.Navigation.blog.dynamicItems.category.href,
      dynamicTagRoute: state => state.Navigation.blog.dynamicItems.tag.href,
      dynamicAuthorRoute: state =>
        state.Navigation.blog.dynamicItems.author.href,
      aboutItems: state => state.Navigation.about.aboutItems,
      appOwner: state => state.GlobalData.appOwner,
      blogMetadata: state => state.BlogMetadata.blogMetadata
    })
  },
  methods: {
    getCategoryRoute(slug) {
      return this.dynamicCategoryRoute + slug + '/'
    },
    getTagRoute(slug) {
      return this.dynamicTagRoute + slug + '/'
    },
    getAuthorRoute(slug) {
      return this.dynamicAuthorRoute + slug + '/'
    }
  }
}
</script>

<style></style>
