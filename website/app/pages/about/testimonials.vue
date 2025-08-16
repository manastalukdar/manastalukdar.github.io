<template>
  <v-container>
    <breadcrumbs :breadcrumbs="breadcrumbsData" />
    <p />
    <v-row>
      <v-col cols="12">
        <v-card
          color="cardColor"
          class="pa-8 testimonials-page"
          raised
          elevation="8"
          style="height: 100%"
          id="printMe"
        >
          <v-row class="text-h6 px-3 py-3 page-header justify-center">
            <h1>What colleagues have said about me</h1>
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

          <div v-else>
            <!-- Filtering Controls -->
            <div class="testimonial-filters mb-4">
              <div class="filter-section">
                <h6 class="filter-title">Filter by Category:</h6>
                <div class="filter-chips">
                  <v-chip
                    :class="{ active: selectedCategory === 'all' }"
                    @click="filterByCategory('all')"
                    size="small"
                    variant="outlined"
                    class="ma-1 filter-chip"
                  >
                    All ({{ fullTestimonials.length }})
                  </v-chip>
                  <v-chip
                    v-for="category in availableCategories"
                    :key="category"
                    :class="{ active: selectedCategory === category }"
                    @click="filterByCategory(category)"
                    size="small"
                    variant="outlined"
                    class="ma-1 filter-chip"
                  >
                    {{ category }} ({{ getCategoryCount(category) }})
                  </v-chip>
                </div>
              </div>

              <div class="filter-section">
                <h6 class="filter-title">Search:</h6>
                <v-text-field
                  v-model="searchQuery"
                  placeholder="Search testimonials..."
                  variant="outlined"
                  density="compact"
                  class="search-field"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                />
              </div>
            </div>

            <!-- Testimonials Grid -->
            <div class="testimonials-grid">
              <div
                v-for="testimonial in filteredTestimonials"
                :key="testimonial.name"
                :id="generateTestimonialId(testimonial.name)"
                class="testimonial-card"
              >
                <blockquote class="testimonial-quote" v-html="formatTestimonialContent(testimonial.content)">
                </blockquote>

                <div class="testimonial-meta">
                  <div class="testimonial-attribution">
                    <div class="author-info">
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
                            <v-icon size="small" class="ml-1">mdi-linkedin</v-icon>
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
                          <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
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
                        @click="filterByCategory(category)"
                      >
                        {{ category }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results Message -->
            <div v-if="filteredTestimonials.length === 0" class="no-results text-center pa-4">
              <v-icon size="large" class="mb-2">mdi-comment-search</v-icon>
              <h6>No testimonials found</h6>
              <p class="text-body-2">Try adjusting your filters or search terms.</p>
            </div>
          </div>
          <p />
          <v-row class="printButton row py-10 justify-center">
            <v-icon class="justify-center" @click="print">mdi-printer</v-icon>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { usePaperizer } from 'paperizer'
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import breadcrumbs from "~/components/breadcrumbs"
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'
import { useTestimonials } from '~/composables/useTestimonials'

const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const blogMetadataStore = useBlogMetadataStore();
const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public.baseUrl;
const route = useRoute();
const router = useRouter();

// Load testimonials using the new composable
const { fullTestimonials, loading, error, formatTestimonialContent, generateTestimonialId } = useTestimonials()

// Filtering state
const selectedCategory = ref('all')
const searchQuery = ref('')

// Get all available categories
const availableCategories = computed(() => {
  const categories = new Set()
  fullTestimonials.value.forEach(testimonial => {
    if (testimonial.category) {
      testimonial.category.forEach(cat => categories.add(cat))
    }
  })
  return Array.from(categories).sort()
})

// Filter testimonials based on category and search
const filteredTestimonials = computed(() => {
  let filtered = [...fullTestimonials.value]

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(testimonial =>
      testimonial.category?.includes(selectedCategory.value)
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(testimonial =>
      testimonial.name.toLowerCase().includes(query) ||
      testimonial.title.toLowerCase().includes(query) ||
      testimonial.company.toLowerCase().includes(query) ||
      testimonial.content.toLowerCase().includes(query) ||
      testimonial.category?.some(cat => cat.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Filtering functions
const filterByCategory = (category) => {
  selectedCategory.value = category
}

const getCategoryCount = (category) => {
  return fullTestimonials.value.filter(testimonial =>
    testimonial.category?.includes(category)
  ).length
}

// Debounced scroll handler to prevent multiple simultaneous scroll attempts
let scrollTimeout = null
const debouncedScrollToTestimonial = (delay = 100) => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }

  scrollTimeout = setTimeout(async () => {
    await performScroll()
  }, delay)
}

// Core scroll functionality
const performScroll = async () => {
  await nextTick()
  const hash = window.location.hash
  console.log('[performScroll] Attempting scroll with hash:', hash, 'loading:', loading.value, 'testimonials count:', fullTestimonials.value.length)

  if (!hash || !hash.startsWith('#testimonial-')) {
    console.log('[performScroll] No valid hash found')
    return
  }

  // Clear any active filters to ensure the target testimonial is visible
  selectedCategory.value = 'all'
  searchQuery.value = ''

  // Wait for re-render after clearing filters
  await nextTick()

  // Wait for testimonials to be loaded and DOM to be ready
  let attempts = 0
  const maxAttempts = 100 // 10 seconds max

  const findAndScrollToElement = async () => {
    // Check if testimonials are loaded
    if (loading.value || fullTestimonials.value.length === 0) {
      console.log('[findAndScrollToElement] Still loading testimonials...')
      if (attempts < maxAttempts) {
        attempts++
        setTimeout(findAndScrollToElement, 100)
      }
      return
    }

    const targetElement = document.querySelector(hash)
    console.log('[findAndScrollToElement] Attempt:', attempts, 'Element found:', !!targetElement, 'Hash:', hash)

    if (targetElement) {
      console.log('[findAndScrollToElement] SUCCESS - Scrolling to element:', hash)

      // Add visual highlight to the targeted testimonial
      targetElement.classList.add('testimonial-highlighted')

      // Smooth scroll to the element with offset for fixed headers
      const headerOffset = 120
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Remove highlight after a delay
      setTimeout(() => {
        targetElement.classList.remove('testimonial-highlighted')
      }, 3000)

      return // Success, stop trying
    }

    // Element not found, try again
    if (attempts < maxAttempts) {
      attempts++
      setTimeout(findAndScrollToElement, 100)
    } else {
      console.log('[findAndScrollToElement] FAILED - Max attempts reached, element not found:', hash)
    }
  }

  await findAndScrollToElement()
}

// Set up fragment navigation on component mount and route changes
onMounted(() => {
  console.log('[onMounted] Initial scroll attempt')
  debouncedScrollToTestimonial(200)

  // Add router afterEach hook to handle navigation completion
  const removeAfterEach = router.afterEach((to) => {
    console.log('[router.afterEach] Navigation completed to:', to.path, 'hash:', to.hash)
    if (to.path === '/about/testimonials' && to.hash && to.hash.startsWith('#testimonial-')) {
      debouncedScrollToTestimonial(300)
    }
  })

  // Cleanup on unmount
  onBeforeUnmount(() => {
    removeAfterEach()
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
  })
})

// Single comprehensive watcher for all navigation changes
watch([() => route.fullPath, () => loading.value, () => fullTestimonials.value.length],
  ([newPath, isLoading, testimonialsCount], [oldPath, oldLoading, oldCount]) => {
    console.log('[comprehensive watcher] Path:', newPath, 'Loading:', isLoading, 'Testimonials:', testimonialsCount)

    const hasTestimonialHash = newPath && newPath.includes('/about/testimonials#testimonial-')
    const testimonialsJustLoaded = oldLoading && !isLoading && testimonialsCount > 0
    const pathChanged = newPath !== oldPath

    if (hasTestimonialHash && (pathChanged || testimonialsJustLoaded)) {
      const delay = pathChanged ? 400 : 200 // Longer delay for navigation vs. loading
      console.log('[comprehensive watcher] Triggering scroll with delay:', delay)
      debouncedScrollToTestimonial(delay)
    }
  },
  { immediate: true }
)

async function setupBlogMetadata() {
    try {
        if (blogMetadataStore.blogMetadata.length < runtimeConfig.public.blogPostCount) {
          await blogMetadataStore.setupBlogMetadata(runtimeConfig.public.baseUrl);
        }
    } catch (error) {
      console.log(error)
    }
};
await setupBlogMetadata();

const appOwner = globalDataStore.appOwner;
const currentPage =
  navigationStore.about.aboutItems[4].text +
  ' | ' +
  navigationStore.about.aboutText;
const currentHref = navigationStore.about.aboutItems[4].href;
const testimonialsText = navigationStore.about.aboutItems[4].text;
const title = currentPage + ' || ' + appOwner;
const description = 'What colleagues have said about Manas Talukdar - professional testimonials and recommendations.';
const url = baseUrl + currentHref;

const breadcrumbsData = [
  {
    title: 'Home',
    disabled: false,
    href: '/',
    exact: true,
  },
  {
    title: 'About',
    disabled: true,
    exact: true,
  },
  {
    title: testimonialsText,
    disabled: false,
    href: currentHref,
    exact: true,
  }
];

const breadcrumbsStructuredDataArray = breadcrumbsData.map(
  (item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@id': baseUrl + item.href,
      name: item.title,
    },
  })
);

const breadcrumbsStructuredData = {
  '@context': 'http://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbsStructuredDataArray,
};

useHead({
  title: title,
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: description,
    },
    {
      hid: 'apple-mobile-web-app-title',
      name: 'apple-mobile-web-app-title',
      content: title,
    },
    {
      hid: 'og-title',
      name: 'og:title',
      property: 'og:title',
      content: title,
    },
    {
      hid: 'og-url',
      name: 'og:url',
      property: 'og:url',
      content: url,
    },
    {
      hid: 'og-description',
      name: 'og:description',
      property: 'og:description',
      content: description,
    },
  ],
  link: [{ rel: 'canonical', href: url }],
  __dangerouslyDisableSanitizers: ['script'],
  script: [
    {
      innerHTML: JSON.stringify(breadcrumbsStructuredData),
      type: 'application/ld+json',
    },
  ],
});

