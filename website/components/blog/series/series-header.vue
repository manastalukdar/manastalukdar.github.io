<template>
  <div class="text-center" justify="center">
    <client-only>
      <nuxt-link
        :to="`/blog/series/${props.series.urlSlug}`"
        class="text-decoration-none"
      >
        {{ props.series.name }}
      </nuxt-link>
    </client-only>
  </div>
</template>

<script setup>
const props = defineProps({
  series: {
    type: Object,
    required: true,
    default() {
      return {}
    }
  },
});
</script>