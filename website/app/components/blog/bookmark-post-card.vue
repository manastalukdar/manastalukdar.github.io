<template>
  <v-card
    color="cardColor"
    hover
    class="bookmark-post-card py-5 px-5"
    raised
    elevation="8"
    @click="navigateToPost"
  >
    <!-- Post Header with Bookmark Info -->
    <div class="post-header mb-3">
      <div class="d-flex align-items-center justify-space-between">
        <div class="bookmark-info d-flex align-items-center">
          <TreeShakenIcon icon="mdi-bookmark" color="primary" class="me-2" />
          <span class="bookmark-date text-caption">
            Bookmarked {{ formatBookmarkDate(post.bookmarkedAt) }}
          </span>
        </div>
        <BookmarkButton 
          :post="post"
          size="small"
          @click.stop
        />
      </div>
    </div>

    <!-- Post Title and Format -->
    <div class="post-title mb-3">
      <div class="d-flex align-items-center justify-center flex-wrap">
        <h3 class="text-h6 me-2 text-center">{{ post.title }}</h3>
        <div class="d-flex align-items-center">
          <nuxt-link :to="getPostFormatRoute(post['post-format']['url-slug'])" class="pl-2">
            <TreeShakenIcon :icon="getPostFormatIcon(post['post-format'].name)" />
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- Post Metadata -->
    <div class="post-meta mb-3 text-center">
      <div class="meta-row mb-2">
        <span class="meta-label">Authors:</span>
        <span v-for="(author, index) in post.authors" :key="author.name">
          <nuxt-link :to="getAuthorRoute(author['url-slug'])" class="meta-link">
            {{ author.name }}
          </nuxt-link>
          <span v-if="index < post.authors.length - 1">, </span>
        </span>
      </div>
      
      <div class="meta-row mb-2">
        <span class="meta-label">Published:</span>
        <span class="meta-value">{{ formatDate(post['first-published-on']) }}</span>
        <span class="meta-separator">||</span>
        <span class="meta-value">{{ post['reading-time']?.text || '1 min read' }}</span>
      </div>
    </div>

    <!-- Categories and Tags -->
    <div class="post-taxonomy mb-3 text-center">
      <div class="taxonomy-row mb-2">
        <span class="meta-label">Categories:</span>
        <span v-for="(category, index) in post.categories" :key="category.name">
          <nuxt-link :to="getCategoryRoute(category['url-slug'])" class="meta-link">
            {{ category.name }}
          </nuxt-link>
          <span v-if="index < post.categories.length - 1">, </span>
        </span>
      </div>
      
      <div class="taxonomy-row" v-if="post.tags && post.tags.length > 0">
        <span class="meta-label">Tags:</span>
        <span v-for="(tag, index) in post.tags" :key="tag.name">
          <nuxt-link :to="getTagRoute(tag['url-slug'])" class="meta-link">
            {{ tag.name }}
          </nuxt-link>
          <span v-if="index < post.tags.length - 1">, </span>
        </span>
      </div>
    </div>

    <!-- Post Excerpt -->
    <div class="post-excerpt text-left" v-if="post.excerpt">
      <p class="excerpt-text">
        {{ post.excerpt }}
        <nuxt-link :to="getPostRoute()" class="read-more-link">
          ...read more
        </nuxt-link>
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="post-actions d-flex justify-space-between align-center mt-4">
      <v-btn
        variant="outlined"
        color="primary"
        size="small"
        :to="getPostRoute()"
      >
        <TreeShakenIcon icon="mdi-book-open-page-variant" class="me-1" />
        Read Post
      </v-btn>
      
      <div class="post-format-chip">
        <v-chip
          size="small"
          variant="outlined"
          :color="getPostFormatColor(post['post-format'].name)"
        >
          <TreeShakenIcon :icon="getPostFormatIcon(post['post-format'].name)" />
          {{ post['post-format'].name }}
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useNavigationStore } from '~/stores/Navigation'
import { useBlogMetadataStore } from '~/stores/BlogMetadata'
import BookmarkButton from '~/components/blog/bookmark-button.vue'
import TreeShakenIcon from '~/components/TreeShakenIcon.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const props = defineProps({
  post: {
    type: Object,
    required: true,
    validator: (post) => {
      return post && post['url-slug'] && post.title
    }
  }
})

