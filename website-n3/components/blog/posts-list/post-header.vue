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

<script setup>
import { useBlogMetadataStore } from '@/stores/BlogMetadata';
import { useNavigationStore } from '@/stores/Navigation';
import { useGlobalDataStore } from '@/stores/GlobalData';
const blogMetadataStore = useBlogMetadataStore();
const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const props = defineProps({
  postMetadata: {
    type: Object,
    required: true,
    default() {
      return {}
    }
  }
});
//console.log(props.postMetadata);
const postFormatIcon = () => {
  return blogMetadataStore.getters['BlogMetadata/getPostFormatIcon'](
    props.postMetadata['post-format'].name
  )
};
const dynamicCategoryRoute = navigationStore.blog.dynamicItems.category.href;
const dynamicTagRoute = navigationStore.blog.dynamicItems.tag.href;
const dynamicAuthorRoute = navigationStore.blog.dynamicItems.author.href;
const aboutItems = navigationStore.about.aboutItems;
const appOwner = globalDataStore.appOwner;
const blogMetadata = globalDataStore.blogMetadata;

const getCategoryRoute = (slug) => {
      return dynamicCategoryRoute + slug + '/'
};
const getTagRoute = (slug) => {
  return dynamicTagRoute + slug + '/'
};
const getAuthorRoute = (slug) => {
  return dynamicAuthorRoute + slug + '/'
};
</script>

<style></style>
