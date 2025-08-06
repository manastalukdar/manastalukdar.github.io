/**
 * Composable for generating JSON-LD structured data optimized for AI training systems
 * Implements schema.org standards with enhanced metadata for better content understanding
 */
import { useRuntimeConfig } from '#imports'
// Import moved inside function to avoid ES module issues
// import { calculateReadingTime } from '~/utils/readingTime'

interface BlogPostStructuredData {
  '@context': string
  '@type': string
  mainEntityOfPage: {
    '@type': string
    '@id': string
  }
  headline: string
  description: string
  image: string | string[]
  author: Array<{
    '@type': string
    name: string
    url?: string
    sameAs?: string[]
  }>
  publisher: {
    '@type': string
    name: string
    logo: {
      '@type': string
      url: string
      width?: number
      height?: number
    }
    url?: string
    sameAs?: string[]
  }
  datePublished: string
  dateModified: string
  articleSection: string
  keywords: string
  about: Array<{
    '@type': string
    name: string
  }>
  mentions?: Array<{
    '@type': string
    name: string
  }>
  genre: string
  wordCount?: number
  timeRequired?: string
  inLanguage: string
  isAccessibleForFree: boolean
  license?: string
  copyrightYear?: number
  copyrightHolder?: {
    '@type': string
    name: string
  }
  educationalLevel?: string
  learningResourceType?: string
  teaches?: string[]
}

interface BreadcrumbStructuredData {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    item: {
      '@type': string
      '@id': string
      name: string
    }
  }>
}

interface PersonStructuredData {
  '@context': string
  '@type': string
  name: string
  url: string
  sameAs: string[]
  jobTitle: string
  worksFor: {
    '@type': string
    name: string
  }
  alumniOf?: Array<{
    '@type': string
    name: string
  }>
  knowsAbout: string[]
  description: string
}

interface OrganizationStructuredData {
  '@context': string
  '@type': string
  name: string
  url: string
  logo: {
    '@type': string
    url: string
    width?: number
    height?: number
  }
  sameAs: string[]
  founder: {
    '@type': string
    name: string
  }
  foundingDate?: string
  description: string
  knowsAbout: string[]
}

interface WebSiteStructuredData {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
  license?: string
  copyrightYear?: number
  copyrightHolder?: {
    '@type': string
    name: string
  }
  publisher: {
    '@type': string
    name: string
  }
  potentialAction?: {
    '@type': string
    target: {
      '@type': string
      urlTemplate: string
    }
    'query-input': string
  }
  mainEntity?: {
    '@type': string
    name: string
  }
}

