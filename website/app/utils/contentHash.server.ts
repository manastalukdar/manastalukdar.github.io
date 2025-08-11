import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

/**
 * Generate a content hash for PWA versioning based on key files
 * Server-side only - uses Node.js modules
 */
export function generateContentHash(): string {
  const filesToHash = [
    'nuxt.config.ts',
    'package.json',
    'app/pages/index.vue',
    'app/stores/BlogMetadata.ts',
    'app/components/home-page/about-blurb.vue',
    'app/components/home-page/recent-updates.vue',
    'app/components/home-page/featured.vue',
    'public/blogdata/metadata/blog_metadata.json'
  ]

  const hasher = crypto.createHash('sha256')
  
  filesToHash.forEach(filePath => {
    try {
      const fullPath = path.resolve(process.cwd(), filePath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8')
        hasher.update(content)
      }
    } catch (error) {
      console.log(`Warning: Could not hash file ${filePath}:`, error)
    }
  })

  // Add current timestamp for build-time differentiation
  hasher.update(Date.now().toString())
  
  return hasher.digest('hex').substring(0, 8)
}