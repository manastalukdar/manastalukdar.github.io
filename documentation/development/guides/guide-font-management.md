# Font Management Guide

This guide provides step-by-step instructions for adding new fonts or changing the current font on the website. The site uses self-hosted fonts for optimal performance and privacy.

## 🎯 Overview

**Current Font Setup (August 2025):**
- ✅ **Primary Font**: Maven Pro (400, 500, 700 weights)
- ✅ **Self-hosted**: ~5KB total vs 1MB+ from Google Fonts CDN
- ✅ **Performance Optimized**: `font-display: swap`, preload links, WOFF2 format
- ✅ **Privacy Compliant**: No external CDN tracking

**Goal**: Maintain optimal font loading performance while providing flexibility for font changes.

## 🏗️ Current Architecture

### Font Loading Strategy

**Self-Hosted Fonts** (preferred)
```css
/* website/public/fonts/fonts.css */
@font-face {
  font-family: 'Maven Pro';
  font-display: swap;
  src: url('./maven-pro-v32-latin-regular.woff2') format('woff2');
}
```

**Configuration**
```typescript
// nuxt.config.ts
app: {
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: '/fonts/fonts.css'
      },
      {
        rel: 'preload',
        href: '/fonts/maven-pro-v32-latin-regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous'
      }
    ]
  }
}
```

**SCSS Variables**
```scss
// website/app/style/settings.scss
$body-font-family: 'Maven Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

## 📋 Step-by-Step: Adding a New Font

### Step 1: Obtain Font Files

**Option A: Download from Google Fonts (Recommended)**

1. Go to [Google Fonts](https://fonts.google.com/)
2. Select your desired font
3. Choose required weights (e.g., 400, 500, 700)
4. Click "Download family"

**Option B: Use Google Webfonts Helper (Preferred)**

1. Visit [Google Webfonts Helper](https://gwfh.mranftl.com/fonts)
2. Search for your font
3. Select character sets (usually "latin")
4. Choose styles and weights needed
5. Copy the CSS and download font files

**Example for adding "Inter" font:**
```bash
# Download Inter font files
curl -o inter-v13-latin-regular.woff2 "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
curl -o inter-v13-latin-500.woff2 "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2"
curl -o inter-v13-latin-700.woff2 "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZ9hiA.woff2"
```

### Step 2: Optimize Font Files

**Check current font sizes:**
```bash
# List current font files
ls -la website/public/fonts/
```

**Optimize new fonts (if needed):**
```bash
# Install font optimization tools (optional)
npm install -g fonttools
pip install fonttools

# Subset fonts to reduce size (if needed)
pyftsubset font.ttf --unicodes="U+0020-007F" --output-file=font-subset.woff2
```

### Step 3: Add Font Files to Project

**Create font directory structure:**
```bash
# Ensure fonts directory exists
mkdir -p website/public/fonts

