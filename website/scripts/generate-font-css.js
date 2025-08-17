#!/usr/bin/env node

/**
 * Automatically generate fonts.css from centralized font configuration
 * Run this script whenever font configuration changes
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Import font configuration
const fontConfigPath = join(__dirname, '../app/config/fonts.ts')
const fontsOutputPath = join(__dirname, '../public/fonts/fonts.css')

async function generateFontCSS() {
  try {
    // Dynamically import the font configuration
    const { generateFontFaceCSS } = await import('../app/config/fonts.ts')
    
    // Generate CSS content
    const cssContent = generateFontFaceCSS()
    
    // Write to fonts.css file
    writeFileSync(fontsOutputPath, cssContent, 'utf8')
    
    console.log('✅ Font CSS generated successfully:', fontsOutputPath)
    console.log('📄 Generated content preview:')
    console.log(cssContent.split('\n').slice(0, 10).join('\n') + '...')
    
  } catch (error) {
    console.error('❌ Error generating font CSS:', error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateFontCSS()
}

export { generateFontCSS }