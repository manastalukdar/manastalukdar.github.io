/**
 * Topic extraction utilities for dynamic content analysis
 * Implements TF-IDF and NER-based topic extraction for blog posts
 */

// Import shared configuration data
import topicExtractionConfig from '../../config/topic-extraction-data.json'

interface TopicExtractionResult {
  primaryTopic: string
  secondaryTopics: string[]
  contentEntities: string[]
  topicConfidence: number
  relatedConcepts: string[]
  contentComplexity: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  targetAudience: string[]
}

interface KeywordScore {
  term: string
  score: number
  category: string
}

/**
 * Topic categories and their associated keywords - loaded from shared config
 */
const TOPIC_CATEGORIES = topicExtractionConfig.topicCategories

/**
 * Technical entities and concepts for named entity recognition - loaded from shared config
 */
const TECHNICAL_ENTITIES = topicExtractionConfig.technicalEntities

/**
 * Stop words to filter out from analysis - loaded from shared config
 */
const STOP_WORDS = new Set(topicExtractionConfig.stopWords)

/**
 * Clean and normalize text content for analysis
 */
export function cleanContent(content: string): string {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Convert links to text
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .toLowerCase()
    .trim()
}

/**
 * Extract keywords using simple TF calculation
 */
export function extractKeywords(content: string, maxKeywords: number = 20): KeywordScore[] {
  const words = cleanContent(content)
    .split(/\s+/)
    .filter(word => 
      word.length > 2 && 
      !STOP_WORDS.has(word) &&
      /^[a-z0-9-]+$/.test(word)
    )

  const wordFreq = new Map<string, number>()
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
  })

  // Calculate TF scores and categorize
  const keywords: KeywordScore[] = []
  for (const [term, freq] of wordFreq.entries()) {
    if (freq >= 2) { // Only consider words that appear at least twice
      const tf = freq / words.length
      const category = categorizeKeyword(term)
      keywords.push({
        term,
        score: tf,
        category
      })
    }
  }

  return keywords
    .sort((a, b) => b.score - a.score)
    .slice(0, maxKeywords)
}

/**
 * Categorize a keyword based on predefined topic categories
 */
function categorizeKeyword(keyword: string): string {
  for (const [category, terms] of Object.entries(TOPIC_CATEGORIES)) {
    if (terms.some(term => 
      keyword.includes(term.toLowerCase()) || 
      term.toLowerCase().includes(keyword)
    )) {
      return category
    }
  }
  return 'general'
}

/**
 * Extract named entities from content
 */
export function extractEntities(content: string): string[] {
  const entities = new Set<string>()
  const normalizedContent = content.toLowerCase()

  // Extract technical entities
  Object.values(TECHNICAL_ENTITIES).flat().forEach(entity => {
    const entityLower = entity.toLowerCase()
    if (normalizedContent.includes(entityLower)) {
      entities.add(entity)
    }
  })

  // Extract capitalized terms (potential proper nouns)
  const properNouns = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []
  properNouns.forEach(noun => {
    if (noun.length > 3 && !STOP_WORDS.has(noun.toLowerCase())) {
      entities.add(noun)
    }
  })

  return Array.from(entities).slice(0, 15) // Limit to top 15 entities
}

/**
 * Determine content complexity based on various factors
 */
export function assessContentComplexity(
  content: string,
  keywords: KeywordScore[]
): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  const wordCount = content.split(/\s+/).length
  const technicalTerms = keywords.filter(k => k.category !== 'general').length
  const avgWordsPerSentence = wordCount / (content.split(/[.!?]+/).length || 1)

  // Calculate complexity score
  let complexityScore = 0

  // Word count factor
  if (wordCount > 2000) complexityScore += 2
  else if (wordCount > 1000) complexityScore += 1

  // Technical terms factor
  if (technicalTerms > 15) complexityScore += 3
  else if (technicalTerms > 10) complexityScore += 2
  else if (technicalTerms > 5) complexityScore += 1

  // Sentence complexity factor
  if (avgWordsPerSentence > 25) complexityScore += 2
  else if (avgWordsPerSentence > 20) complexityScore += 1

  // Advanced technical categories
  const advancedCategories = ['artificial-intelligence', 'software-architecture', 'data-engineering']
  const hasAdvancedTopics = keywords.some(k => advancedCategories.includes(k.category))
  if (hasAdvancedTopics) complexityScore += 1

  // Return complexity level
  if (complexityScore >= 6) return 'expert'
  if (complexityScore >= 4) return 'advanced'
  if (complexityScore >= 2) return 'intermediate'
  return 'beginner'
}

