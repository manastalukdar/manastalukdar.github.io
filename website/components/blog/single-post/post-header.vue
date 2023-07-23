<template>
  <v-row id="single-post-header" class="text-center">
    <v-col cols="12">
      <v-row class="text-h5 px-3 py-3" justify="center">
        <v-col class="text-center align-center">
          {{ props.postMetadata.title }}
          <nuxt-link :to="getPostFormatRoute(props.postMetadata['post-format']['name'])" class="pl-2">
            <v-icon>{{ postFormatIcon() }}</v-icon>
          </nuxt-link>
        </v-col>
        <p />
      </v-row>
      <v-row class="px-3 py-3" justify="center">
        Authors:&nbsp;
        <div v-for="item in props.postMetadata.authors" :key="item['name']">
          <nuxt-link :to="getAuthorRoute(item['url-slug'])">
            <span>{{ item["name"] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
        || Published: {{ props.postMetadata["first-published-on"] }} || Updated:
        {{ props.postMetadata["last-updated-on"] }}
      </v-row>
      <v-row class="px-3" justify="center">
        Categories:&nbsp;
        <div v-for="item in props.postMetadata.categories" :key="item['name']">
          <nuxt-link :to="getCategoryRoute(item['url-slug'])">
            <span>{{ item["name"] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
        || Tags:&nbsp;
        <div v-for="item in props.postMetadata.tags" :key="item['name']">
          <nuxt-link :to="getTagRoute(item['url-slug'])">
            <span>{{ item["name"] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
        &nbsp;|| Post-format:&nbsp;
        <nuxt-link
          :to="getPostFormatRoute(props.postMetadata['post-format']['url-slug'])"
        >
          {{ props.postMetadata["post-format"].name }}
        </nuxt-link>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation';
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
const navigationStore = useNavigationStore();
const blogMetadataStore = useBlogMetadataStore();
const dynamicCategoryRoute = navigationStore.blog.dynamicItems.category.href;
const dynamicTagRoute = navigationStore.blog.dynamicItems.tag.href;
const dynamicAuthorRoute = navigationStore.blog.dynamicItems.author.href;
const dynamicPostFormatRoute = navigationStore.blog.dynamicItems.postFormat.href;
const props = defineProps({
  postMetadata: {
    type: Object,
    required: true,
    default: () => {},
  },
});
function postFormatIcon() {
  return blogMetadataStore.getPostFormatIcon(
    props.postMetadata['post-format'].name
  );
};
function getCategoryRoute(slug) {
  return dynamicCategoryRoute + slug + '/';
};
function getTagRoute(slug) {
  return dynamicTagRoute + slug + '/';
};
function getAuthorRoute(slug) {
  return dynamicAuthorRoute + slug + '/';
};
function getPostFormatRoute(slug) {
  return dynamicPostFormatRoute + slug + '/';
};
</script>

<style></style>
