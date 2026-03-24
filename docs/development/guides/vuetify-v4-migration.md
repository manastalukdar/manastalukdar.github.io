# Vuetify 3 → 4 Migration Guide

This document records the breaking changes identified in this project when upgrading from Vuetify 3 to Vuetify 4, along with the recommended fix for each. The analysis was produced by scanning the codebase against the [official Vuetify 4 upgrade guide](https://next.vuetifyjs.com/en/getting-started/upgrade-guide/).

---

## Summary

| #   | Category                                                      | File(s)                                               | Severity          |
| --- | ------------------------------------------------------------- | ----------------------------------------------------- | ----------------- |
| 1   | CSS import path                                               | `website/nuxt.config.ts:232`                          | Hard Break        |
| 2   | Default theme changed to `"system"`                           | `website/nuxt.config.ts:297`                          | Behavior Break    |
| 3   | `filled` / `depressed` / `text` (bool) props on form elements | `website/app/pages/contact/form.vue:18,27,38,44,51`   | Hard Break        |
| 4   | `v-icon` font-based slot usage                                | `website/app/components/PWAUpdateNotification.vue:12` | Hard Break        |
| 5   | VBtn uppercase text transform removed                         | All components with `<v-btn>`                         | Visual Break      |
| 6   | VBtn internal layout changed from CSS grid to flex            | Components with icon-inside-button                    | Visual Break      |
| 7   | CSS layers now mandatory                                      | All `:deep()` overrides and custom SCSS               | Specificity Break |
| 8   | Grid system overhaul + reduced breakpoints                    | All layout pages                                      | Visual Break      |

Items 1, 3, and 4 are **hard breaks** — the app will not function correctly until they are resolved.

---

## 1. CSS Style Entry Point

**File:** `website/nuxt.config.ts`, line 232

**Problem:** Vuetify 4 reorganised its style entry points. The v3 path `vuetify/lib/styles/main.sass` no longer exists.

```js
// Current (v3) — will break in v4
'vuetify/lib/styles/main.sass',
```

**Fix:**

```js
// v4
'vuetify/styles',
```

Additional granular entry points available in v4: `vuetify/styles/main`, `vuetify/styles/generic`.

---

## 2. Default Theme Changed to `"system"`

**File:** `website/nuxt.config.ts`, line 297

**Problem:** In v3 the default theme is `"light"`. In v4 it becomes `"system"`, which respects the user's OS-level dark/light preference. Because no `defaultTheme` is explicitly set in the vuetify plugin configuration, the site's initial theme will silently change.

```ts
// Current — no defaultTheme specified
vuetify({ autoImport: true, treeShake: true, styles: { configFile: ... } })
```

**Fix:** Explicitly declare the intended default:

```ts
vuetify({
  autoImport: true,
  treeShake: true,
  styles: { configFile: resolve('./app/style/settings.scss') },
  theme: {
    defaultTheme: 'lightTheme', // or 'darkNightTheme' / 'darkForestTheme'
  },
})
```

The theme names available in this project are `lightTheme`, `darkNightTheme`, and `darkForestTheme` (see `website/app/components/settings.vue`).

**Note:** The `theme.unimportant` option was also removed in v4 (no longer needed with CSS layers). Remove it if it is present in your theme configuration.

---

## 3. Removed Variant Shorthand Props on Form Elements

**File:** `website/app/pages/contact/form.vue`, lines 18, 27, 38, 44, 51

**Problem:** The boolean shorthand props `filled`, `depressed`, and `text` (on `v-btn`) were removed in v3 in favour of the unified `variant` prop. They are absent in v4 entirely.

```html
<!-- Lines 18, 27 — v-text-field -->
<v-text-field filled ... />

<!-- Line 38 — v-textarea -->
<v-textarea filled ... />

<!-- Line 44 — v-btn with boolean text prop -->
<v-btn text @click="$refs.form.reset()">Clear</v-btn>

<!-- Line 51 — v-btn with depressed prop -->
<v-btn depressed type="submit">Submit</v-btn>
```

**Fix:**

```html
<v-text-field variant="filled" ... />

<v-textarea variant="filled" ... />

<v-btn variant="text" @click="$refs.form.reset()">Clear</v-btn>

<v-btn variant="flat" type="submit">Submit</v-btn>
```

Available `variant` values: `"elevated"` (default), `"flat"`, `"tonal"`, `"outlined"`, `"text"`, `"plain"`.

---

## 4. `v-icon` Font-based Slot Usage

**File:** `website/app/components/PWAUpdateNotification.vue`, line 12

**Problem:** Passing an icon name as inner slot content (`<v-icon>mdi-download</v-icon>`) relies on the MDI font pack. In v4 font icon packs are not loaded by default; only SVG or component-based icons work out of the box.

```html
<!-- Current — font icon approach -->
<v-icon class="mr-3">mdi-download</v-icon>
```

**Fix:** Use the project's existing `TreeShakenIcon` component (already used throughout the rest of the codebase):

```html
<TreeShakenIcon icon="mdi-download" class="mr-3" />
```

Ensure `mdi-download` is registered in `website/app/utils/icons.ts`.

---

## 5. VBtn — Default Uppercase Text Transform Removed

**Scope:** All components containing `<v-btn>`.

**Problem:** In v3, buttons render their label text in uppercase by default (CSS `text-transform: uppercase`). This is removed in v4; buttons render in their natural case.

Key affected files:

- `website/app/components/blog/bookmark-button.vue`
- `website/app/pages/bookmarks.vue`
- `website/app/components/blog/posts-list/pagination-controls.vue`
- `website/app/components/search/SearchFilters.vue`
- `website/app/pages/contact/form.vue`

**Fix (option A):** Add `class="text-uppercase"` to individual buttons that should remain uppercase.

**Fix (option B):** Add a global SCSS override in `website/app/style/settings.scss`:

```scss
.v-btn {
  text-transform: uppercase;
}
```

---

## 6. VBtn — Internal Layout Changed from CSS Grid to Flexbox

**Problem:** The internal layout of `v-btn` changed from CSS grid to flexbox. Custom styles that targeted the grid-based internal layout (e.g. icon spacing, alignment) may render incorrectly.

Key files with `.v-icon` rules inside buttons:

- `website/app/components/blog/bookmark-button.vue`, lines 130, 134
- `website/app/pages/about/testimonials.vue`, lines 556, 587
- `website/app/components/home-page/testimonial-carousel.vue`, lines 224, 384

**Fix:** After upgrading, visually review all buttons that contain icons. Adjust margin/alignment CSS rules on `.v-icon` within buttons from grid-based positioning to flex-based equivalents (e.g. replace `grid-column` / `grid-row` with `align-self` / `margin`).

---

## 7. CSS Layers Now Mandatory

**Problem:** Vuetify 4 wraps all of its styles in named CSS layers, giving them lower specificity than any un-layered selector. This changes the cascade in two ways:

- Custom CSS that previously required `!important` to beat Vuetify may now over-apply.
- `:deep()` overrides that worked via specificity tricks may behave differently.

Layer names were also flattened in v4 (e.g. `vuetify.components.VBtn` → `vuetify`).

Key files with `:deep()` overrides:

- `website/app/components/PWAUpdateNotification.vue`, line 81 — `:deep(.v-snackbar__wrapper)`
- `website/app/components/blog/bookmark-button.vue`, line 130 — `.bookmark-btn .v-icon`

**Fix:**

1. Remove any `!important` declarations that were only needed to override Vuetify specificity.
2. Test all `:deep()` selectors after upgrading and confirm they still apply as expected.
3. If a custom style must beat a Vuetify layer, wrap it in your own higher-priority layer:

```scss
@layer overrides {
  .my-component { ... }
}
```

---

## 8. Grid System Overhaul + Reduced Default Breakpoints

**Problem:** The grid system (`v-container`, `v-row`, `v-col`) was overhauled in v4 to align with Material Design 3. Default breakpoint values were also reduced to better match modern device sizes.

Breakpoint changes (approximate):

| Name | v3          | v4          |
| ---- | ----------- | ----------- |
| `xs` | < 600px     | < 600px     |
| `sm` | 600–960px   | 600–840px   |
| `md` | 960–1280px  | 840–1200px  |
| `lg` | 1280–1920px | 1200–1600px |
| `xl` | > 1920px    | > 1600px    |

**Affected pages:** Any page using responsive `cols`, `sm`, `md`, `lg` props — essentially every layout page in the project.

**Fix:** After upgrading, visually test all breakpoint-responsive layouts. Pay particular attention to:

- `website/app/pages/index.vue`
- `website/app/pages/about/professional/highlights.vue`
- `website/app/components/blog/posts-list/single-post.vue`
- `website/app/components/home-page/featured.vue`

---

## Additional Notes

### MD3 Typography and Elevation

Vuetify 4 adopts Material Design 3 typography scale and elevation levels. Class names like `text-h6`, `text-body-1`, `text-caption`, and elevation props (e.g. `elevation="8"`) may render at different sizes or shadow depths. Review typography and elevation visually after upgrading.

### VForm Slot Props Unreffed

`website/app/pages/contact/form.vue` uses `<v-form ref="form" v-model="form">`. In v4, VForm slot props are now raw values rather than refs. Since this form does not use the VForm slot directly (it accesses the form via `$refs`), the impact is minimal. However, verify that `$refs.form.reset()` and `$refs.form.validate()` still behave as expected after upgrading.

### VSelect / VAutocomplete / VCombobox — `item` Slot Renamed to `internalItem`

The `item` slot prop on `v-select`, `v-autocomplete`, and `v-combobox` was renamed to `internalItem` in v4. Scanning found no `item` slot overrides on these components in this project — **not applicable** at this time.

The `v-slot:item` overrides found in `categories.vue`, `archive.vue`, `post-formats.vue`, and `tags.vue` are on `v-data-table`, which is a different component and unaffected by this rename.

### VSnackbar — `multi-line` Prop Removed

The `multi-line` prop was removed from `v-snackbar` in v4. Scanning found no usage of `multi-line` in this project — **not applicable**.
