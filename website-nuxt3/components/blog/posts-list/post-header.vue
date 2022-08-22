<template>
  <v-row class="text-center">
    <v-col cols="12">
      <v-row class="text-h6 px-3 py-3" justify="center">
        <v-col class="text-center align-center">
          {{ postMetadata.title }}
          &nbsp;
          <v-icon>{{ postFormatIcon }}</v-icon>
        </v-col>
        <p />
      </v-row>
      <v-row class="px-3 py-3" justify="center">
        Authors:&nbsp;
        <div v-for="item in postMetadata.authors" :key="item['name']">
          <nuxt-link :to="getAuthorRoute(item['url-slug'])">
            <span>{{ item['name'] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
        || Published: {{ postMetadata['first-published-on'] }}
      </v-row>
      <v-row class="px-3" justify="center">
        Categories:&nbsp;
        <div v-for="item in postMetadata.categories" :key="item['name']">
          <nuxt-link :to="getCategoryRoute(item['url-slug'])">
            <span>{{ item['name'] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
        || Tags:&nbsp;
        <div v-for="item in postMetadata.tags" :key="item['name']">
          <nuxt-link :to="getTagRoute(item['url-slug'])">
            <span>{{ item['name'] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'pinia'
export default {
  props: {
    postMetadata: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  computed: {
    postFormatIcon() {
      return this.$store.getters['BlogMetadata/getPostFormatIcon'](
        this.postMetadata['post-format'].name
      )
    },
    ...mapState({
      dynamicCategoryRoute: (state) =>
        state.Navigation.blog.dynamicItems.category.href,
      dynamicTagRoute: (state) => state.Navigation.blog.dynamicItems.tag.href,
      dynamicAuthorRoute: (state) =>
        state.Navigation.blog.dynamicItems.author.href,
      aboutItems: (state) => state.Navigation.about.aboutItems,
      appOwner: (state) => state.GlobalData.appOwner,
      blogMetadata: (state) => state.BlogMetadata.blogMetadata,
    }),
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
    },
  },
}
</script>

<style></style>
