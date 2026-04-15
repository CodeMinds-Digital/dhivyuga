# Dhivyuga Frontend Redesign — Search-Driven Experience

## Overview

Redesign the Dhivyuga frontend from a traditional multi-page layout into a Google-like search-driven experience. The homepage acts as a search engine. Results display as a compact list. Mantra details open in a full-screen overlay instead of navigating to a separate page. Full i18n support for Tamil, English, and Hindi across both UI and content.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Homepage layout | Centered vertical (Google-style) | Focuses attention on search, reduces cognitive load |
| Pre-search content | Admin-configurable sections | Default is minimal; admins can toggle category chips, trending, etc. |
| Search results style | Compact list with metadata | Title + snippet + right-aligned deity/category/time tags + view count |
| Mantra detail view | Full-screen overlay | Maximum content space, feels immersive, preserves search context in browser history |
| Language switching | Full i18n (UI + content) | Global language switcher changes both UI labels and mantra content |
| Language switcher location | Inside search bar (homepage), header (results/overlay) | Always accessible, doesn't consume extra vertical space |

---

## 1. Brand Design System

### 1.1 Color Palette

**Brand (Saffron):** The primary color family, rooted in the sacred saffron tradition.

| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-50` | `#FFF8F0` | Backgrounds, hover states |
| `--brand-100` | `#FFEDD5` | Chip backgrounds, subtle fills |
| `--brand-200` | `#FED7AA` | Active chip borders |
| `--brand-300` | `#FDBA74` | Hover borders |
| `--brand-400` | `#FB923C` | Benefit bullets, accents |
| `--brand-500` | `#F97316` | Active tab indicators, primary actions |
| `--brand-600` | `#EA580C` | Section labels |
| `--brand-700` | `#C2410C` | Deity tags, active text |
| `--brand-800` | `#9A3412` | Dark accent |
| `--brand-900` | `#7C2D12` | Darkest accent |

**Neutral (Warm Slate):** For text, borders, and surfaces.

| Token | Hex | Usage |
|-------|-----|-------|
| `--neutral-0` | `#FFFFFF` | Page backgrounds |
| `--neutral-50` | `#FAFAF9` | Results page background, detail cards |
| `--neutral-100` | `#F5F5F4` | Borders, dividers |
| `--neutral-200` | `#E7E5E4` | Input borders, chip borders |
| `--neutral-400` | `#A8A29E` | Placeholder text, icons |
| `--neutral-500` | `#78716C` | Secondary text, snippets |
| `--neutral-600` | `#57534E` | Labels, language switcher |
| `--neutral-800` | `#292524` | Body text |
| `--neutral-900` | `#1C1917` | Headings, titles |

**Semantic:** `--success: #16A34A`, `--sacred-gold: #B8860B`, `--sacred-gold-light: #FEF9C3`, `--info: #2563EB`

### 1.2 Typography

| Font | Family | Usage |
|------|--------|-------|
| Inter | `'Inter', -apple-system, sans-serif` | All UI text — labels, body, buttons |
| Noto Serif Devanagari | `'Noto Serif Devanagari', serif` | Logo text (திவ்யுகா), display headings |
| Noto Sans Tamil | `'Noto Sans Tamil', sans-serif` | Tamil mantra text, Tamil UI when locale is `ta` |

**Type Scale (1.25 modular ratio):**

| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 10.24px | Meta labels, tag text, view counts |
| `--text-sm` | 12.8px | Snippets, detail values, tab labels |
| `--text-base` | 16px | Search input, body text, result titles |
| `--text-md` | 18px | Action icons |
| `--text-lg` | 20px | Results page logo |
| `--text-xl` | 25px | Sacred mantra text |
| `--text-2xl` | 31.25px | Mantra title in overlay |
| `--text-4xl` | 48.8px | Homepage logo |

### 1.3 Spacing

8px grid system: `--space-1` (4px) through `--space-16` (128px). All padding, margins, and gaps use these tokens.

### 1.4 Elevation (Shadows)

| Token | Usage |
|-------|-------|
| `--shadow-xs` | Subtle depth on cards |
| `--shadow-search` | Search bar resting state |
| `--shadow-search-focus` | Search bar focused (saffron glow) |
| `--shadow-md` | Search bar hover |
| `--shadow-lg` | Elevated cards |

### 1.5 Border Radius

