<template>
  <div id="single-post-header" class="text-center">
    <div id="single-post-title" class="text-h5 px-3 py-3">
      <div class="d-flex align-center justify-center flex-wrap">
        <span class="me-2">{{ props.postMetadata.title }}</span>
        <div class="d-flex align-center">
          <nuxt-link :to="getPostFormatRoute(props.postMetadata['post-format']['name'])" class="pl-2">
            <TreeShakenIcon :icon="postFormatIcon()" />
          </nuxt-link>
          <BookmarkButton
            :post="props.postMetadata"
            size="default"
            class="ml-2"
          />
        </div>
      </div>
    </div>
    <div id="single-post-header-meta-1" class="d-flex flex-wrap justify-center align-center px-3 py-1">
      Authors:&nbsp;
      <div v-for="item in props.postMetadata.authors" :key="item['name']">
        <nuxt-link :to="getAuthorRoute(item['url-slug'])">{{ item["name"] }}</nuxt-link>&nbsp;
      </div>
      || Published: {{ props.postMetadata["first-published-on"] }} || Updated:
      {{ props.postMetadata["last-updated-on"] }} || {{ props.postMetadata["reading-time"]?.text || "1 min read" }}
    </div>
    <div id="single-post-header-meta-2" class="d-flex flex-wrap justify-center align-center px-3 py-1">
      Categories:&nbsp;
      <div v-for="item in props.postMetadata.categories" :key="item['name']">
        <nuxt-link :to="getCategoryRoute(item['url-slug'])">{{ item["name"] }}</nuxt-link>&nbsp;
      </div>
      || Tags:&nbsp;
      <div v-for="item in props.postMetadata.tags" :key="item['name']">
        <nuxt-link :to="getTagRoute(item['url-slug'])">{{ item["name"] }}</nuxt-link>&nbsp;
      </div>
      &nbsp;|| Post-format:&nbsp;
      <span>{{ props.postMetadata["post-format"].name }}</span>
    </div>
  </div>
</template>

<script setup>
import BookmarkButton from '~/components/blog/bookmark-button.vue';
import TreeShakenIcon from '~/components/TreeShakenIcon.vue';
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
  return slug && slug !== 'undefined' ? dynamicCategoryRoute + slug + '/' : '#';
};
function getTagRoute(slug) {
  return slug && slug !== 'undefined' ? dynamicTagRoute + slug + '/' : '#';
};
function getAuthorRoute(slug) {
  return slug && slug !== 'undefined' ? dynamicAuthorRoute + slug + '/' : '#';
};
function getPostFormatRoute(slug) {
  return dynamicPostFormatRoute + slug + '/';
};
</script>

<style></style>
