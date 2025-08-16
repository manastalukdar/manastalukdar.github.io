# Font Reference - Quick Guide

Quick reference for the current font setup and common font operations.

## 📊 Current Font Configuration

**Primary Font**: Maven Pro  
**Hosting**: Self-hosted (performance optimized)  
**Total Size**: ~5KB (vs 1MB+ from CDN)  
**Format**: WOFF2 (optimal compression)  
**Loading**: font-display: swap (prevents FOIT)  

### Font Weights Available
- **400** (Regular) - 1.6KB - `maven-pro-v32-latin-regular.woff2`
- **500** (Medium) - 1.6KB - `maven-pro-v32-latin-500.woff2` 
- **700** (Bold) - 1.6KB - `maven-pro-v32-latin-700.woff2`

### Font Stack
```scss
$body-font-family: ('Maven Pro', 'Helvetica Neue', 'Segoe UI', 'sans-serif')
```

## 🔧 Key Files

| File | Purpose |
|------|---------|
| `website/public/fonts/fonts.css` | Font-face declarations |
| `website/public/fonts/*.woff2` | Font files (3 weights) |
| `website/nuxt.config.ts` | Preload links configuration |
| `website/app/style/settings.scss` | Font family variables |

## ⚡ Quick Actions

### Add New Font Weight
1. Download WOFF2 file → `website/public/fonts/`
2. Add @font-face → `website/public/fonts/fonts.css`
3. Add preload link → `website/nuxt.config.ts`

### Change Primary Font
1. Follow [complete font management guide](./guide-font-management.md)
2. Key steps: Download → CSS → Preload → SCSS → Test

### Debug Font Issues
```bash
# Check font files
ls -lah website/public/fonts/

# Test dev server
npm run dev
# Browser Dev Tools → Network → Font filter

# Performance audit
npx lighthouse http://localhost:3000 --preset=perf
```

## 📈 Performance Metrics

**Target Goals** (currently achieved):
- ✅ Font files: <10KB each
- ✅ Total payload: <50KB  
- ✅ LCP: <2.5s
- ✅ CLS: <0.1
- ✅ No FOIT (font-display: swap)

**Monitoring Commands**:
```bash
# Bundle size
du -sh website/public/fonts/

# Network performance
curl -I http://localhost:3000/fonts/maven-pro-v32-latin-regular.woff2
```

## 🔗 Related Documentation

- **[Complete Font Management Guide](./guide-font-management.md)** - Detailed instructions for adding/changing fonts
- **[Performance Optimization Session](../../../.claude/sessions/2025-08-16-1430.md)** - Implementation history and results

---

**Last Updated**: August 16, 2025  
**Status**: Optimized (99.5% size reduction vs CDN)  
**Next**: Consider variable fonts for further optimization