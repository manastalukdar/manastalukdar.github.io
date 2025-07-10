<template>
  <div v-if="showProgress" class="reading-progress-container">
    <!-- Fixed progress bar at top of viewport -->
    <div 
      class="reading-progress-bar"
      :style="{ 
        width: `${progressPercentage}%`,
        backgroundColor: progressColor
      }"
    ></div>
    
    
    <!-- Reading time remaining (optional) -->
    <div 
      v-if="showTimeRemaining && timeRemaining > 0"
      class="time-remaining"
    >
      {{ timeRemaining }} min left
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  contentSelector: {
    type: String,
    default: '.blogPostContent'
  },
  minContentHeight: {
    type: Number,
    default: 500 // Only show for articles longer than 500px
  },
  progressColor: {
    type: String,
    default: '#1976d2'
  },
  showTimeRemaining: {
    type: Boolean,
    default: true
  },
  readingSpeed: {
    type: Number,
    default: 225 // words per minute
  }
})

const progressPercentage = ref(0)
const contentHeight = ref(0)
const windowHeight = ref(0)
const scrollTop = ref(0)
const estimatedReadingTime = ref(0)

// Computed properties
const showProgress = computed(() => {
  return contentHeight.value > props.minContentHeight
})


const timeRemaining = computed(() => {
  if (!estimatedReadingTime.value) return 0
  const remainingPercent = (100 - progressPercentage.value) / 100
  return Math.max(0, Math.ceil(estimatedReadingTime.value * remainingPercent))
})

// Methods
const updateProgress = () => {
  const contentEl = document.querySelector(props.contentSelector)
  if (!contentEl) return

  const rect = contentEl.getBoundingClientRect()
  const contentTop = rect.top + window.pageYOffset
  const currentScrollTop = window.pageYOffset
  
  scrollTop.value = currentScrollTop
  windowHeight.value = window.innerHeight
  contentHeight.value = contentEl.offsetHeight

  // Calculate progress based on how much of the content is above the viewport
  const contentVisibleStart = Math.max(0, currentScrollTop - contentTop)
  const maxScrollableContent = Math.max(0, contentHeight.value - windowHeight.value)
  
  if (maxScrollableContent > 0) {
    const progress = Math.min(100, Math.max(0, (contentVisibleStart / maxScrollableContent) * 100))
    progressPercentage.value = progress
  } else {
    // For short content, show progress based on scroll position relative to content
    progressPercentage.value = currentScrollTop > contentTop ? 100 : 0
  }
  
  // Debug logging (remove in production)
  console.log('Progress Debug:', {
    progressPercentage: progressPercentage.value,
    contentHeight: contentHeight.value,
    minHeight: props.minContentHeight,
    showProgress: contentHeight.value > props.minContentHeight
  })
}

const calculateReadingTime = () => {
  const contentEl = document.querySelector(props.contentSelector)
  if (!contentEl) return

  const text = contentEl.innerText || contentEl.textContent || ''
  const words = text.trim().split(/\s+/).length
  estimatedReadingTime.value = Math.ceil(words / props.readingSpeed)
}


const handleScroll = () => {
  updateProgress()
}

const handleResize = () => {
  updateProgress()
}

// Lifecycle
onMounted(() => {
  // Wait for content to be rendered
  nextTick(() => {
    calculateReadingTime()
    updateProgress()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.reading-progress-container {
  position: relative;
}

/* Top progress bar */
.reading-progress-bar {
  position: fixed;
  top: 64px; /* Position below app bar */
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
  z-index: 9999;
  transition: width 0.2s ease-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border-radius: 0 0 2px 0;
}


/* Time remaining indicator */
.time-remaining {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  z-index: 998;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .reading-progress-bar {
    top: 56px; /* Smaller app bar on mobile */
  }
  
  .time-remaining {
    bottom: 24px;
    right: 16px;
    font-size: 11px;
    padding: 4px 8px;
  }
}

/* Dark theme support */
.v-theme--dark .reading-progress-bar {
  background: linear-gradient(90deg, #64b5f6 0%, #90caf9 100%);
  box-shadow: 0 2px 4px rgba(255,255,255,0.1);
}

.v-theme--dark .time-remaining {
  background: rgba(255, 255, 255, 0.9);
  color: black;
}

/* Hide on print */
@media print {
  .reading-progress-container {
    display: none !important;
  }
}

/* Smooth animations */
.time-remaining {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>