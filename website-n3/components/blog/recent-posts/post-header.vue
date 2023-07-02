<template>
  <div class="text-center" justify="center">
    <client-only>
      <nuxt-link
        :to="
          getBlogPostRoute(
            postLinkSlugs.year,
            postLinkSlugs.month,
            postLinkSlugs.day,
            postLinkSlugs.post,
          )
        "
      >
        {{ props.postMetadata.title }}
      </nuxt-link>
    </client-only>
  </div>
</template>

<script setup>
import { useNavigationStore } from '@/stores/Navigation'
import  dayjs from 'dayjs'
const navigationStore = useNavigationStore()
const props = defineProps({
  postMetadata: {
    type: Object,
    required: true,
    default() {
      return {}
    }
  },
});
const dynamicBlogPostRoute = navigationStore.blog.dynamicItems.blogPost.href;
const postLinkSlugs = computed(() => {
    const dayjsObj = dayjs(props.postMetadata['first-published-on'])
    const year = dayjsObj.format('YYYY')
    const month = dayjsObj.format('MM')
    const day = dayjsObj.format('DD')
    const post = props.postMetadata['url-slug']
    return { year, month, day, post }
  });
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