const { paperize } = usePaperizer('printMe', {
  styles: [
    '/styles/print-generic.css'
  ]
});

const print = () => {
  paperize()
};
</script>

<style scoped lang="scss">
@use '~/style/components/testimonials.scss';

// Filtering interface styles
.testimonial-filters {
  background: rgba(var(--v-theme-surface), 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  .filter-section {
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .filter-title {
    color: rgb(var(--v-theme-primary));
    margin-bottom: 0.75rem;
    font-weight: 600;
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .filter-chip {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(var(--v-theme-primary), 0.1);
    }

    &.active {
      background: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
    }
  }

  .search-field {
    max-width: 400px;
  }
}

// Enhanced testimonial metadata
.testimonial-meta {
  margin-top: 1.5rem;
}

.author-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.author-details {
  flex: 1;
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
  font-size: 0.85rem;
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
  margin-bottom: 0.5rem;
}

.testimonial-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;

  .v-chip {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(var(--v-theme-primary), 0.1);
      transform: scale(1.05);
    }
  }
}

// No results styling
.no-results {
  color: rgba(var(--v-theme-on-surface), 0.6);

  .v-icon {
    color: rgba(var(--v-theme-on-surface), 0.4);
  }
}

// Testimonial highlighting for fragment navigation
.testimonial-highlighted {
  background: rgba(var(--v-theme-primary), 0.08) !important;
  border: 2px solid rgba(var(--v-theme-primary), 0.3) !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.15) !important;
  transition: all 0.6s ease !important;
  transform: scale(1.02) !important;

  // Smooth fade-out animation
  &.testimonial-highlighted {
    animation: highlightFade 3s ease-in-out;
  }
}

@keyframes highlightFade {
  0% {
    background: rgba(var(--v-theme-primary), 0.15);
    transform: scale(1.03);
  }
  50% {
    background: rgba(var(--v-theme-primary), 0.08);
    transform: scale(1.02);
  }
  100% {
    background: rgba(var(--v-theme-primary), 0.02);
    transform: scale(1);
  }
}

// Responsive design
@media (max-width: 768px) {
  .testimonial-filters {
    padding: 1rem;

    .filter-chips {
      justify-content: center;
    }

    .search-field {
      max-width: 100%;
    }
  }

  .author-info {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .testimonial-relationship {
    justify-content: center;
    text-align: center;
  }
}
</style>
