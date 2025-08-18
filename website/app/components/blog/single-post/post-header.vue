<template>
  <v-row id="single-post-header" class="text-center">
    <v-col cols="12">
      <v-row id="single-post-title" class="text-h5 px-3 py-3" justify="center">
        <v-col class="text-center align-center">
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
        </v-col>
        <p />
      </v-row>
      <v-row id="single-post-header-meta-1" class="px-3 py-3" justify="center">
        Authors:&nbsp;
        <div v-for="item in props.postMetadata.authors" :key="item['name']">
          <nuxt-link :to="getAuthorRoute(item['url-slug'])">
            <span>{{ item["name"] }}</span>
          </nuxt-link>
          &nbsp;
        </div>
        || Published: {{ props.postMetadata["first-published-on"] }} || Updated:
        {{ props.postMetadata["last-updated-on"] }} || {{ props.postMetadata["reading-time"]?.text || "1 min read" }}
      </v-row>
      <v-row id="single-post-header-meta-2" class="px-3" justify="center">
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
  if (!slug || slug === 'undefined') {
    console.warn('Invalid category slug:', slug);
    return '#'; // Return a safe fallback
  }
  return dynamicCategoryRoute + slug + '/';
};
function getTagRoute(slug) {
  if (!slug || slug === 'undefined') {
    console.warn('Invalid tag slug:', slug);
    return '#'; // Return a safe fallback
  }
  return dynamicTagRoute + slug + '/';
};
function getAuthorRoute(slug) {
  if (!slug || slug === 'undefined') {
    console.warn('Invalid author slug:', slug);
    return '#'; // Return a safe fallback
  }
  return dynamicAuthorRoute + slug + '/';
};
function getPostFormatRoute(slug) {
  return dynamicPostFormatRoute + slug + '/';
};
</script>

<style></style>