export const useStructuredData = () => {
  const runtimeConfig = useRuntimeConfig()
  const baseUrl = runtimeConfig.public.baseUrl

  /**
   * Generate enhanced BlogPosting structured data for AI training optimization
   */
  const generateBlogPostStructuredData = (
    postMetadata: any,
    postContent: string,
    url: string,
    appOwner: string
  ): BlogPostStructuredData => {
    // Calculate reading time and word count (simple implementation to avoid ES module issues)
    const plainText = postContent
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
    
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length
    const readingTimeMinutes = Math.ceil(wordCount / 225) // 225 words per minute
    
    const readingStats = {
      wordCount,
      readingTimeMinutes
    }
    
    // Extract categories and tags for enhanced semantic understanding
    const categories = postMetadata.categories?.map((cat: any) => cat.name) || []
    const tags = postMetadata.tags?.map((tag: any) => tag.name) || []
    
    // Extract AI-generated topic metadata
    const primaryTopic = postMetadata['topic-primary'] || 'general-technology'
    const secondaryTopics = postMetadata['topic-secondary'] || []
    const contentEntities = postMetadata['content-entities'] || []
    const relatedConcepts = postMetadata['related-concepts'] || []
    const contentComplexity = postMetadata['content-complexity'] || 'intermediate'
    const targetAudience = postMetadata['target-audience'] || ['general-tech-audience']
    
    // Combine manual tags with AI-extracted topics for keywords
    const allKeywords = [
      ...categories, 
      ...tags, 
      primaryTopic.replace('-', ' '),
      ...secondaryTopics.map((topic: string) => topic.replace('-', ' ')),
      ...relatedConcepts
    ].join(', ')
    
    // Generate enhanced topics/subjects the article covers
    const aboutTopics = [
      ...categories.map((topic: string) => ({ '@type': 'Thing', name: topic })),
      ...tags.map((topic: string) => ({ '@type': 'Thing', name: topic })),
      { '@type': 'Thing', name: primaryTopic.replace('-', ' ') },
      ...secondaryTopics.map((topic: string) => ({ '@type': 'Thing', name: topic.replace('-', ' ') }))
    ]
    
    // Generate mentions for technical entities
    const mentions = contentEntities.map((entity: string) => ({
      '@type': 'Thing',
      name: entity
    }))
    
    // Author information with enhanced details
    const authors = postMetadata.authors?.map((author: any) => ({
      '@type': 'Person',
      name: author.name,
      url: `${baseUrl}/about/professional/resume`,
      sameAs: [
        'https://linkedin.com/in/manastalukdar',
        'https://github.com/manastalukdar',
        'https://twitter.com/manastalukdar'
      ]
    })) || []
    
    // Determine content type and educational level using AI-extracted data
    const isEducational = (
      tags.some((tag: string) => 
        ['tutorial', 'guide', 'how-to', 'learn', 'learning'].includes(tag.toLowerCase())
      ) ||
      relatedConcepts.some((concept: string) =>
        ['tutorial', 'guide', 'learning', 'introduction'].includes(concept.toLowerCase())
      )
    )
    const isTechnical = (
      categories.some((cat: string) => 
        ['technology', 'programming', 'software'].includes(cat.toLowerCase())
      ) ||
      ['artificial-intelligence', 'data-engineering', 'software-architecture', 'software-development', 'cloud-computing'].includes(primaryTopic)
    )
    
    const structuredData: BlogPostStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      headline: postMetadata.title,
      description: postMetadata.meta?.description || postMetadata.excerpt,
      image: `${baseUrl}/images/android-chrome-512x512.png`,
      author: authors,
      publisher: {
        '@type': 'Organization',
        name: `${appOwner} - Personal Website`,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/android-chrome-512x512.png`,
          width: 512,
          height: 512
        },
        url: baseUrl,
        sameAs: [
          'https://linkedin.com/in/manastalukdar',
          'https://github.com/manastalukdar'
        ]
      },
      datePublished: postMetadata['first-published-on'],
      dateModified: postMetadata['last-updated-on'] || postMetadata['first-published-on'],
      articleSection: categories[0] || primaryTopic.replace('-', ' '),
      keywords: allKeywords,
      about: aboutTopics,
      mentions: mentions.length > 0 ? mentions : undefined,
      genre: primaryTopic.replace('-', ' '),
      wordCount: readingStats.wordCount,
      timeRequired: `PT${readingStats.readingTimeMinutes}M`,
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
      copyrightYear: new Date(postMetadata['first-published-on']).getFullYear(),
      copyrightHolder: {
        '@type': 'Person',
        name: appOwner
      }
    }
    
    // Add educational metadata using AI-extracted complexity and audience data
    if (isEducational || contentComplexity !== 'beginner') {
      // Map AI-extracted complexity to schema.org educational levels
      const complexityMapping: Record<string, string> = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced',
        'expert': 'Professional'
      }
      
      structuredData.educationalLevel = complexityMapping[contentComplexity] || 'Intermediate'
      structuredData.learningResourceType = 'Article'
      
      // Use AI-extracted related concepts and manual tags for teaching topics
      const teachingTopics = [
        ...tags.filter((tag: string) => 
          !['blog', 'post', 'article'].includes(tag.toLowerCase())
        ),
        ...relatedConcepts.filter((concept: string) => 
          concept.length > 3 && !['blog', 'post', 'article'].includes(concept.toLowerCase())
        )
      ].slice(0, 10) // Limit to 10 teaching topics
      
      if (teachingTopics.length > 0) {
        structuredData.teaches = teachingTopics
      }
    }
    
    return structuredData
  }

  /**
   * Generate enhanced breadcrumb structured data
   */
  const generateBreadcrumbStructuredData = (
    breadcrumbsData: Array<{ title: string; href: string }>
  ): BreadcrumbStructuredData => {
    const itemListElement = breadcrumbsData.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      item: {
        '@type': 'WebPage' as const,
        '@id': `${baseUrl}${item.href}`,
        name: item.title,
      },
    }))

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    }
  }

  /**
   * Generate Person structured data for about pages
   */
  const generatePersonStructuredData = (
    name: string,
    jobTitle: string,
    description: string,
    skills: string[] = []
  ): PersonStructuredData => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name,
      url: baseUrl,
      sameAs: [
        'https://linkedin.com/in/manastalukdar',
        'https://github.com/manastalukdar',
        'https://twitter.com/manastalukdar'
      ],
      jobTitle,
      worksFor: {
        '@type': 'Organization',
        name: 'Enterprise AI Leadership'
      },
      knowsAbout: skills.length > 0 ? skills : [
        'Artificial Intelligence',
        'Machine Learning',
        'Data Engineering',
        'Software Architecture',
        'Enterprise AI',
        'Technology Leadership'
      ],
      description
    }
  }

  /**
   * Generate Organization structured data
   */
  const generateOrganizationStructuredData = (
    name: string,
    description: string
  ): OrganizationStructuredData => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/android-chrome-512x512.png`,
        width: 512,
        height: 512
      },
      sameAs: [
        'https://linkedin.com/in/manastalukdar',
        'https://github.com/manastalukdar'
      ],
      founder: {
        '@type': 'Person',
        name: 'Manas Talukdar'
      },
      description,
      knowsAbout: [
        'Enterprise AI',
        'Data Infrastructure', 
        'Machine Learning',
        'Software Engineering',
        'Technology Leadership'
      ]
    }
  }

  /**
   * Generate WebSite structured data for homepage
   */
  const generateWebSiteStructuredData = (
    name: string,
    description: string,
    hasSearchAction: boolean = false
  ): WebSiteStructuredData => {
    const structuredData: WebSiteStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name,
      url: baseUrl,
      description,
      license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
      copyrightYear: new Date().getFullYear(),
      copyrightHolder: {
        '@type': 'Person',
        name: 'Manas Talukdar'
      },
      publisher: {
        '@type': 'Person',
        name: 'Manas Talukdar'
      },
      mainEntity: {
        '@type': 'Person',
        name: 'Manas Talukdar'
      }
    }

    if (hasSearchAction) {
      structuredData.potentialAction = {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }

    return structuredData
  }

  return {
    generateBlogPostStructuredData,
    generateBreadcrumbStructuredData,
    generatePersonStructuredData,
    generateOrganizationStructuredData,
    generateWebSiteStructuredData,
  }
}