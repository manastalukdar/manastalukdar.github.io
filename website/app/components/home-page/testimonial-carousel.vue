<template>
  <v-col cols="12">
    <v-card
      color="cardColor"
      class="pa-8 testimonials-carousel-card"
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

      <div v-else class="carousel-container">
        <div class="carousel-wrapper" @mouseenter="pauseRotation" @mouseleave="resumeRotation">
          <v-carousel
            v-model="currentSlide"
            :show-arrows="false"
            :continuous="true"
            :cycle="autoRotate"
            :interval="rotationInterval"
            :hide-delimiters="true"
            height="auto"
            class="testimonial-carousel"
          >
          <v-carousel-item
            v-for="(testimonial, index) in homePageTestimonials"
            :key="`${testimonial.name}-${index}`"
            class="carousel-item"
          >
            <div class="testimonial-slide pa-4">
              <div class="testimonial-content">
                <blockquote
                  class="testimonial-quote"
                  v-html="formatTestimonialContent(testimonial.content)"
                />

                <div class="testimonial-meta">
                  <div class="testimonial-attribution">
                    <div class="author-info">
                      <div class="author-avatar" v-if="testimonial.photo">
                        <v-avatar size="48" :image="testimonial.photo" :alt="`Photo of ${testimonial.name}`" />
                      </div>
                      <div class="author-details">
                        <strong class="author-name">
                          <a
                            v-if="testimonial.linkedin"
                            :href="testimonial.linkedin"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="linkedin-link"
                          >
                            {{ testimonial.name }}
                            <TreeShakenIcon icon="mdi-linkedin" size="small" class="ml-1" />
                          </a>
                          <span v-else>{{ testimonial.name }}</span>
                        </strong>
                        <div class="author-title">
                          {{ testimonial.title }}{{ testimonial.company ? ` @ ${testimonial.company}` : '' }}
                        </div>
                        <div v-if="testimonial.date" class="testimonial-date">
                          {{ testimonial.date }}
                        </div>
                        <div v-if="testimonial.relationship" class="testimonial-relationship">
                          <TreeShakenIcon icon="mdi-account-group" size="small" class="mr-1" />
                          {{ testimonial.relationship }}
                        </div>
                      </div>
                    </div>

                    <div v-if="testimonial.category" class="testimonial-categories">
                      <v-chip
                        v-for="category in testimonial.category"
                        :key="category"
                        size="small"
                        variant="outlined"
                        class="ma-1"
                      >
                        {{ category }}
                      </v-chip>
                    </div>
                  </div>

                  <div class="testimonial-actions pb-5">
                    <nuxt-link :to="`/about/testimonials#${generateTestimonialId(testimonial.name)}`" class="read-more-link">
                      Read full testimonial →
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </v-carousel-item>
          </v-carousel>

          <!-- Custom Dots/Pagination -->
          <div class="custom-dots" v-if="homePageTestimonials.length > 1">
            <button
              v-for="(testimonial, index) in homePageTestimonials"
              :key="`dot-${index}`"
              @click="currentSlide = index"
              :class="['custom-dot', { 'active': currentSlide === index }]"
              :aria-label="`Go to testimonial ${index + 1}`"
            ></button>
          </div>

          <!-- Custom Navigation Arrows -->
          <v-btn
            v-if="homePageTestimonials.length > 1 && isHovered"
            icon
            class="custom-arrow custom-arrow-left"
            @click="previousSlide"
            size="large"
            color="primary"
          >
            <TreeShakenIcon icon="mdi-chevron-left" />
          </v-btn>

          <v-btn
            v-if="homePageTestimonials.length > 1 && isHovered"
            icon
            class="custom-arrow custom-arrow-right"
            @click="nextSlide"
            size="large"
            color="primary"
          >
            <TreeShakenIcon icon="mdi-chevron-right" />
          </v-btn>
        </div>

      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTestimonials } from '~/composables/useTestimonials'

const { homePageTestimonials, loading, error, formatTestimonialContent, generateTestimonialId } = useTestimonials()

// Carousel state
const currentSlide = ref(0)
const autoRotate = ref(true)
const rotationInterval = ref(8000) // 8 seconds
const rotationTimer = ref(null)
const isHovered = ref(false)

// Navigation functions for custom arrows
const nextSlide = () => {
  if (homePageTestimonials.value.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % homePageTestimonials.value.length
  }
}

const previousSlide = () => {
  if (homePageTestimonials.value.length > 0) {
    currentSlide.value = currentSlide.value === 0
      ? homePageTestimonials.value.length - 1
      : currentSlide.value - 1
  }
}

const pauseRotation = () => {
  autoRotate.value = false
  isHovered.value = true
}

const resumeRotation = () => {
  autoRotate.value = true
  isHovered.value = false
}

// Cleanup
onBeforeUnmount(() => {
  if (rotationTimer.value) {
    clearInterval(rotationTimer.value)
  }
})
</script>

