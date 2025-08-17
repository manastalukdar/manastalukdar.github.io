# Font Management Guide

This guide explains how to manage fonts in the website using the centralized font management system.

## 🎯 Overview

**Current Font Setup (August 2025):**
- ✅ **Primary Font**: Roboto (400, 500, 700 weights)
- ✅ **Self-hosted**: ~33KB total vs 1MB+ from Google Fonts CDN
- ✅ **Performance Optimized**: `font-display: swap`, preload links, WOFF2 format
- ✅ **Centralized System**: Single configuration file controls entire website

## Architecture

The website uses a centralized font management system that allows you to change fonts across the entire website by updating a single configuration file. This eliminates the need to update font references in multiple locations.

### Files Structure

```
website/
├── app/config/fonts.ts              # 🎯 SINGLE SOURCE OF TRUTH
├── app/style/_fonts.scss            # Auto-generated SCSS utilities  
├── app/style/settings.scss          # Uses centralized config
├── public/fonts/fonts.css           # Auto-generated font CSS
├── scripts/generate-font-css.js     # CSS generation script
├── scripts/generate-font-scss.js    # SCSS generation script
└── nuxt.config.ts                   # Uses centralized config
```

### Key Components

1. **Font Configuration** (`app/config/fonts.ts`)
   - Primary font family and fallbacks
   - Font weights and file names
   - Font display strategy
   - Unicode range for optimization

2. **Auto-generated Files**
   - `app/style/_fonts.scss` - SCSS variables and mixins
   - `public/fonts/fonts.css` - Font-face declarations

3. **Build Integration**
   - Font preloading in Nuxt configuration
   - Vuetify font settings
   - Component style utilities

## How to Change Fonts

### 1. Primary Font Change (e.g., Roboto → Inter)

**Step 1**: Update the font configuration in `app/config/fonts.ts`:

```typescript
export const FONT_CONFIG: FontConfig = {
  primaryFont: 'Inter',                                           // ✏️ Change this
  fontStack: "'Inter', 'Helvetica Neue', 'Segoe UI', 'sans-serif'", // ✏️ Change this
  weights: [
    {
      weight: 400,
      fileName: 'inter-v13-latin-regular.woff2',                 // ✏️ Change this
      displayName: 'Regular'
    },
    {
      weight: 500,
      fileName: 'inter-v13-latin-500.woff2',                     // ✏️ Change this  
      displayName: 'Medium'
    },
    {
      weight: 700,
      fileName: 'inter-v13-latin-700.woff2',                     // ✏️ Change this
      displayName: 'Bold'
    }
  ],
  // ... other settings remain the same
}
```

**Step 2**: Add new font files to `public/fonts/`:
```bash
# Download Inter WOFF2 files to public/fonts/
├── public/fonts/
    ├── inter-v13-latin-regular.woff2
    ├── inter-v13-latin-500.woff2
    └── inter-v13-latin-700.woff2
```

**Step 3**: Regenerate auto-generated files:
```bash
# Generate new font CSS and SCSS
npm run generate-fonts

# Or manually:
node scripts/generate-font-css.js
node scripts/generate-font-scss.js
```

**Step 4**: Test the build:
```bash
npm run build
```

**That's it!** 🎉 The entire website now uses Inter font.

### 2. Add New Font Weight

To add a new font weight (e.g., Extra Bold 800):

```typescript
// In app/config/fonts.ts
weights: [
  // ... existing weights
  {
    weight: 800,
    fileName: 'roboto-v30-latin-800.woff2',
    displayName: 'Extra Bold'
  }
]
```

Then regenerate files and rebuild.

### 3. Change Font Display Strategy

```typescript
// In app/config/fonts.ts
fontDisplay: 'swap', // or 'auto', 'block', 'fallback', 'optional'
```

### 4. Update Fallback Fonts

```typescript
// In app/config/fonts.ts
fontStack: "'Roboto', 'System-UI', 'Arial', 'sans-serif'",
```

## Using Font Utilities in Components

### SCSS Components

```scss
// Import the font utilities
@use '../_fonts.scss' as fonts;

.my-component {
  @include fonts.primary-font();      // Uses default weight (400)
  @include fonts.primary-font(500);   // Uses specific weight
  @include fonts.font-medium();       // Uses predefined medium weight
  @include fonts.font-bold();         // Uses predefined bold weight
}
```

### Vue Components

```vue
<style scoped lang="scss">
@use '~/style/_fonts.scss' as fonts;

.my-text {
  @include fonts.font-regular();
}

.my-heading {
  @include fonts.font-bold();
}
</style>
```

### CSS Custom Properties

```css
.my-element {
  font-family: var(--font-stack);
  font-weight: var(--font-weight-medium);
}
```

