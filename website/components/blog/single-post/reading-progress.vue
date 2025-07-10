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
    
    <!-- Optional circular progress indicator (for longer articles) -->
    <div 
      v-if="showCircularProgress && progressPercentage > 5"
      class="reading-progress-circle"
    >
      <v-btn
        fab
        small
        :color="progressColor"
        elevation="4"
        class="progress-fab"
        @click="scrollToTop"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="progress-svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-opacity="0.2"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            class="progress-circle"
          />
        </svg>
        <span class="progress-text">{{ Math.round(progressPercentage) }}%</span>
      </v-btn>
    </div>
    
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
    default: 1000 // Only show for articles longer than 1000px
  },
  progressColor: {
    type: String,
    default: '#1976d2'
  },
  showCircularProgress: {
    type: Boolean,
    default: true
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
  return contentHeight.value > props.minContentHeight && progressPercentage.value > 0
})

const circumference = computed(() => 2 * Math.PI * 10) // radius is 10

const strokeDashoffset = computed(() => {
  return circumference.value - (progressPercentage.value / 100) * circumference.value
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
    progressPercentage.value = currentScrollTop > contentTop ? 100 : 0
  }
}

const calculateReadingTime = () => {
  const contentEl = document.querySelector(props.contentSelector)
  if (!contentEl) return

  const text = contentEl.innerText || contentEl.textContent || ''
  const words = text.trim().split(/\s+/).length
  estimatedReadingTime.value = Math.ceil(words / props.readingSpeed)
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
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
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, currentColor 0%, rgba(255,255,255,0.8) 100%);
  z-index: 1000;
  transition: width 0.1s ease-out;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Circular progress indicator */
.reading-progress-circle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  transition: all 0.3s ease;
}

.progress-fab {
  position: relative;
  width: 56px !important;
  height: 56px !important;
}

.progress-svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
}

.progress-circle {
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.2s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: bold;
  color: white;
  z-index: 1;
}

/* Time remaining indicator */
.time-remaining {
  position: fixed;
  bottom: 88px;
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
  .reading-progress-circle {
    bottom: 16px;
    right: 16px;
  }
  
  .time-remaining {
    bottom: 80px;
    right: 16px;
    font-size: 11px;
    padding: 4px 8px;
  }
  
  .progress-fab {
    width: 48px !important;
    height: 48px !important;
  }
  
  .progress-svg {
    width: 32px;
    height: 32px;
  }
  
  .progress-text {
    font-size: 9px;
  }
}

/* Dark theme support */
.v-theme--dark .reading-progress-bar {
  box-shadow: 0 1px 3px rgba(255,255,255,0.1);
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
.reading-progress-circle,
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

/* Hover effects */
.progress-fab:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.progress-fab:hover .progress-text {
  font-size: 11px;
  transition: font-size 0.2s ease;
}
</style>