<template>
  <v-col cols="12">
    <v-card
      color="cardColor"
      hover
      class="py-5 px-5"
      nuxt
      raised
      elevation="8"
      :to="
        getBlogPostRoute(
          postLinkSlugs().year,
          postLinkSlugs().month,
          postLinkSlugs().day,
          postLinkSlugs().post
        )
      "
    >
      <postHeader :post-metadata="props.postMetadata" :show-series-info="props.showSeriesInfo" />
      <p />
      <div class="col text-left">
        {{ props.postMetadata.excerpt }}&nbsp;
        <nuxt-link
          :to="
            getBlogPostRoute(
              postLinkSlugs().year,
              postLinkSlugs().month,
              postLinkSlugs().day,
              postLinkSlugs().post
            )
          "
        >
          <span>...read more</span>
        </nuxt-link>
      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import postHeader from './post-header.vue';
import { useNavigationStore } from '@/stores/Navigation';
import dayjs from 'dayjs';
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
  }
});
//console.log(props.postMetadata.excerpt);
const dynamicBlogPostRoute = navigationStore.blog.dynamicItems.blogPost.href;
const postLinkSlugs = () => {
    const dayjsObj = dayjs(props.postMetadata['first-published-on'])
    const year = dayjsObj.format('YYYY')
    const month = dayjsObj.format('MM')
    const day = dayjsObj.format('DD')
    const post = props.postMetadata['url-slug']
    return { year, month, day, post }
  };
const getBlogPostRoute = (year, month, day, post) => {
    return (
      dynamicBlogPostRoute +
      year +
      '/' +
      month +
      '/' +
      day +
      '/' +
      post +
      '/'
    )
  };
</script>

<style></style>
