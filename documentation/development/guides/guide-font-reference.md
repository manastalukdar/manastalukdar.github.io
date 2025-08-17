# Font Reference - Quick Guide

Quick reference for the current font setup and centralized font management system.

## 📊 Current Font Configuration

**Primary Font**: Roboto  
**Hosting**: Self-hosted (performance optimized)  
**Total Size**: ~33KB (vs 1MB+ from Google Fonts CDN)  
**Format**: WOFF2 (optimal compression)  
**System**: Centralized configuration (single source of truth)

## 🎯 Centralized System Overview

**Configuration File**: `app/config/fonts.ts` (SINGLE SOURCE OF TRUTH)
```typescript
export const FONT_CONFIG: FontConfig = {
  primaryFont: 'Roboto',
  fontStack: "'Roboto', 'Helvetica Neue', 'Segoe UI', 'sans-serif'",
  weights: [
    { weight: 400, fileName: 'roboto-v30-latin-regular.woff2', displayName: 'Regular' },
    { weight: 500, fileName: 'roboto-v30-latin-500.woff2', displayName: 'Medium' },
    { weight: 700, fileName: 'roboto-v30-latin-700.woff2', displayName: 'Bold' }
  ]
}
```

## 📁 File Locations

### Font Configuration
- **Main Config**: `website/app/config/fonts.ts` ← Edit this to change fonts
- **Auto-generated SCSS**: `website/app/style/_fonts.scss`
- **Auto-generated CSS**: `website/public/fonts/fonts.css`

### Font Files
```
website/public/fonts/
├── roboto-v30-latin-regular.woff2  (11.028 KB)
├── roboto-v30-latin-500.woff2      (11.072 KB)
└── roboto-v30-latin-700.woff2      (11.040 KB)
```

### Build Scripts
- **CSS Generator**: `website/scripts/generate-font-css.js`
- **SCSS Generator**: `website/scripts/generate-font-scss.js`

## ⚡ Quick Commands

### Font Management
```bash
# Change fonts (after editing app/config/fonts.ts)
npm run generate-fonts

# Manual generation
node scripts/generate-font-css.js      # → public/fonts/fonts.css
node scripts/generate-font-scss.js     # → app/style/_fonts.scss

# Build and test
npm run build
```

### Development
```bash
cd website
npm run dev                           # Start dev server
npm run build                         # Production build
npm run generate-fonts               # Regenerate font files
```

## 🛠️ Usage in Code

### SCSS Components
```scss
@use '../_fonts.scss' as fonts;

.my-text {
  @include fonts.primary-font();       // Default (400)
  @include fonts.primary-font(500);    // Medium weight
  @include fonts.font-bold();          // Bold (700)
}
```

### Vue Components
```vue
<style scoped lang="scss">
@use '~/style/_fonts.scss' as fonts;
.heading { @include fonts.font-bold(); }
</style>
```

### CSS Custom Properties
```css
.element {
  font-family: var(--font-stack);
  font-weight: var(--font-weight-medium);
}
```

### Utility Classes
```html
<div class="font-primary">Text with primary font</div>
<div class="font-bold">Bold text</div>
```

## 🔧 Font Change Process

### To Change Primary Font (e.g., Roboto → Inter):

1. **Edit Configuration** (`app/config/fonts.ts`):
   ```typescript
   primaryFont: 'Inter',
   fontStack: "'Inter', 'Helvetica Neue', 'sans-serif'",
   // Update file names: roboto-* → inter-*
   ```

2. **Add Font Files** to `public/fonts/`:
   - `inter-v13-latin-regular.woff2`
   - `inter-v13-latin-500.woff2` 
   - `inter-v13-latin-700.woff2`

3. **Generate & Build**:
   ```bash
   npm run generate-fonts
   npm run build
   ```

**Result**: Entire website uses new font! 🎉

## 📋 Current Font Specifications

### Roboto Details
- **Family**: Roboto
- **Weights**: 400 (Regular), 500 (Medium), 700 (Bold)  
- **Format**: WOFF2 (optimal compression)
- **Unicode**: Latin character set optimized
- **Performance**: `font-display: swap` (prevents FOIT)
- **Preloading**: Automatic via Nuxt configuration

### Performance Metrics
- **Font Loading**: Non-blocking with `font-display: swap`
- **File Size**: 33KB total (99% smaller than Google Fonts)
- **Requests**: 0 external (self-hosted)
- **Caching**: Browser cache friendly

## 🚨 Troubleshooting

### Common Issues
```bash
# Fonts not showing
npm run generate-fonts                # Regenerate files
npm run build                        # Clear cache and rebuild

# Build errors
# Check app/config/fonts.ts for syntax errors
# Verify font files exist in public/fonts/

# Performance issues  
# Reduce font weights to essential ones only
# Check fontDisplay setting in configuration
```

### Verification Checklist
- ✅ Font files exist in `public/fonts/`
- ✅ Configuration file has no TypeScript errors
- ✅ Auto-generated files updated (`_fonts.scss`, `fonts.css`)
- ✅ Build completes successfully
- ✅ Browser shows new fonts (clear cache)

## 🔗 Related Documentation

- **Comprehensive Guide**: `guide-font-management.md` 
- **Technical Details**: `font-centralization-technical.md`
- **Icon Management**: `icon-management.md`

## 🏗️ Architecture Benefits

### Before Centralization
❌ Update 11+ files manually  
❌ Risk of missed references  
❌ Inconsistent font usage  
❌ Time-consuming font changes  

### After Centralization  
✅ Update 1 configuration file only  
✅ Auto-generated consistency  
✅ Type-safe configuration  
✅ 4-step font change process  

---

**Key Takeaway**: Edit `app/config/fonts.ts` → Run `npm run generate-fonts` → Build. That's it! 🚀