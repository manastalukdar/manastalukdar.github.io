<template>
  <div class="py-4">
    <seriesHeader :series="props.series" />
  </div>
</template>

<script setup>
import seriesHeader from './series-header.vue'

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

<style></style>