import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Read the generated RSS feed from the public directory
    const feedPath = join(process.cwd(), 'public', 'blogfeed.xml')
    const feedContent = readFileSync(feedPath, 'utf-8')
    
    // Set appropriate headers for XML content
    setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    
    return feedContent
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load RSS feed'
    })
  }
})