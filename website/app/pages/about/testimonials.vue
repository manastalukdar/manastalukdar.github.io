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
          <v-row class="text-h5 px-3 py-3 page-header justify-center">
            <span>What colleagues have said about me</span>
          </v-row>
          <p />
          <div class="testimonials-grid">
            <div
              v-for="testimonial in sortedTestimonials"
              :key="testimonial.name"
              class="testimonial-card"
            >
              <blockquote class="testimonial-quote" v-html="formatTestimonialContent(testimonial.content)">
              </blockquote>
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
import fm from 'front-matter'
import { ref, computed } from 'vue'
import { computedAsync } from '@vueuse/core'
import breadcrumbs from "~/components/breadcrumbs"
import { useNavigationStore } from '@/stores/Navigation'
import { useGlobalDataStore } from '@/stores/GlobalData'
import { useBlogMetadataStore } from '@/stores/BlogMetadata'

const navigationStore = useNavigationStore();
const globalDataStore = useGlobalDataStore();
const blogMetadataStore = useBlogMetadataStore();
const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public.baseUrl;

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

// Load all testimonial files dynamically
const testimonials = ref([]);

// Load individual testimonial files with static imports
const gregHolt = computedAsync(async () => {
  try {
    const fileContent = await import('./content-testimonials/greg-holt.md?raw');
    const parsed = fm(fileContent.default);
    let content = parsed.body.trim();
    if (content.startsWith('"') && content.endsWith('"')) {
      content = content.slice(1, -1);
    }
    return { ...parsed.attributes, content };
  } catch (error) {
    console.log('Error loading greg-holt.md:', error);
    return null;
  }
});

const cherifJazra = computedAsync(async () => {
  try {
    const fileContent = await import('./content-testimonials/cherif-jazra.md?raw');
    const parsed = fm(fileContent.default);
    let content = parsed.body.trim();
    if (content.startsWith('"') && content.endsWith('"')) {
      content = content.slice(1, -1);
    }
    return { ...parsed.attributes, content };
  } catch (error) {
    console.log('Error loading cherif-jazra.md:', error);
    return null;
  }
});

const dylanHuang = computedAsync(async () => {
  try {
    const fileContent = await import('./content-testimonials/dylan-huang.md?raw');
    const parsed = fm(fileContent.default);
    let content = parsed.body.trim();
    if (content.startsWith('"') && content.endsWith('"')) {
      content = content.slice(1, -1);
    }
    return { ...parsed.attributes, content };
  } catch (error) {
    console.log('Error loading dylan-huang.md:', error);
    return null;
  }
});

const jimWalker = computedAsync(async () => {
  try {
    const fileContent = await import('./content-testimonials/jim-walker.md?raw');
    const parsed = fm(fileContent.default);
    let content = parsed.body.trim();
    if (content.startsWith('"') && content.endsWith('"')) {
      content = content.slice(1, -1);
    }
    return { ...parsed.attributes, content };
  } catch (error) {
    console.log('Error loading jim-walker.md:', error);
    return null;
  }
});

// Combine all testimonials into sorted array
const sortedTestimonials = computed(() => {
  const allTestimonials = [gregHolt.value, cherifJazra.value, dylanHuang.value, jimWalker.value]
    .filter(t => t !== null && t !== undefined);
  
  return allTestimonials.sort((a, b) => (a.order || 999) - (b.order || 999));
});

// Format testimonial content to handle line breaks
const formatTestimonialContent = (content) => {
  if (!content) return '';
  // Convert line breaks to HTML br tags
  return content.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
};

const { paperize } = usePaperizer('printMe', {
  styles: [
    '/styles/print-generic.css'
  ]
});

const print = () => {
  paperize()
};
</script>

<style scoped>
.testimonials-page .testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin: 1rem 0;
}

.testimonials-page .testimonial-card {
  background: rgba(var(--v-theme-surface), 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid rgb(var(--v-theme-primary));
  transition: background-color 0.3s ease;
}

.testimonials-page .testimonial-card:hover {
  background: rgba(var(--v-theme-surface), 0.15);
}

.testimonials-page .testimonial-quote {
  font-family: 'Maven Pro', 'Helvetica Neue', 'Segoe UI', 'sans-serif';
  font-style: italic;
  margin: 0 0 1.5rem 0;
  font-size: inherit;
  line-height: 1.8;
  color: rgb(var(--v-theme-on-surface));
}

.testimonials-page .testimonial-attribution {
  text-align: right;
  margin-top: 1rem;
}

.testimonials-page .testimonial-attribution strong {
  font-family: 'Maven Pro', 'Helvetica Neue', 'Segoe UI', 'sans-serif';
  color: rgb(var(--v-theme-primary));
  font-size: inherit;
}

.testimonials-page .testimonial-attribution strong a {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  transition: color 0.3s ease;
}

.testimonials-page .testimonial-attribution strong a:hover {
  color: rgb(var(--v-theme-linkHoverColor));
  text-decoration: underline;
}

.testimonials-page .testimonial-attribution em {
  font-family: 'Maven Pro', 'Helvetica Neue', 'Segoe UI', 'sans-serif';
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 0.9em;
}

@media (max-width: 600px) {
  .testimonials-page .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .testimonials-page .testimonial-card {
    padding: 1rem;
  }
}
</style>