<style scoped lang="scss">
@use '~/style/components/testimonials.scss';

.testimonials-carousel-card {
  .carousel-container {
    position: relative;
    margin: 1rem 0;
  }

  .carousel-wrapper {
    position: relative;
  }

  // Custom arrow styling with proper theming
  .custom-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: rgba(var(--v-theme-surface), 0.5) !important;
    border: 1px solid rgba(var(--v-theme-outline), 0.2) !important;
    box-shadow: 0 2px 8px rgba(var(--v-theme-shadow-key-penumbra-opacity, 0), 0.15);
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);

    &:hover {
      background: rgba(var(--v-theme-surface), 0.7) !important;
      border-color: rgba(var(--v-theme-primary), 0.3) !important;
      box-shadow: 0 4px 16px rgba(var(--v-theme-shadow-key-penumbra-opacity, 0), 0.25);
      transform: translateY(-50%) scale(1.1);
    }

    .v-icon {
      color: rgb(var(--v-theme-primary)) !important;

      &:hover {
        color: rgb(var(--v-theme-primary)) !important;
      }
    }

    // Ensure proper contrast for different themes
    @media (prefers-color-scheme: dark) {
      background: rgba(var(--v-theme-surface-variant), 0.5) !important;

      &:hover {
        background: rgba(var(--v-theme-surface-variant), 0.7) !important;
      }
    }
  }

  .custom-arrow-left {
    left: 1rem;
  }

  .custom-arrow-right {
    right: 1rem;
  }

  .testimonial-carousel {
    border-radius: 12px;

    :deep(.v-carousel__item) {
      padding: 0;
    }
  }

  // Custom dots styling
  .custom-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    padding: 8px;
  }

  .custom-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background-color: rgba(var(--v-theme-on-surface), 0.4);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.7);
      transform: scale(1.1);
    }

    &.active {
      background-color: rgb(var(--v-theme-primary));
      transform: scale(1.2);
    }
  }

  .carousel-item {
    display: flex;
    align-items: center;
    min-height: 300px;
  }

  .testimonial-slide {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .testimonial-content {
    background: rgba(var(--v-theme-surface), 0.1);
    border-radius: 12px;
    padding: 2rem;
    border-left: 4px solid rgb(var(--v-theme-primary));
    transition: all 0.3s ease;

    &:hover {
      background: rgba(var(--v-theme-surface), 0.15);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
  }

  .testimonial-quote {
    font-family: 'Roboto', 'Helvetica Neue', 'Segoe UI', 'sans-serif';
    font-style: italic;
    margin: 0 0 1.5rem 0;
    line-height: 1.8;
    color: rgb(var(--v-theme-on-surface));
    text-align: center;
  }

  .testimonial-meta {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .testimonial-attribution {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .author-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .author-details {
    text-align: left;
  }

  .author-name {
    font-family: 'Roboto', 'Helvetica Neue', 'Segoe UI', 'sans-serif';
    color: rgb(var(--v-theme-primary));
    font-size: 1rem;
    display: block;
    margin-bottom: 0.25rem;

    .linkedin-link {
      color: rgb(var(--v-theme-primary));
      text-decoration: none;
      transition: color 0.3s ease;
      display: inline-flex;
      align-items: center;

      &:hover {
        color: rgb(var(--v-theme-linkHoverColor));
        text-decoration: underline;
      }
    }
  }

  .author-title {
    font-family: 'Roboto', 'Helvetica Neue', 'Segoe UI', 'sans-serif';
    color: rgba(var(--v-theme-on-surface), 0.8);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .testimonial-relationship {
    font-size: 0.8rem;
    color: rgba(var(--v-theme-primary), 0.8);
    margin-bottom: 0.25rem;
    font-style: italic;
    display: flex;
    align-items: center;

    .v-icon {
      color: rgba(var(--v-theme-primary), 0.7);
    }
  }

  .testimonial-date {
    font-size: 0.8rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
  }

  .testimonial-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .testimonial-actions {
    text-align: center;
    margin-top: 1rem;

    .read-more-link {
      color: rgb(var(--v-theme-primary));
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.3s ease;

      &:hover {
        color: rgb(var(--v-theme-linkHoverColor));
        text-decoration: underline;
      }
    }
  }

}

// Responsive design
@media (max-width: 768px) {
  .testimonials-carousel-card {
    .testimonial-content {
      padding: 1.5rem;
    }

    .testimonial-quote {
      font-size: 1rem;
    }

    .author-info {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }

    .testimonial-attribution {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .author-details {
      text-align: center;
    }

    .testimonial-relationship {
      justify-content: center;
    }

    .custom-arrow {
      display: none; // Hide arrows on mobile for better touch experience
    }
  }
}

@media (max-width: 600px) {
  .testimonials-carousel-card {
    .carousel-item {
      min-height: 250px;
    }

    .testimonial-content {
      padding: 1rem;
    }
  }
}
</style>