# Copy font files
cp /path/to/inter-v13-latin-regular.woff2 website/public/fonts/
cp /path/to/inter-v13-latin-500.woff2 website/public/fonts/
cp /path/to/inter-v13-latin-700.woff2 website/public/fonts/
```

**Verify font files:**
```bash
# Check file sizes (should be small for performance)
ls -lah website/public/fonts/
# Target: <10KB per weight for optimal performance
```

### Step 4: Update Font CSS

**Edit `website/public/fonts/fonts.css`:**
```css
/* Add new font-face declarations */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('./inter-v13-latin-regular.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('./inter-v13-latin-500.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('./inter-v13-latin-700.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

### Step 5: Update Preload Links

**Edit `website/nuxt.config.ts`:**
```typescript
// Add preload links for critical font files
app: {
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: '/fonts/fonts.css'
      },
      // Preload critical fonts
      {
        rel: 'preload',
        href: '/fonts/inter-v13-latin-regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous'
      },
      {
        rel: 'preload',
        href: '/fonts/inter-v13-latin-500.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous'
      },
      // Add 700 weight only if used above-the-fold
      // {
      //   rel: 'preload',
      //   href: '/fonts/inter-v13-latin-700.woff2',
      //   as: 'font',
      //   type: 'font/woff2',
      //   crossorigin: 'anonymous'
      // }
    ]
  }
}
```

### Step 6: Test Font Loading

**Development testing:**
```bash
# Start dev server
npm run dev

# Open browser dev tools:
# 1. Network tab → Filter by "Font"
# 2. Verify fonts load from /fonts/ path
# 3. Check for FOIT (Flash of Invisible Text)
# 4. Confirm font-display: swap works
```

**Performance testing:**
```bash
# Test production build
npm run build
npm run preview

# Use Lighthouse or WebPageTest:
# - Check LCP (Largest Contentful Paint)
# - Verify no CLS (Cumulative Layout Shift)
# - Confirm font loading doesn't block rendering
```

## 📋 Step-by-Step: Changing Primary Font

### Step 1: Follow "Adding a New Font" process above

Complete steps 1-6 to add your new font files.

### Step 2: Update SCSS Variables

**Edit `website/app/style/settings.scss`:**
```scss
// Before
// $body-font-family: 'Maven Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

// After - Update primary font
$body-font-family: 'Inter', 'Maven Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

// Or completely replace
$body-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Step 3: Update Vuetify Configuration

**Edit `website/nuxt.config.ts`:**
```typescript
// Update Vuetify theme configuration
vuetify: {
  theme: {
    themes: {
      light: {
        // ... existing theme config
      }
    }
  },
  // Add custom CSS variables if needed
  styles: {
    configFile: resolve('./app/style/settings.scss')
  }
}
```

### Step 4: Test Typography

**Visual testing checklist:**
- [ ] Headers (h1, h2, h3, h4, h5, h6)
- [ ] Body text and paragraphs
- [ ] Navigation menu items
- [ ] Button text
- [ ] Form inputs and labels
- [ ] Blog post content
- [ ] Footer text

**Cross-browser testing:**
- [ ] Chrome/Edge (Blink)
- [ ] Firefox (Gecko)
- [ ] Safari (WebKit)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Step 5: Update Fallback Stack

**Ensure robust fallback:**
```scss
// Good fallback chain
$body-font-family: 'New Font', 
                   'Maven Pro',           // Previous font as fallback
                   -apple-system,         // macOS system font
                   BlinkMacSystemFont,    // macOS system font
                   'Segoe UI',            // Windows system font
                   Roboto,                // Android system font
                   sans-serif;            // Generic fallback
```

### Step 6: Performance Verification

**Bundle size check:**
```bash
# Before font change
npm run build | grep -E "fonts|css"

# After font change
npm run build | grep -E "fonts|css"

# Compare sizes - target: <50KB total for all fonts
```

**Core Web Vitals testing:**
```bash
# Use Lighthouse CLI
npx lighthouse http://localhost:3000 --preset=perf

# Key metrics to monitor:
# - LCP should remain <2.5s
# - CLS should remain <0.1
# - FCP should remain <1.8s
```

## 🔧 Advanced Font Configuration

### Variable Fonts

**For modern variable fonts (single file, multiple weights):**
```css
@font-face {
  font-family: 'Inter Variable';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('./inter-variable.woff2') format('woff2-variations');
}
```

```scss
// Use with CSS custom properties
$body-font-family: 'Inter Variable', sans-serif;

// In components, adjust weight dynamically
.heading {
  font-weight: 650; // Any value between 100-900
}
```

### Font Loading Strategies

**Strategy 1: Critical Font Preload (Current)**
```typescript
// Preload only critical fonts (regular weight)
{
  rel: 'preload',
  href: '/fonts/font-regular.woff2',
  as: 'font',
  type: 'font/woff2',
  crossorigin: 'anonymous'
}
```

**Strategy 2: Progressive Enhancement**
```css
/* Use system font first, then custom font */
.font-progressive {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

/* After font loads */
.fonts-loaded .font-progressive {
  font-family: 'Custom Font', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

**Strategy 3: Font Loading API**
```javascript
// In a plugin or composable
if ('fonts' in document) {
  const font = new FontFace('Custom Font', 'url(/fonts/font.woff2)');
  font.load().then(() => {
    document.fonts.add(font);
    document.documentElement.classList.add('custom-font-loaded');
  });
}
```

### Subsetting for Performance

**Create subsets for different languages:**
```bash
# Latin only (most common)
pyftsubset font.ttf --unicodes="U+0020-007F,U+00A0-00FF" --output-file=font-latin.woff2

# Extended Latin
pyftsubset font.ttf --unicodes="U+0020-024F" --output-file=font-latin-ext.woff2
```

**Use in CSS:**
```css
@font-face {
  font-family: 'Font Name';
  src: url('./font-latin.woff2') format('woff2');
  unicode-range: U+0020-00FF;
}

@font-face {
  font-family: 'Font Name';
  src: url('./font-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-024F;
}
```

## 📊 Performance Monitoring

### Font Loading Metrics

**Key performance indicators:**
```bash
# Font file sizes (target: <10KB per weight)
ls -lah website/public/fonts/

# Total font payload (target: <50KB)
du -sh website/public/fonts/

# Network requests (should be minimal)
curl -I http://localhost:3000/fonts/font.woff2
```

**Web Performance APIs:**
```javascript
// Measure font loading time
const fontLoadTime = performance.getEntriesByType('resource')
  .filter(entry => entry.name.includes('/fonts/'))
  .map(entry => ({
    name: entry.name,
    loadTime: entry.responseEnd - entry.startTime
  }));

console.log('Font loading times:', fontLoadTime);
```

### Bundle Analysis

**Before/after comparisons:**
```bash
# Generate bundle analysis
npm run build
ls -la .nuxt/dist/client/_nuxt/ | grep -E "\.(woff2|woff|ttf)"

# Expected results:
# Old approach: 1MB+ from CDN
# New approach: <50KB self-hosted
```

## 🚨 Common Issues and Solutions

### Font Not Loading

**Problem**: Font appears as system fallback
**Solutions**:
1. Check file paths in `fonts.css`
2. Verify MIME types: `.woff2` → `font/woff2`
3. Check browser dev tools for 404 errors
4. Ensure `crossorigin="anonymous"` in preload

### Flash of Invisible Text (FOIT)

**Problem**: Text invisible while font loads
**Solution**: Always use `font-display: swap`
```css
@font-face {
  font-family: 'Font Name';
  font-display: swap; /* Critical for preventing FOIT */
  src: url('./font.woff2') format('woff2');
}
```

### Performance Regression

**Problem**: Slower loading after font change
**Solutions**:
1. Check font file sizes (should be <10KB each)
2. Limit preloaded fonts (only critical weights)
3. Use WOFF2 format (better compression)
4. Consider variable fonts for multiple weights

### Layout Shift (CLS)

**Problem**: Text reflows when font loads
**Solutions**:
1. Use `font-display: swap` (not `block`)
2. Match fallback font metrics
3. Preload critical fonts
4. Use `size-adjust` CSS property if available

```css
@font-face {
  font-family: 'Custom Font';
  src: url('./font.woff2') format('woff2');
  font-display: swap;
  size-adjust: 95%; /* Adjust to match fallback font */
}
```

## 📚 Font Resources and Tools

### Font Sources
- [Google Fonts](https://fonts.google.com/) - Free, high-quality fonts
- [Google Webfonts Helper](https://gwfh.mranftl.com/fonts) - Self-hosting tool
- [Font Squirrel](https://www.fontsquirrel.com/) - Font conversion and hosting
- [Adobe Fonts](https://fonts.adobe.com/) - Professional fonts (subscription)

### Testing Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing
- [WebPageTest](https://webpagetest.org/) - Detailed font loading analysis
- [Font Loading Strategies](https://web.dev/font-loading-strategies/) - Best practices

### Development Tools
```bash
# Font optimization
pip install fonttools

# Bundle analysis
npm install -g webpack-bundle-analyzer

# Performance testing
npm install -g lighthouse

# Font format conversion
npm install -g ttf2woff2
```

## 🎯 Migration Checklist

### Pre-Migration
- [ ] Backup current font files
- [ ] Document current font stack
- [ ] Measure baseline performance metrics
- [ ] Prepare rollback plan

### During Migration
- [ ] Add new font files to `/public/fonts/`
- [ ] Update `fonts.css` with @font-face declarations
- [ ] Add preload links in `nuxt.config.ts`
- [ ] Update SCSS variables
- [ ] Test in development environment

### Post-Migration
- [ ] Build and test production bundle
- [ ] Run Lighthouse performance audit
- [ ] Test cross-browser compatibility
- [ ] Verify mobile font rendering
- [ ] Monitor Core Web Vitals
- [ ] Update documentation

### Performance Validation
- [ ] LCP remains <2.5s
- [ ] CLS remains <0.1
- [ ] Font files <10KB per weight
- [ ] Total font payload <50KB
- [ ] No FOIT observed
- [ ] Fallback fonts work correctly

## 📝 Font Change Log Template

```markdown
## Font Change: [Date]

**Previous Font**: Maven Pro
**New Font**: [Font Name]
**Reason**: [Performance/Design/Branding]

### Files Changed:
- `website/public/fonts/fonts.css`
- `website/nuxt.config.ts`
- `website/app/style/settings.scss`

### Performance Impact:
- Font payload: [Old size] → [New size]
- LCP: [Old time] → [New time]
- Build size: [Old size] → [New size]

### Testing Completed:
- [ ] Development testing
- [ ] Production build testing  
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Performance audit

**Rollback Plan**: [Steps to revert if needed]
```

---

**Last Updated**: August 16, 2025  
**Current Font**: Maven Pro (self-hosted)  
**Performance**: ~5KB total, font-display: swap, WOFF2 format  
**Next Steps**: Consider variable fonts for further optimization