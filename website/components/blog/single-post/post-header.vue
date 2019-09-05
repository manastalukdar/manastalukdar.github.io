<template>
  <v-row id="single-post-header" class="text-center">
    <v-col cols="12">
      <v-row class="headline" justify="center">
        <v-col class="text-center align-center">
          {{ postMetadata.title }}
          &nbsp;
          <v-icon>{{ postFormatIcon }}</v-icon>
        </v-col>
        <p />
      </v-row>
      <v-row justify="center">
        Authors:&nbsp;
        <div v-for="item in postMetadata.authors" :key="item['name']">
          <nuxt-link :to="getAuthorRoute(item['url-slug'])">
            <span>{{ item['name'] }}</span> </nuxt-link
          >&nbsp;
        </div>
        &nbsp; || Published: {{ postMetadata['first-published-on'] }} ||
        Updated: {{ postMetadata['last-updated-on'] }}
      </v-row>
      <v-row justify="center">
        Categories:&nbsp;
        <div v-for="item in postMetadata.categories" :key="item['name']">
          <nuxt-link :to="getCategoryRoute(item['url-slug'])">
            <span>{{ item['name'] }}</span> </nuxt-link
          >&nbsp;
        </div>
        &nbsp;|| Tags:&nbsp;
        <div v-for="item in postMetadata.tags" :key="item['name']">
          <nuxt-link :to="getTagRoute(item['url-slug'])">
            <span>{{ item['name'] }}</span> </nuxt-link
          >&nbsp;
        </div>
        &nbsp;|| Post-format:&nbsp;
        <nuxt-link
          :to="getPostFormatRoute(postMetadata['post-format']['url-slug'])"
          >{{ postMetadata['post-format'].name }}</nuxt-link
        >
      </v-row>
    </v-col>
  </v-row>
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
      dynamicPostFormatRoute: state =>
        state.Navigation.blog.dynamicItems.postFormat.href
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
    },
    getPostFormatRoute(slug) {
      return this.dynamicPostFormatRoute + slug + '/'
    }
  }
}
</script>

<style></style>
