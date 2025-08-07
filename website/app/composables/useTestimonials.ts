import { ref, computed } from 'vue'
import { computedAsync } from '@vueuse/core'
import fm from 'front-matter'

export interface Position {
  title: string
  company: string
}

export interface TestimonialData {
  name: string
  title: string
  company: string
  linkedin?: string
  order: number
  excerpt: string
  content: string
  photo?: string
  companyLogo?: string
  date?: string
  featured?: boolean
  category?: string[]
  enabled?: boolean
  relationship?: string
  positions?: Position[]
}

export const useTestimonials = () => {
  const testimonials = ref<TestimonialData[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Load individual testimonial file
  const loadTestimonialFile = async (fileName: string): Promise<TestimonialData | null> => {
    try {
      const fileContent = await import(`~/pages/about/content-testimonials/${fileName}.md?raw`)
      const parsed = fm(fileContent.default)

      let content = parsed.body.trim()
      if (content.startsWith('"') && content.endsWith('"')) {
        content = content.slice(1, -1)
      }

      return {
        ...parsed.attributes as Omit<TestimonialData, 'content'>,
        content
      }
    } catch (err) {
      console.error(`Error loading testimonial ${fileName}:`, err)
      return null
    }
  }

  // Load all testimonials with dynamic discovery
  const loadAllTestimonials = computedAsync(async () => {
    loading.value = true
    error.value = null

    try {
      // Dynamically discover all testimonial files
      const testimonialModules = import.meta.glob('~/pages/about/content-testimonials/*.md', { as: 'raw' })
      
      // Extract filenames without extension from the module paths
      const testimonialFiles = Object.keys(testimonialModules).map(path => {
        const fileName = path.split('/').pop()?.replace('.md', '') || ''
        return fileName
      }).filter(Boolean)

      const loadedTestimonials = await Promise.all(
        testimonialFiles.map(fileName => loadTestimonialFile(fileName))
      )

      const validTestimonials = loadedTestimonials
        .filter((t): t is TestimonialData => t !== null)
        .filter(t => t.enabled !== false) // Filter out disabled testimonials
        .sort((a, b) => (a.order || 999) - (b.order || 999))

      testimonials.value = validTestimonials
      return validTestimonials
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load testimonials'
      console.error('Error loading testimonials:', err)
      return []
    } finally {
      loading.value = false
    }
  })

  // Get testimonials for home page (excerpts only, prioritize featured)
  const homePageTestimonials = computed(() => {
    const allTestimonials = loadAllTestimonials.value || []
    // Show featured testimonials first, then others
    const sorted = allTestimonials.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return (a.order || 999) - (b.order || 999)
    })

    return sorted.map(testimonial => ({
      ...testimonial,
      content: testimonial.excerpt // Use excerpt for home page
    }))
  })

  // Get testimonials for dedicated page (full content)
  const fullTestimonials = computed(() => loadAllTestimonials.value || [])

  // Filter testimonials by category
  const getTestimonialsByCategory = (category: string) =>
    computed(() =>
      fullTestimonials.value.filter(testimonial =>
        testimonial.category?.includes(category)
      )
    )

  // Get featured testimonials only
  const featuredTestimonials = computed(() =>
    fullTestimonials.value.filter(testimonial => testimonial.featured)
  )

  // Generate URL-friendly slug from testimonial name
  const generateTestimonialSlug = (name: string): string => {
    if (!name) return ''
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .trim()
  }

  // Generate testimonial ID for HTML elements
  const generateTestimonialId = (name: string): string => {
    return `testimonial-${generateTestimonialSlug(name)}`
  }

  // Format testimonial content (handle line breaks)
  const formatTestimonialContent = (content: string): string => {
    if (!content) return ''
    return content.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')
  }

  return {
    testimonials,
    loading,
    error,
    homePageTestimonials,
    fullTestimonials,
    featuredTestimonials,
    getTestimonialsByCategory,
    formatTestimonialContent,
    generateTestimonialSlug,
    generateTestimonialId,
    loadTestimonialFile
  }
}
