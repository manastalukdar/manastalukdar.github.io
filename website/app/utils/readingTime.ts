/**
 * Calculate reading time for text content
 * Based on average reading speed of 200-250 words per minute
 */

interface ReadingTimeResult {
  minutes: number
  words: number
  text: string
}

export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 225
): ReadingTimeResult {
  // Remove HTML tags and markdown formatting
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Convert markdown links to just text
    .replace(/\*\*([^*]*)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*([^*]*)\*/g, '$1') // Remove italic markdown
    .replace(/`([^`]*)`/g, '$1') // Remove inline code markdown
    .replace(/#+\s/g, '') // Remove markdown headers
    .replace(/>\s/g, '') // Remove markdown blockquotes
    .replace(/[-*+]\s/g, '') // Remove list markers
    .replace(/\d+\.\s/g, '') // Remove numbered list markers
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()

  // Count words (split by whitespace and filter out empty strings)
  const words = plainText.split(/\s+/).filter(word => word.length > 0).length

  // Calculate reading time in minutes
  const minutes = Math.ceil(words / wordsPerMinute)

  // Generate human-readable text
  const text = minutes === 1 ? '1 min read' : `${minutes} min read`

  return {
    minutes,
    words,
    text
  }
}

/**
 * Calculate reading time from markdown content including frontmatter
 */
export function calculateReadingTimeFromMarkdown(
  markdownContent: string,
  wordsPerMinute: number = 225
): ReadingTimeResult {
  // Remove YAML frontmatter
  const contentWithoutFrontmatter = markdownContent.replace(/^---\n[\s\S]*?\n---\n/, '')
  
  return calculateReadingTime(contentWithoutFrontmatter, wordsPerMinute)
}

/**
 * Get reading time for a blog post from file system
 */
export async function getReadingTimeForPost(
  postPath: string,
  wordsPerMinute: number = 225
): Promise<ReadingTimeResult> {
  try {
    const fs = await import('fs')
    const path = await import('path')
    
    // Construct full path to the blog post (ensure we're in the website directory)
    const websiteRoot = path.resolve(process.cwd(), 'website')
    const fullPath = path.join(websiteRoot, 'public', 'blogdata', postPath)
    
    // Read the markdown file
    const content = fs.readFileSync(fullPath, 'utf-8')
    
    return calculateReadingTimeFromMarkdown(content, wordsPerMinute)
  } catch (error) {
    console.warn(`Could not calculate reading time for ${postPath}:`, error)
    // Return default values if unable to read file
    return {
      minutes: 1,
      words: 0,
      text: '1 min read'
    }
  }
}

/**
 * Format reading time with additional context
 */
export function formatReadingTime(result: ReadingTimeResult): string {
  const { minutes, words } = result
  
  if (minutes < 1) {
    return 'Less than 1 min read'
  }
  
  if (minutes === 1) {
    return '1 min read'
  }
  
  if (minutes < 5) {
    return `${minutes} min read`
  }
  
  // For longer articles, add word count for context
  return `${minutes} min read (${words.toLocaleString()} words)`
}