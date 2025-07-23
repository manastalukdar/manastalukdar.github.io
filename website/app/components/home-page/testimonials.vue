<template>
  <v-col cols="12">
    <v-card
      color="cardColor"
      class="pa-8 testimonials-card"
      raised
      elevation="8"
      style="height: 100%"
    >
      <v-row class="text-h6 px-3 py-3" justify="center">
        <span>What colleagues have said about me</span>
      </v-row>
      <p />
      <!--eslint-disable-next-line vue/no-v-html-->
      <div class="px-3 pb-2 justify-center testimonials-content" v-html="testimonials" />
    </v-card>
  </v-col>
</template>

<script setup>
import fm from 'front-matter';
import mdit from 'markdown-it';
import { computedAsync } from '@vueuse/core';
import getTargetBlankLinkRender from "~/utils/markdownRenderHelpers.ts";

const md = new mdit({
  html: true,
  linkify: true,
  typographer: true,
});

getTargetBlankLinkRender(md);

const testimonials = computedAsync(async () => {
  try {
    const fileContent = await import('./testimonials.md?raw');
    const res = fm(fileContent.default);
    return md.render(res.body);
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped>
.testimonials-card :deep(.testimonials-container) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 1rem 0;
}

.testimonials-card :deep(.testimonial-item) {
  background: rgba(var(--v-theme-surface), 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid rgb(var(--v-theme-primary));
  transition: background-color 0.3s ease;
}

.testimonials-card :deep(.testimonial-item:hover) {
  background: rgba(var(--v-theme-surface), 0.15);
}

.testimonials-card :deep(.testimonial-item blockquote) {
  font-family: 'Maven Pro', 'Helvetica Neue', 'Segoe UI', 'sans-serif';
  font-style: italic;
  margin: 0 0 1rem 0;
  font-size: inherit;
  line-height: 1.8;
  color: rgb(var(--v-theme-on-surface));
}

.testimonials-card :deep(.testimonial-attribution) {
  text-align: right;
  margin-top: 1rem;
}

.testimonials-card :deep(.testimonial-attribution strong) {
  font-family: 'Maven Pro', 'Helvetica Neue', 'Segoe UI', 'sans-serif';
  color: rgb(var(--v-theme-primary));
  font-size: inherit;
}

.testimonials-card :deep(.testimonial-attribution strong a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  transition: color 0.3s ease;
}

.testimonials-card :deep(.testimonial-attribution strong a:hover) {
  color: rgb(var(--v-theme-linkHoverColor));
  text-decoration: underline;
}

.testimonials-card :deep(.testimonial-attribution em) {
  font-family: 'Maven Pro', 'Helvetica Neue', 'Segoe UI', 'sans-serif';
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 0.9em;
}

@media (max-width: 600px) {
  .testimonials-card :deep(.testimonials-container) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .testimonials-card :deep(.testimonial-item) {
    padding: 1rem;
  }
}
</style>