`--radius-sm` (6px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-xl` (16px), `--radius-full` (9999px for pills/search bar).

### 1.6 Motion

- `--duration-fast`: 150ms (hover, focus)
- `--duration-normal`: 250ms (transitions)
- `--duration-slow`: 400ms (page transitions, overlay open/close)
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)` — for elements entering
- `--ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)` — for transforms

---

## 2. Screen Specifications

### 2.1 Homepage

**Layout:** Full-viewport centered vertical. Background: linear gradient from `--neutral-0` to `--brand-50`. Subtle radial gradient accent in top-right corner (4% opacity).

**Components (top to bottom):**

1. **Logo block** — Tamil text "திவ்யுகா" at `--text-4xl` in Noto Serif Devanagari, weight 700. Subtitle "Dhivyuga · Sacred Mantra Search" at `--text-sm`, weight 500, uppercase, 0.15em letter-spacing, color `--neutral-500`.

2. **Search bar** — Max-width 640px. Pill-shaped (`--radius-full`). 1.5px border `--neutral-200`. Internal: search icon (20px, `--neutral-400`) + text input (`--text-base`) + language switcher pill. Focus state: border `--brand-400`, shadow `--shadow-search-focus` (saffron glow). Hover: border `--neutral-300`, shadow `--shadow-md`.

3. **Category chips** — Horizontal flex, centered, gap `--space-2`, margin-top `--space-5`. Each chip: `--radius-full`, `--text-sm`, weight 500, border 1px `--neutral-200`. Hover: border `--brand-300`, text `--brand-700`, bg `--brand-50`. Active: border `--brand-500`, bg `--brand-100`. These chips are admin-togglable via a site settings collection in Appwrite.

4. **Admin-configurable sections below** (togglable): Trending mantras grid, browse by deity, browse by category. Off by default. When enabled, appear below chips with `--space-12` top margin.

**Autocomplete dropdown:** Appears below search bar on typing (after 2+ characters, 300ms debounce). White background, `--shadow-lg`, `--radius-lg`. Each suggestion: padding `--space-3` `--space-4`, hover bg `--neutral-50`. Shows type badge (mantra/deity/category) in `--text-xs`.

### 2.2 Search Results Page

**Header (sticky top):** Flex row — logo (Noto Serif Devanagari, `--text-lg`) + search bar (pill, smaller than homepage, max-width 580px) + language switcher. Background: `--neutral-0`, bottom border 1px `--neutral-100`.

**Filter chips row:** Below header, horizontal scroll, gap `--space-2`. Chips: `--radius-full`, `--text-xs`, weight 500. "All" chip active by default. Chips sourced from categories and recitation times.

**Results meta:** "3 results for 'ganesha' · 0.12s" — `--text-xs`, color `--neutral-500`, padding `--space-3` horizontal.

**Results list:** Max-width 800px, no side padding on items (full-width feel). Each result item:

- Layout: flex row, gap `--space-4`. Left: content (flex 1). Right: metadata (flex-shrink 0).
- **Title:** `--text-base`, weight 600, color `--neutral-900`.
- **Snippet:** `--text-sm`, color `--neutral-500`, 2-line clamp.
- **Tags row:** flex, gap `--space-2`, margin-top `--space-2`. Deity tag (brand-50 bg, brand-700 text). Category tag (blue-50 bg, blue-700 text). Time tag (neutral-100 bg, neutral-600 text, format: "Morning · 108×").
- **View count:** right-aligned, `--text-xs`, color `--neutral-400`, eye icon + number.
- **Separator:** 1px `--neutral-100` bottom border.
- **Hover:** bg `--neutral-0`, negative margin + padding for inset effect, `--radius-lg`.
- **Click:** Opens full-screen overlay. URL updates to `/mantra/[id]` via `history.pushState` (no page navigation).

### 2.3 Full-Screen Mantra Overlay

**Entry animation:** Slide up from bottom with fade, 400ms `--ease-out`. Background: `--neutral-0`.

**Exit:** Click back/close or browser back. Slide down, return to search results. Search results state preserved (scroll position, query, filters).

**Top bar (sticky):** Flex space-between. Left: back button ("← Back to results", `--text-sm`, weight 500). Right: action buttons (audio, copy, share, close) — 36px square, `--radius-md`, hover bg `--neutral-100`.

**Body:** Max-width 720px, centered. Sections:

1. **Mantra hero:** Centered. Title at `--text-2xl`, weight 700. Below: tag pills for deity (brand), category (blue), view count (neutral).

2. **Language tabs:** Horizontal, bottom border 1px `--neutral-200`. Active tab: `--brand-700` text, weight 600, 2px bottom border `--brand-500`. Inactive: `--neutral-500`. Tab labels include native script: "தமிழ் (Tamil)", "English", "हिन्दी (Hindi)", "संस्कृतम् (Sanskrit)". Switching tabs updates all content sections below.

3. **Sacred text block:** Centered. Background: gradient from `--sacred-gold-light` to `#FFF7ED`. Border: 1px `#FDE68A`. Radius `--radius-lg`. Padding `--space-6`. Decorative "॥" markers on left and right (absolute positioned, `--sacred-gold`, 40% opacity). Mantra text: `--text-xl`, weight 600, Noto Sans Tamil / Noto Serif Devanagari (per language). Transliteration below: `--text-sm`, italic, `--neutral-500`.

4. **Details grid:** 2×2 CSS grid, gap `--space-3`. Each card: bg `--neutral-50`, border 1px `--neutral-100`, `--radius-md`, padding `--space-4`. Label: `--text-xs`, weight 600, uppercase, 0.08em spacing, `--neutral-400`. Value: `--text-sm`, weight 600, `--neutral-800`. Cards: Deity, Best Time (with range), Recitation Count (with description), Auspicious Period (green if favorable).

5. **Meaning & Significance:** Heading `--text-sm`, weight 700, uppercase, 0.06em spacing, bottom border 1px `--neutral-100`. Body: `--text-sm`, `--neutral-700`, line-height 1.7.

6. **Benefits:** Same heading style. Bulleted list with `--brand-400` dot markers (6px circles). Each item: `--text-sm`, `--neutral-700`, line-height 1.5.

7. **How to Chant:** Same heading and body style as Meaning section.

---

## 3. Multi-Language (i18n)

### 3.1 Architecture

Use `next-intl` (already installed at `^4.3.4`) with the App Router pattern.

**Locale routing:** URL prefix pattern — `/en/...`, `/ta/...`, `/hi/...`. Default locale: `ta` (Tamil). Fallback: `en`.

**File structure:**
```
messages/
  en.json    — English UI translations
  ta.json    — Tamil UI translations
  hi.json    — Hindi UI translations
i18n/
  request.ts — next-intl server config
  routing.ts — locale routing config
middleware.ts — locale detection and redirect
app/
  [locale]/
    page.tsx        — Homepage
    search/page.tsx — Search results
    layout.tsx      — Locale-aware layout
```

### 3.2 Translation Scope

**UI translations** (stored in `messages/*.json`):
- Navigation labels, button text, placeholders
- Section headings ("Benefits", "How to Chant", "Meaning & Significance")
- Meta text ("results for", "views", "Back to results")
- Filter labels, chip labels
- Error states, loading states, empty states

**Content translations** (stored in Appwrite `mantra_translations` collection):
- Mantra text per language
- Transliteration, pronunciation guide
- Meaning, benefits, usage notes

**Language switcher behavior:** Clicking the switcher updates the URL locale prefix and reloads UI strings. Mantra content in the overlay re-fetches the translation for the selected language from the translations already loaded (they're fetched all at once from the API).

---

## 4. Component Architecture

### 4.1 New Components

| Component | Path | Purpose |
|-----------|------|---------|
| `SearchHero` | `components/search-hero.tsx` | Homepage centered layout — logo, search bar, chips |
| `SearchResultsList` | `components/search-results-list.tsx` | Compact results list with metadata |
| `SearchResultItem` | `components/search-result-item.tsx` | Single result row — title, snippet, tags, views |
| `MantraOverlay` | `components/mantra-overlay.tsx` | Full-screen overlay with topbar, body, animations |
| `MantraContent` | `components/mantra-content.tsx` | Inner content: sacred text, details grid, sections |
| `LanguageTabs` | `components/language-tabs.tsx` | Horizontal tab bar for switching content language |
| `LanguageSwitcher` | `components/language-switcher.tsx` | Dropdown for switching UI locale (EN/TA/HI) |
| `FilterChips` | `components/filter-chips.tsx` | Horizontal scrollable filter pills |
| `SacredTextBlock` | `components/sacred-text-block.tsx` | Decorated mantra text display with transliteration |
| `DetailsGrid` | `components/details-grid.tsx` | 2x2 grid of deity, time, count, kalam |

### 4.2 Modified Components

| Component | Change |
|-----------|--------|
| `components/search-bar.tsx` | Restyle to pill shape, add language switcher slot, update autocomplete dropdown styling |
| `app/page.tsx` | Replace current multi-section homepage with SearchHero |
| `app/search/page.tsx` | Replace card grid with SearchResultsList, add MantraOverlay |
| `app/layout.tsx` | Wrap with `NextIntlClientProvider`, add locale detection |

### 4.3 Removed/Deprecated Components

| Component | Reason |
|-----------|--------|
| `app/mantra/[id]/page.tsx` | Replaced by MantraOverlay (no separate detail page) |
| `components/mantra-card.tsx` | Replaced by SearchResultItem (list, not cards) |
| `components/trending-mantras.tsx` | Moved to admin-togglable section |
| `components/deity-grid.tsx` | Moved to admin-togglable section |
| `components/category-grid.tsx` | Moved to admin-togglable section |
| `components/quick-filters.tsx` | Replaced by FilterChips |

Note: Keep `/mantra/[id]` route as a redirect/fallback for SEO and shared links — it renders the search page with the overlay pre-opened.

### 4.4 Data Flow

```
Homepage
  └─ User types in SearchBar
       └─ Autocomplete: GET /api/autocomplete?q=...
       └─ User submits or clicks suggestion
            └─ Navigate to /[locale]/search?q=...
                 └─ SearchResultsList: GET /api/search?q=...&category=...
                      └─ User clicks result
                           └─ MantraOverlay opens (history.pushState)
                           └─ GET /api/mantras/[id] (full detail + translations)
                           └─ LanguageTabs switch content client-side
                           └─ Close → back to results (popState)
```

---

## 5. Admin Configuration

### 5.1 Site Settings Collection

Add a new Appwrite collection `site_settings` with a single document storing homepage toggles:

| Attribute | Type | Default | Purpose |
|-----------|------|---------|---------|
| `show_category_chips` | boolean | true | Show/hide category chips on homepage |
| `show_trending` | boolean | false | Show/hide trending mantras section |
| `show_deity_grid` | boolean | false | Show/hide browse by deity |
| `show_category_grid` | boolean | false | Show/hide browse by category |

### 5.2 Admin Settings UI

Add a "Homepage Settings" section to the existing `/admin/settings` page with toggle switches for each option.

---

## 6. URL Structure

| URL | What it shows |
|-----|---------------|
| `/` | Redirects to `/ta/` (default locale) |
| `/ta/` | Homepage in Tamil |
| `/en/` | Homepage in English |
| `/hi/` | Homepage in Hindi |
| `/ta/search?q=ganesha` | Search results in Tamil |
| `/en/search?q=ganesha&category=xxx` | Filtered search in English |
| `/ta/search?q=ganesha&mantra=abc123` | Search results with mantra overlay open |

The `mantra` query param controls the overlay. When present, the overlay opens for that mantra ID. Browser back removes the param and closes the overlay.

---

## 7. Accessibility

- Search bar: `role="search"`, `aria-label`, proper `for`/`id` on input
- Results: `role="list"` / `role="listitem"`, keyboard navigable (arrow keys + Enter)
- Overlay: `role="dialog"`, `aria-modal="true"`, focus trap, Escape to close
- Language tabs: `role="tablist"` / `role="tab"` / `role="tabpanel"`, arrow key navigation
- Color contrast: All text meets WCAG 2.1 AA (4.5:1 for body, 3:1 for large text)
- Motion: Respect `prefers-reduced-motion` — disable slide animations, use instant transitions

---

## 8. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (< 640px) | Search bar full-width with smaller padding. Filter chips horizontally scrollable. Results stack vertically (metadata below snippet). Overlay body full-width padding. Details grid becomes 1-column. |
| Tablet (640–1024px) | Search bar max-width 540px. Results list max-width 720px. Details grid stays 2-column. |
| Desktop (> 1024px) | Search bar max-width 640px. Results max-width 800px. Overlay body max-width 720px. |

---

## 9. Verification

1. Homepage renders with search bar, logo, and language switcher
2. Typing in search bar shows autocomplete suggestions after 2 characters
3. Submitting search navigates to results page with compact list
4. Clicking a result opens full-screen overlay with slide-up animation
5. Language tabs switch mantra content without page reload
6. Language switcher changes URL locale and all UI strings
7. Browser back from overlay returns to results (scroll position preserved)
8. `/mantra/[id]` URLs redirect to search page with overlay open (SEO fallback)
9. Admin can toggle homepage sections from settings page
10. All screens render correctly on mobile, tablet, and desktop
11. Keyboard navigation works throughout (Tab, Enter, Escape, Arrow keys)
12. `npm run build` succeeds with no TypeScript errors
