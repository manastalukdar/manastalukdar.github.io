<template>
  <div v-if="tocItems.length > 0" class="toc-container">
    <!-- Desktop TOC -->
    <div 
      v-if="!isMobile"
      :class="[
        'toc-desktop',
        { 'toc-sticky': isSticky, 'toc-floating': isFloating }
      ]"
    >
      <div class="toc-header">
        <h3 class="toc-title">Table of Contents</h3>
        <v-btn 
          v-if="isCollapsible"
          icon
          size="small"
          @click="toggleCollapse"
          class="toc-toggle"
        >
          <v-icon>{{ isCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
        </v-btn>
      </div>
      
      <nav v-show="!isCollapsed" class="toc-nav" aria-label="Table of Contents">
        <ul class="toc-list">
          <li 
            v-for="item in tocItems" 
            :key="item.id"
            :class="[
              'toc-item',
              `toc-level-${item.level}`,
              { 'toc-active': activeSection === item.id }
            ]"
          >
            <a 
              :href="`#${item.id}`"
              class="toc-link"
              @click="handleTocClick(item.id, $event)"
            >
              {{ item.text }}
            </a>
            <div 
              v-if="showProgress && item.progress !== undefined"
              class="toc-progress"
            >
              <div 
                class="toc-progress-bar"
                :style="{ width: `${item.progress}%` }"
              />
            </div>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Mobile TOC -->
    <div v-else class="toc-mobile">
      <v-btn
        color="primary"
        variant="outlined"
        @click="showMobileMenu = !showMobileMenu"
        class="toc-mobile-toggle"
      >
        <v-icon left>mdi-format-list-bulleted</v-icon>
        Table of Contents
      </v-btn>
      
      <v-dialog v-model="showMobileMenu" max-width="400px">
        <v-card>
          <v-card-title class="toc-mobile-title">
            Table of Contents
          </v-card-title>
          <v-card-text>
            <nav class="toc-nav" aria-label="Table of Contents">
              <ul class="toc-list">
                <li 
                  v-for="item in tocItems" 
                  :key="item.id"
                  :class="[
                    'toc-item',
                    `toc-level-${item.level}`,
                    { 'toc-active': activeSection === item.id }
                  ]"
                >
                  <a 
                    :href="`#${item.id}`"
                    class="toc-link"
                    @click="handleTocClick(item.id, $event, true)"
                  >
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </nav>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useDisplay } from 'vuetify'

// Props
const props = defineProps({
  contentSelector: {
    type: String,
    default: '.blogPostContent'
  },
  minHeadings: {
    type: Number,
    default: 3
  },
  maxLevel: {
    type: Number,
    default: 4
  },
  position: {
    type: String,
    default: 'sticky', // 'sticky', 'floating', 'inline'
    validator: (value) => ['sticky', 'floating', 'inline'].includes(value)
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  smoothScroll: {
    type: Boolean,
    default: true
  },
  collapsible: {
    type: Boolean,
    default: true
  }
})

// Composables
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// Reactive state
const tocItems = ref([])
const activeSection = ref('')
const isCollapsed = ref(false)
const showMobileMenu = ref(false)

// Computed properties
const isSticky = computed(() => props.position === 'sticky')
const isFloating = computed(() => props.position === 'floating')
const isCollapsible = computed(() => props.collapsible && !isMobile.value)

// Methods
const extractTocFromContent = () => {
  const content = document.querySelector(props.contentSelector)
  if (!content) return []

  const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const items = []

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1))
    if (level <= props.maxLevel) {
      let id = heading.id
      
      // Generate ID if it doesn't exist
      if (!id) {
        id = `toc-heading-${index}`
        heading.id = id
      }

      items.push({
        id,
        text: heading.textContent.trim(),
        level,
        element: heading,
        progress: 0
      })
    }
  })

  return items
}

const handleTocClick = async (id, event, closeMobile = false) => {
  event.preventDefault()
  
  if (closeMobile) {
    // For mobile: close modal first, then scroll after DOM updates
    showMobileMenu.value = false
    await nextTick()
    
    // Wait a bit more for modal close animation to complete
    setTimeout(() => {
      scrollToElement(id)
    }, 100)
  } else {
    // Desktop: scroll directly
    scrollToElement(id)
  }
}

const scrollToElement = (id) => {
  const element = document.getElementById(id)
  if (!element) {
    console.warn(`TOC: Element with ID "${id}" not found`)
    return
  }

  if (isMobile.value) {
    // Mobile-specific scrolling: use coordinates instead of scrollIntoView
    // This is more reliable for mobile browsers, especially in modal contexts
    const elementRect = element.getBoundingClientRect()
    const bodyRect = document.body.getBoundingClientRect()
    const elementTop = elementRect.top - bodyRect.top
    const scrollTop = elementTop - 80 // 80px offset for better visibility
    
    if (props.smoothScroll) {
      window.scrollTo({ 
        top: scrollTop, 
        behavior: 'smooth'
      })
    } else {
      window.scrollTo(0, scrollTop)
    }
  } else {
    // Desktop scrolling
    if (props.smoothScroll) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    } else {
      element.scrollIntoView()
    }
  }
}