### Utility Classes

```vue
<template>
  <div class="font-primary">Primary font</div>
  <div class="font-medium">Medium weight</div>
  <div class="font-bold">Bold text</div>
</template>
```

## Automation Scripts

### Package.json Scripts

Current scripts available:

```json
{
  "scripts": {
    "generate-fonts": "node scripts/generate-font-css.js && node scripts/generate-font-scss.js"
  }
}
```

### Font Generation Commands

```bash
# Regenerate font files after configuration changes
npm run generate-fonts

# Manual generation
node scripts/generate-font-css.js      # Generates public/fonts/fonts.css
node scripts/generate-font-scss.js     # Generates app/style/_fonts.scss
```

## Font Performance Best Practices

### 1. Font Loading Strategy

```typescript
// Current configuration uses font-display: swap
fontDisplay: 'swap', // Prevents invisible text during font load
```

### 2. Font Preloading

```typescript
// Auto-generated in nuxt.config.ts
link: [
  ...generateFontPreloads() // Preloads all font files
]
```

### 3. Font Subsetting

Unicode range is configured for Latin characters:
```typescript
unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, ...'
```

### 4. File Formats

Uses WOFF2 format for maximum compression and browser support.

## Troubleshooting

### Fonts Not Loading

1. **Check file paths**: Ensure font files exist in `public/fonts/`
2. **Regenerate files**: Run `npm run generate-fonts`
3. **Clear cache**: Clear browser cache and rebuild
4. **Check console**: Look for 404 errors for font files

### Build Errors

1. **TypeScript errors**: Ensure font config types are correct
2. **SCSS errors**: Check that `_fonts.scss` was regenerated
3. **Missing files**: Verify all font files are present

### Performance Issues

1. **Too many fonts**: Limit to essential weights only
2. **Large files**: Consider font subsetting tools
3. **Loading strategy**: Adjust `fontDisplay` setting

## Migration from Old System

The centralized system replaces the old method of updating fonts in multiple locations.

### Old vs New Approach

**Before (Multiple Updates Required):**
- Update `app/style/settings.scss`
- Update `app/style/components/testimonials.scss`  
- Update component Vue files
- Update `public/fonts/fonts.css`
- Update `nuxt.config.ts`

**Now (Single Update):**
- Update `app/config/fonts.ts` only
- Run `npm run generate-fonts`
- Run `npm run build`

### Finding Old Font References

```bash
# Find hardcoded font references (if any remain)
grep -r "font-family.*Roboto" app/

# Replace with SCSS mixins
# OLD: font-family: 'Roboto', 'Helvetica Neue', 'sans-serif';
# NEW: @include fonts.primary-font();
```

## Advanced Configuration

### Custom Font Weights

```typescript
// Define custom weight mapping
weights: [
  { weight: 100, fileName: 'font-thin.woff2', displayName: 'Thin' },
  { weight: 200, fileName: 'font-extra-light.woff2', displayName: 'Extra Light' },
  { weight: 300, fileName: 'font-light.woff2', displayName: 'Light' },
  // ... etc
]
```

### Multiple Font Families

For multiple fonts (e.g., display vs body), extend the configuration:

```typescript
export const DISPLAY_FONT_CONFIG: FontConfig = {
  primaryFont: 'Playfair Display',
  fontStack: "'Playfair Display', 'Georgia', 'serif'",
  // ... config for display font
}

export const BODY_FONT_CONFIG: FontConfig = {
  primaryFont: 'Inter',
  fontStack: "'Inter', 'Helvetica Neue', 'sans-serif'", 
  // ... config for body font
}
```

## Current Font Specifications

### Roboto Font Details

**Font Family**: Roboto  
**Hosting**: Self-hosted (performance optimized)  
**Total Size**: ~33KB (vs 1MB+ from Google Fonts CDN)  
**Format**: WOFF2 (optimal compression)  
**Performance**: `font-display: swap` (prevents FOIT)

**Available Weights**:
- **400 (Regular)**: `roboto-v30-latin-regular.woff2` (11.028 KB)
- **500 (Medium)**: `roboto-v30-latin-500.woff2` (11.072 KB)  
- **700 (Bold)**: `roboto-v30-latin-700.woff2` (11.040 KB)

**Font Stack**: `'Roboto', 'Helvetica Neue', 'Segoe UI', 'sans-serif'`

## Support

For questions about the font management system:
1. Check this documentation
2. Review the `app/config/fonts.ts` configuration
3. Test changes in development before production
4. Verify build passes after font changes

---

**Remember**: The font configuration in `app/config/fonts.ts` is the single source of truth. All other font references are auto-generated from this configuration.