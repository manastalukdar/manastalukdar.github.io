<template>
  <div class="text-center">
    <div class="text-h6 px-3 py-3">
      <!-- Series Part Number -->
      <div v-if="props.postMetadata.series?.part && props.showSeriesInfo" class="mb-2">
        <v-chip
          color="primary"
          variant="outlined"
          size="large"
          class="series-part-chip"
        >
          Part {{ props.postMetadata.series.part }}
        </v-chip>
      </div>

      <!-- Post Title -->
      <div class="d-flex align-center justify-center flex-wrap">
        <nuxt-link :to="props.postRoute" class="me-2">{{ props.postMetadata.title }}</nuxt-link>
        <div class="d-flex align-center">
          <nuxt-link :to="getPostFormatRoute(props.postMetadata['post-format']['name'])" class="pl-2">
            <TreeShakenIcon :icon="postFormatIcon()" />
          </nuxt-link>
          <BookmarkButton
            :post="props.postMetadata"
            size="large"
            class="ml-1"
          />
        </div>
      </div>
    </div>
    <div class="d-flex flex-wrap justify-center align-center px-3 py-1">
      Authors:&nbsp;
      <div v-for="item in props.postMetadata.authors" :key="item['name']">
        <nuxt-link :to="getAuthorRoute(item['url-slug'])">{{ item['name'] }}</nuxt-link>&nbsp;
      </div>
      || Published: {{ props.postMetadata['first-published-on'] }} || {{ props.postMetadata["reading-time"]?.text || "1 min read" }}
    </div>
    <div class="d-flex flex-wrap justify-center align-center px-3 py-1">
      Categories:&nbsp;
      <div v-for="item in props.postMetadata.categories" :key="item['name']">
        <nuxt-link :to="getCategoryRoute(item['url-slug'])">{{ item['name'] }}</nuxt-link>&nbsp;
      </div>
      || Tags:&nbsp;
      <div v-for="item in props.postMetadata.tags" :key="item['name']">
        <nuxt-link :to="getTagRoute(item['url-slug'])">{{ item['name'] }}</nuxt-link>&nbsp;
      </div>
    </div>
  </div>
</template>

<script setup>
import BookmarkButton from '~/components/blog/bookmark-button.vue';
import TreeShakenIcon from '~/components/TreeShakenIcon.vue';
import { useBlogMetadataStore } from '@/stores/BlogMetadata';
import { useNavigationStore } from '@/stores/Navigation';
const blogMetadataStore = useBlogMetadataStore();
const navigationStore = useNavigationStore();
const props = defineProps({
  postMetadata: {
    type: Object,
    required: true,
    default() {
      return {}
    }
  },
  showSeriesInfo: {
    type: Boolean,
    default: false
  },
  postRoute: {
    type: String,
    default: ''
  }
});
//console.log(props.postMetadata);
const postFormatIcon = () => {
  return blogMetadataStore.getPostFormatIcon(
    props.postMetadata['post-format'].name
  )
};
const dynamicCategoryRoute = navigationStore.blog.dynamicItems.category.href;
const dynamicTagRoute = navigationStore.blog.dynamicItems.tag.href;
const dynamicAuthorRoute = navigationStore.blog.dynamicItems.author.href;
const dynamicPostFormatRoute = navigationStore.blog.dynamicItems.postFormat.href;

const getCategoryRoute = (slug) => slug && slug !== 'undefined' ? dynamicCategoryRoute + slug + '/' : '#';
const getTagRoute = (slug) => slug && slug !== 'undefined' ? dynamicTagRoute + slug + '/' : '#';
const getAuthorRoute = (slug) => slug && slug !== 'undefined' ? dynamicAuthorRoute + slug + '/' : '#';
const getPostFormatRoute = (slug) => dynamicPostFormatRoute + slug + '/';
</script>

<style scoped>
.series-part-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.2s ease-in-out;
}

.series-part-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