const updateActiveSection = () => {
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  
  let currentSection = ''
  
  tocItems.value.forEach((item, index) => {
    const element = item.element
    if (element) {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + scrollY
      
      // Check if element is in viewport or has been scrolled past
      if (elementTop <= scrollY + windowHeight / 3) {
        currentSection = item.id
      }
      
      // Calculate progress for each section
      if (props.showProgress) {
        const nextItem = tocItems.value[index + 1]
        const nextElementTop = nextItem ? 
          nextItem.element.getBoundingClientRect().top + scrollY : 
          document.documentElement.scrollHeight
        
        const sectionHeight = nextElementTop - elementTop
        const scrollProgress = Math.max(0, Math.min(100, 
          ((scrollY - elementTop) / sectionHeight) * 100
        ))
        
        item.progress = scrollProgress
      }
    }
  })
  
  activeSection.value = currentSection
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleKeyboardNavigation = (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()
    
    const currentIndex = tocItems.value.findIndex(item => item.id === activeSection.value)
    let newIndex
    
    if (event.key === 'ArrowUp') {
      newIndex = Math.max(0, currentIndex - 1)
    } else {
      newIndex = Math.min(tocItems.value.length - 1, currentIndex + 1)
    }
    
    const newItem = tocItems.value[newIndex]
    if (newItem) {
      handleTocClick(newItem.id, { preventDefault: () => {} })
    }
  }
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  
  // Extract TOC items from content
  const items = extractTocFromContent()
  
  // Only show TOC if there are enough headings
  if (items.length >= props.minHeadings) {
    tocItems.value = items
    
    // Set up scroll listener
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection, { passive: true })
    
    // Initial update
    updateActiveSection()
    
    // Set up keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
  window.removeEventListener('resize', updateActiveSection)
  document.removeEventListener('keydown', handleKeyboardNavigation)
})
</script>

<style scoped>
.toc-container {
  position: relative;
}

/* Desktop TOC Styles */
.toc-desktop {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline));
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  max-width: 300px;
}

.toc-desktop.toc-sticky {
  position: sticky;
  top: 20px;
  z-index: 10;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.toc-desktop.toc-floating {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgb(var(--v-theme-outline));
}

.toc-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
}

.toc-toggle {
  opacity: 0.7;
}

.toc-toggle:hover {
  opacity: 1;
}

.toc-nav {
  max-height: 400px;
  overflow-y: auto;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  position: relative;
  margin: 4px 0;
}

.toc-level-1 { margin-left: 0; }
.toc-level-2 { margin-left: 16px; }
.toc-level-3 { margin-left: 32px; }
.toc-level-4 { margin-left: 48px; }

.toc-link {
  display: block;
  padding: 6px 8px;
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  line-height: 1.4;
}

.toc-link:hover {
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.toc-item.toc-active .toc-link {
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
}

.toc-progress {
  height: 2px;
  background: rgba(var(--v-theme-outline), 0.3);
  border-radius: 1px;
  margin-top: 2px;
  overflow: hidden;
}

.toc-progress-bar {
  height: 100%;
  background: rgb(var(--v-theme-primary));
  transition: width 0.3s ease;
  border-radius: 1px;
}

/* Mobile TOC Styles */
.toc-mobile {
  margin: 16px 0;
  text-align: center;
}

.toc-mobile-toggle {
  width: 100%;
  justify-content: center;
}

.toc-mobile-title {
  text-align: center;
  font-weight: 600;
}

/* Mobile modal scrolling fixes */
.v-dialog .v-card-text {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
}

@media only screen and (max-width: 768px) {
  .v-dialog .v-card-text {
    max-height: 60vh;
    overflow-y: auto;
  }
  
  /* Improve mobile touch interaction */
  .toc-mobile .toc-link {
    padding: 12px 16px;
    min-height: 44px;
    display: flex;
    align-items: center;
  }
  
  /* Better modal presentation on mobile */
  .v-dialog > .v-card {
    margin: 16px;
    max-height: calc(100vh - 32px);
  }
}

/* Print Styles */
@media print {
  .toc-desktop.toc-sticky,
  .toc-desktop.toc-floating,
  .toc-mobile {
    display: none;
  }
  
  .toc-desktop:not(.toc-sticky):not(.toc-floating) {
    position: static;
    max-width: 100%;
    border: 1px solid #ccc;
    page-break-inside: avoid;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .toc-desktop {
    max-width: 100%;
  }
  
  .toc-desktop.toc-floating {
    position: static;
    transform: none;
    right: auto;
    top: auto;
    box-shadow: none;
  }
}

/* Dark Theme Adjustments */
.v-theme--dark .toc-desktop {
  background: rgb(var(--v-theme-surface));
}

.v-theme--dark .toc-link:hover {
  background: rgba(var(--v-theme-primary), 0.2);
}

.v-theme--dark .toc-item.toc-active .toc-link {
  background: rgba(var(--v-theme-primary), 0.2);
}

/* Accessibility */
.toc-link:focus {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Smooth scrolling for supported browsers */
@supports (scroll-behavior: smooth) {
  html {
    scroll-behavior: smooth;
  }
}
</style>