/**
 * Determine target audience based on content analysis
 */
export function identifyTargetAudience(
  keywords: KeywordScore[],
  complexity: string
): string[] {
  const audiences = new Set<string>()

  // Category-based audience mapping
  const categoryAudienceMap: Record<string, string[]> = {
    'artificial-intelligence': ['data-scientists', 'ml-engineers', 'researchers'],
    'data-engineering': ['data-engineers', 'software-engineers', 'architects'],
    'software-architecture': ['architects', 'senior-engineers', 'technical-leads'],
    'leadership-management': ['engineering-managers', 'technical-leads', 'executives'],
    'software-development': ['software-engineers', 'developers'],
    'data-science': ['data-scientists', 'analysts', 'researchers'],
    'cloud-computing': ['devops-engineers', 'cloud-architects', 'software-engineers']
  }

  keywords.forEach(keyword => {
    const categoryAudiences = categoryAudienceMap[keyword.category] || []
    categoryAudiences.forEach(audience => audiences.add(audience))
  })

  // Complexity-based audience
  if (complexity === 'expert' || complexity === 'advanced') {
    audiences.add('senior-professionals')
  }
  if (complexity === 'beginner') {
    audiences.add('students')
    audiences.add('career-changers')
  }

  // Default audiences
  if (audiences.size === 0) {
    audiences.add('general-tech-audience')
  }

  return Array.from(audiences).slice(0, 5)
}

/**
 * Main topic extraction function
 */
export function extractTopics(content: string, title: string = ''): TopicExtractionResult {
  // Combine title and content for analysis, giving title more weight
  const analysisText = `${title} ${title} ${content}`
  
  // Extract keywords
  const keywords = extractKeywords(analysisText)
  
  // Extract entities
  const entities = extractEntities(content)
  
  // Determine primary topic (highest scoring category)
  const categoryScores = new Map<string, number>()
  keywords.forEach(keyword => {
    if (keyword.category !== 'general') {
      const current = categoryScores.get(keyword.category) || 0
      categoryScores.set(keyword.category, current + keyword.score)
    }
  })
  
  const sortedCategories = Array.from(categoryScores.entries())
    .sort(([,a], [,b]) => b - a)
  
  const primaryTopic = sortedCategories[0]?.[0] || 'general-technology'
  const secondaryTopics = sortedCategories
    .slice(1, 4)
    .map(([category]) => category)
  
  // Assess complexity
  const complexity = assessContentComplexity(content, keywords)
  
  // Identify target audience
  const targetAudience = identifyTargetAudience(keywords, complexity)
  
  // Calculate confidence score
  const totalKeywords = keywords.length
  const categorizedKeywords = keywords.filter(k => k.category !== 'general').length
  const confidence = totalKeywords > 0 ? (categorizedKeywords / totalKeywords) : 0
  
  // Extract related concepts (high-scoring keywords)
  const relatedConcepts = keywords
    .slice(0, 8)
    .map(k => k.term)
  
  return {
    primaryTopic,
    secondaryTopics,
    contentEntities: entities,
    topicConfidence: Math.round(confidence * 100) / 100,
    relatedConcepts,
    contentComplexity: complexity,
    targetAudience
  }
}

/**
 * Async version of extractTopics that ensures dynamic topics are loaded
 */
export async function extractTopicsAsync(content: string, title: string = ''): Promise<TopicExtractionResult> {
  // Ensure dynamic topics are loaded
  if (!DISCOVERED_TOPICS) {
    DISCOVERED_TOPICS = await loadDiscoveredTopics()
  }
  
  return extractTopics(content, title)
}