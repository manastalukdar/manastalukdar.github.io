# Icon Management Guide

This document outlines how to manage Material Design Icons (MDI) in the website using our hybrid tree-shaking approach.

## Current Architecture

We use a **hybrid approach** for icon management:

1. **MDI Font Fallback**: All icons work via `@mdi/font/css/materialdesignicons.min.css` (3.6MB fonts)
2. **Tree-Shaken SVG Icons**: Optimized icons via `@mdi/js` (38KB+ selective imports)
3. **Gradual Migration**: Components can use either approach during transition

## Adding New MDI Icons

When you need to add a new MDI icon to the website, follow these steps:

### Step 1: Use the Icon Immediately (Font Fallback)

You can start using any MDI icon right away using the traditional syntax:

```vue
<!-- This works immediately - uses font fallback -->
<v-icon>mdi-new-icon-name</v-icon>
```

The icon will work because we load the full MDI font set as a fallback.

### Step 2: Add Icon to Tree-Shaken Set (Recommended)

For better performance, add frequently used icons to the tree-shaken set:

#### 2.1 Import the Icon in `utils/icons.ts`

```typescript
// Add to the import statement
import {
  // ... existing icons
  mdiNewIconName,  // ← Add your new icon here
} from '@mdi/js'

// Add to the iconMap object
export const iconMap = {
  // ... existing mappings
  'new-icon-name': mdiNewIconName,  // ← Map kebab-case to camelCase
} as const

// Add to the export statement
export {
  // ... existing exports
  mdiNewIconName,  // ← Export for direct use
}
```

#### 2.2 Convert Component Usage

Replace the font-based icon with the tree-shaken component:

```vue
<!-- Before: Font-based (works but adds to bundle) -->
<v-icon>mdi-new-icon-name</v-icon>

<!-- After: Tree-shaken (optimized) -->
<TreeShakenIcon icon="mdi-new-icon-name" />
```

### Step 3: Update Documentation

Add the new icon to this list for tracking:

#### Currently Tree-Shaken Icons (50+):

**Navigation & UI**
- `mdi-home`, `mdi-menu`, `mdi-close`, `mdi-magnify`
- `mdi-chevron-left`, `mdi-chevron-right`, `mdi-menu-down`
- `mdi-cog`, `mdi-information`, `mdi-bookmark`

**Professional & Documents**  
- `mdi-briefcase-outline`, `mdi-account-group`, `mdi-domain`
- `mdi-file-document`, `mdi-file-document-outline`, `mdi-text`
- `mdi-newspaper`, `mdi-book-open-variant`

**Content & Blog**
- `mdi-calendar`, `mdi-clock`, `mdi-eye`, `mdi-share`
- `mdi-tag-outline`, `mdi-printer`, `mdi-check-circle`

**Social & External**
- `mdi-linkedin`, `mdi-github`, `mdi-twitter`, `mdi-email`

[Add your new icon here with appropriate category]

## Migration Strategy

### Priority Order for Converting Icons:

1. **High Priority**: Navigation, header, footer icons (most visible)
2. **Medium Priority**: Blog post icons, frequent UI elements  
3. **Low Priority**: Admin, settings, rarely used icons

### Conversion Checklist:

- [ ] Icon added to `utils/icons.ts` import
- [ ] Icon added to `iconMap` object
- [ ] Icon added to export list
- [ ] Component updated to use `<TreeShakenIcon>`
- [ ] Build tested successfully
- [ ] Icon displays correctly in browser

## Testing New Icons

### 1. Development Testing

```bash
# Start dev server
npm run dev

# Check browser console for warnings:
# "Tree-shaken icon not found: mdi-xyz"
```

### 2. Build Testing  

```bash
# Test production build
npm run build

# Verify no build errors
# Check bundle size impact
```

### 3. Visual Testing

- Navigate to pages using the new icon
- Verify icon displays correctly
- Test different screen sizes
- Check hover states and interactions

## Bundle Size Monitoring

### Current Metrics:
- **Font Fallback**: 3.6MB (WOFF2: 403KB, WOFF: 588KB, TTF: 1.3MB, EOT: 1.3MB)
- **Tree-Shaken Icons**: 38KB+ (grows ~1KB per 2-3 icons added)
- **Target**: Eventually eliminate font fallback entirely

### Tracking Impact:

Each time you add tree-shaken icons, note the bundle size change:

```bash
# Before adding icon
npm run build | grep "entry.*css"
# entry.CvgRGcY6.css  938.27 kB │ gzip: 129.38 kB

# After adding icon  
npm run build | grep "entry.*css"
# Compare sizes
```

## Troubleshooting

### Icon Not Displaying

1. **Check spelling**: Ensure `mdi-icon-name` matches exactly
2. **Verify import**: Icon must be imported in `utils/icons.ts`
3. **Check mapping**: Icon must be in `iconMap` object
4. **Component syntax**: Use `<TreeShakenIcon icon="mdi-icon-name" />`

### Build Errors

1. **Import error**: Icon name doesn't exist in `@mdi/js`
   - Check [MDI documentation](https://materialdesignicons.com/) for correct name
   - Use camelCase in imports: `mdi-some-icon` → `mdiSomeIcon`

2. **TypeScript error**: Missing from iconMap type
   - Add to `iconMap` object with proper mapping

### Console Warnings

```
"Tree-shaken icon not found: mdi-xyz. Add it to utils/icons.ts"
```

This means:
- Icon falls back to font loading (works but not optimized)
- Add icon to tree-shaken set for better performance

## Future Migration Goals

### Phase 1: Critical Icons (In Progress)
- [x] TopNavBar icons (3/3)
- [ ] NavigationDrawer icons (10+ icons)
- [ ] MainNavMenu components (15+ icons)

### Phase 2: Content Icons  
- [ ] Blog post headers and metadata
- [ ] Search and filter components
- [ ] Social sharing buttons

### Phase 3: Complete Migration
- [ ] All remaining components converted
- [ ] Remove MDI font dependency
- [ ] Eliminate 3.6MB font bundle
- [ ] Update this documentation

## Commands Reference

```bash
# Find all MDI icon usage in codebase
grep -r "mdi-" website/app --include="*.vue" | wc -l

# Find specific icon usage
grep -r "mdi-specific-icon" website/app --include="*.vue"

# Check current bundle size
npm run build | grep -E "(css|js)" | grep entry

# Test development build
npm run dev
```

---

**Last Updated**: 2025-08-16  
**Current Status**: 3 icons tree-shaken, 163+ remaining  
**Next Priority**: NavigationDrawer and MainNavMenu components