const emit = defineEmits(['click'])

// Stores
const navigationStore = useNavigationStore()
const blogMetadataStore = useBlogMetadataStore()

// Dynamic routes
const dynamicBlogPostRoute = navigationStore.blog.dynamicItems.blogPost.href
const dynamicCategoryRoute = navigationStore.blog.dynamicItems.category.href
const dynamicTagRoute = navigationStore.blog.dynamicItems.tag.href
const dynamicAuthorRoute = navigationStore.blog.dynamicItems.author.href
const dynamicPostFormatRoute = navigationStore.blog.dynamicItems.postFormat.href

// Computed properties
const postLinkSlugs = computed(() => {
  const dayjsObj = dayjs(props.post['first-published-on'])
  return {
    year: dayjsObj.format('YYYY'),
    month: dayjsObj.format('MM'),
    day: dayjsObj.format('DD'),
    post: props.post['url-slug']
  }
})

// Methods
const getPostRoute = () => {
  const { year, month, day, post } = postLinkSlugs.value
  return `${dynamicBlogPostRoute}${year}/${month}/${day}/${post}/`
}

const getCategoryRoute = (slug) => {
  if (!slug || slug === 'undefined') {
    console.warn('Invalid category slug:', slug);
    return '#'; // Return a safe fallback
  }
  return `${dynamicCategoryRoute}${slug}/`
}

const getTagRoute = (slug) => {
  if (!slug || slug === 'undefined') {
    console.warn('Invalid tag slug:', slug);
    return '#'; // Return a safe fallback
  }
  return `${dynamicTagRoute}${slug}/`
}

const getAuthorRoute = (slug) => {
  if (!slug || slug === 'undefined') {
    console.warn('Invalid author slug:', slug);
    return '#'; // Return a safe fallback
  }
  return `${dynamicAuthorRoute}${slug}/`
}

const getPostFormatRoute = (slug) => {
  return `${dynamicPostFormatRoute}${slug}/`
}

const getPostFormatIcon = (formatName) => {
  return blogMetadataStore.getPostFormatIcon(formatName) || 'mdi-pin'
}

const getPostFormatColor = (formatName) => {
  const colorMap = {
    'standard': 'primary',
    'aside': 'secondary',
    'gallery': 'success',
    'link': 'info',
    'image': 'warning',
    'quote': 'purple',
    'status': 'pink',
    'video': 'red',
    'audio': 'orange',
    'chat': 'cyan'
  }
  return colorMap[formatName.toLowerCase()] || 'primary'
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('MMMM DD, YYYY')
}

const formatBookmarkDate = (dateString) => {
  return dayjs(dateString).fromNow()
}

const navigateToPost = (event) => {
  // Only navigate if the click wasn't on an interactive element
  if (event.target.closest('a, button, .v-btn')) {
    return
  }
  
  const route = getPostRoute()
  navigateTo(route)
  emit('click', props.post)
}
</script>

<style scoped>
.bookmark-post-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.bookmark-post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.post-header {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  padding-bottom: 12px;
}

.bookmark-info {
  opacity: 0.7;
}

.bookmark-date {
  font-style: italic;
  color: rgb(var(--v-theme-on-surface));
}

.post-title h3 {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.post-meta,
.post-taxonomy {
  font-size: 0.9rem;
  line-height: 1.4;
}

.meta-label {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-right: 8px;
}

.meta-value {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
}

.meta-separator {
  margin: 0 12px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
}

.meta-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  transition: color 0.2s ease;
}

.meta-link:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

.meta-row,
.taxonomy-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
}

.post-excerpt {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  padding-top: 16px;
}

.excerpt-text {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
  line-height: 1.5;
  margin: 0;
}

.read-more-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.read-more-link:hover {
  text-decoration: underline;
}

.post-actions {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  padding-top: 16px;
}

.post-format-chip {
  opacity: 0.8;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .bookmark-post-card {
    margin: 8px 0;
  }
  
  .post-title h3 {
    font-size: 1.1rem;
    text-align: center;
  }
  
  .meta-row,
  .taxonomy-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .meta-separator {
    display: none;
  }
  
  .post-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}

/* Print styles */
@media print {
  .bookmark-post-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
  }
  
  .bookmark-post-card:hover {
    transform: none;
    box-shadow: none;
  }
}
</style>