#!/usr/bin/env node

/**
 * Automatically generate _fonts.scss from centralized font configuration
 * Run this script whenever font configuration changes
 */

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Output path for generated SCSS
const scssOutputPath = join(__dirname, '../app/style/_fonts.scss')

async function generateFontSCSS() {
  try {
    // Dynamically import the font configuration
    const { generateSCSSVariables } = await import('../app/config/fonts.ts')
    
    // Generate SCSS content
    const scssContent = generateSCSSVariables()
    
    // Write to _fonts.scss file
    writeFileSync(scssOutputPath, scssContent, 'utf8')
    
    console.log('✅ Font SCSS generated successfully:', scssOutputPath)
    console.log('📄 Generated content preview:')
    console.log(scssContent.split('\n').slice(0, 10).join('\n') + '...')
    
  } catch (error) {
    console.error('❌ Error generating font SCSS:', error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateFontSCSS()
}

export { generateFontSCSS }