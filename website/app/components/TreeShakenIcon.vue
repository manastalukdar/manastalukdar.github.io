<template>
  <svg
    :width="computedSize"
    :height="computedSize"
    viewBox="0 0 24 24"
    :class="computedClasses"
    :style="computedStyles"
  >
    <path :d="iconPath" :fill="computedColor" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getIconPath, hasIcon } from '~/utils/icons'

interface Props {
  icon: string
  size?: string | number
  color?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '24px',
  color: 'currentColor',
  class: ''
})

// Get the SVG path for the icon
const iconPath = computed(() => {
  const path = getIconPath(props.icon)
  if (!path) {
    console.warn(`Tree-shaken icon not found: ${props.icon}. Add it to utils/icons.ts or use fallback v-icon.`)
    return '' // Return empty path for missing icons
  }
  return path
})

// Compute size value with Vuetify size mappings
const computedSize = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }
  
  // Handle Vuetify size names
  const sizeMap: Record<string, string> = {
    'x-small': '12px',
    'small': '16px', 
    'default': '24px',
    'large': '32px',
    'x-large': '40px'
  }
  
  if (typeof props.size === 'string' && sizeMap[props.size]) {
    return sizeMap[props.size]
  }
  
  return props.size
})

// Compute classes
const computedClasses = computed(() => {
  const classes = ['tree-shaken-icon']
  if (props.class) {
    classes.push(props.class)
  }
  return classes.join(' ')
})

// Compute styles
const computedStyles = computed(() => {
  return {}
})

// Compute color
const computedColor = computed(() => {
  return props.color
})

// Check if icon exists (for debugging)
const iconExists = computed(() => hasIcon(props.icon))

// Warn if icon doesn't exist in development
if (process.env.NODE_ENV === 'development' && !iconExists.value) {
  console.warn(`Icon "${props.icon}" not found in tree-shaken icon set. Consider adding it to utils/icons.ts`)
}
</script>

<style scoped>
.tree-shaken-icon {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
  /* Ensure consistent sizing */
  flex-shrink: 0;
}

/* Hover effects */
.tree-shaken-icon:hover {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}
</style>