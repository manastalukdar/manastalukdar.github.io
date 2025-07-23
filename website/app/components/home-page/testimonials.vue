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
      
      <div v-if="loading" class="text-center pa-4">
        <v-progress-circular indeterminate color="primary" />
      </div>
      
      <div v-else-if="error" class="text-center pa-4">
        <v-alert type="error" variant="text">
          Failed to load testimonials
        </v-alert>
      </div>
      
      <div v-else class="px-3 pb-2 justify-center testimonials-content">
        <div class="testimonials-container">
          <div
            v-for="testimonial in homePageTestimonials"
            :key="testimonial.name"
            class="testimonial-item"
          >
            <blockquote v-html="formatTestimonialContent(testimonial.content)" />
            <div class="testimonial-attribution">
              <strong>
                <a
                  v-if="testimonial.linkedin"
                  :href="testimonial.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ testimonial.name }}
                </a>
                <span v-else>{{ testimonial.name }}</span>
              </strong>
              <br>
              <em>{{ testimonial.title }}{{ testimonial.company ? ` @ ${testimonial.company}` : '' }}</em>
            </div>
            <div class="testimonial-read-more">
              <nuxt-link to="/about/testimonials" class="read-more-link">
                Read full testimonial →
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import { useTestimonials } from '~/composables/useTestimonials'

const { homePageTestimonials, loading, error, formatTestimonialContent } = useTestimonials()
</script>

<style scoped lang="scss">
@use '~/style/components/testimonials.scss';
</style>