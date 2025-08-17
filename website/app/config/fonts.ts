/**
 * Centralized Font Configuration
 * Single source of truth for all font-related settings
 */

export interface FontWeight {
  weight: number
  fileName: string
  displayName: string
}

export interface FontConfig {
  /** Primary font family name */
  primaryFont: string
  /** Complete font stack with fallbacks */
  fontStack: string
  /** Font weights available */
  weights: FontWeight[]
  /** Font display strategy for performance */
  fontDisplay: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  /** Unicode range for font optimization */
  unicodeRange: string
  /** Base path for font files */
  basePath: string
}

/**
 * Current website font configuration
 * Update this object to change fonts site-wide
 */
export const FONT_CONFIG: FontConfig = {
  primaryFont: 'Roboto',
  fontStack: "'Roboto', 'Helvetica Neue', 'Segoe UI', 'sans-serif'",
  weights: [
    {
      weight: 400,
      fileName: 'roboto-v30-latin-regular.woff2',
      displayName: 'Regular'
    },
    {
      weight: 500,
      fileName: 'roboto-v30-latin-500.woff2',
      displayName: 'Medium'
    },
    {
      weight: 700,
      fileName: 'roboto-v30-latin-700.woff2',
      displayName: 'Bold'
    }
  ],
  fontDisplay: 'swap',
  unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  basePath: '/fonts'
}

/**
 * Generate font preload links for Nuxt configuration
 */
export function generateFontPreloads(): Array<{
  rel: 'preload'
  href: string
  as: 'font'
  type: 'font/woff2'
  crossorigin: 'anonymous'
}> {
  return FONT_CONFIG.weights.map(weight => ({
    rel: 'preload' as const,
    href: `${FONT_CONFIG.basePath}/${weight.fileName}`,
    as: 'font' as const,
    type: 'font/woff2' as const,
    crossorigin: 'anonymous' as const
  }))
}

/**
 * Generate CSS font-face declarations
 */
export function generateFontFaceCSS(): string {
  const fontFaces = FONT_CONFIG.weights.map(weight => `
/* ${FONT_CONFIG.primaryFont} ${weight.displayName} (${weight.weight}) */
@font-face {
  font-family: '${FONT_CONFIG.primaryFont}';
  font-style: normal;
  font-weight: ${weight.weight};
  font-display: ${FONT_CONFIG.fontDisplay};
  src: url('./${weight.fileName}') format('woff2');
  unicode-range: ${FONT_CONFIG.unicodeRange};
}`).join('\n')

  return `/* ${FONT_CONFIG.primaryFont} Font Family - Self-hosted with performance optimizations */
${fontFaces}`
}

/**
 * Generate SCSS variables for font configuration
 */
export function generateSCSSVariables(): string {
  return `// Auto-generated from font configuration
$primary-font: '${FONT_CONFIG.primaryFont}';
$font-stack: ${FONT_CONFIG.fontStack};
$font-weights: (
${FONT_CONFIG.weights.map(w => `  ${w.displayName.toLowerCase()}: ${w.weight}`).join(',\n')}
);

// Font mixins
@mixin primary-font($weight: 400) {
  font-family: $font-stack;
  font-weight: $weight;
}

@mixin font-regular {
  @include primary-font(400);
}

@mixin font-medium {
  @include primary-font(500);
}

@mixin font-bold {
  @include primary-font(700);
}`
}

/**
 * Get Vuetify font configuration
 */
export function getVuetifyFontConfig() {
  return {
    'body-font-family': FONT_CONFIG.fontStack,
    'button-font-weight': 400 // Normal weight for better readability
  }
}