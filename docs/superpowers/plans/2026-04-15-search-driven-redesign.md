# Search-Driven Frontend Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Dhivyuga frontend from a multi-section homepage into a Google-like search-driven experience with compact results, full-screen mantra overlay, and full i18n (Tamil/English/Hindi).

**Architecture:** Replace the current multi-page flow (homepage → search page → detail page) with a search-first homepage, compact results list, and a full-screen overlay for mantra details controlled via query params. Add next-intl locale routing (`/[locale]/`) for full UI + content internationalization. Add admin-configurable homepage sections via a new `site_settings` Appwrite collection.

**Tech Stack:** Next.js 15 (App Router), Appwrite (databases), TailwindCSS 3.3, shadcn/ui (Radix), Framer Motion 12, next-intl 4.3, Lucide React icons

**Spec:** `docs/superpowers/specs/2026-04-15-search-driven-redesign.md`

---

## File Structure

### New files to create:
```
i18n/
  routing.ts                    — next-intl locale routing config
  request.ts                    — next-intl server request config
messages/
  en.json                       — English UI translations
  ta.json                       — Tamil UI translations
  hi.json                       — Hindi UI translations
middleware.ts                   — Locale detection + redirect
app/[locale]/
  layout.tsx                    — Locale-aware layout with NextIntlClientProvider
  page.tsx                      — Search-first homepage
  search/page.tsx               — Search results + MantraOverlay
components/
  search-hero.tsx               — Homepage centered layout (logo + search + chips)
  search-results-list.tsx       — Compact results list container
  search-result-item.tsx        — Single result row
  mantra-overlay.tsx            — Full-screen overlay with animations
  mantra-content.tsx            — Overlay inner content (text, grid, sections)
  sacred-text-block.tsx         — Decorated mantra text display
  details-grid.tsx              — 2x2 metadata grid
  filter-chips.tsx              — Horizontal scrollable filter pills
  language-tabs.tsx             — Content language tab bar
```

### Files to modify:
```
app/globals.css                 — Replace color tokens with saffron brand system
app/layout.tsx                  — Add Noto fonts, remove old layout (becomes redirect)
tailwind.config.js              — Update color/font/shadow mappings
components/search-bar.tsx       — Restyle to pill shape with lang switcher slot
components/language-switcher.tsx — Restyle as compact pill for search bar
lib/appwrite.ts                 — Add COLLECTIONS.SITE_SETTINGS constant
```

### Files to deprecate (keep but no longer routed to):
```
app/page.tsx                    — Replaced by app/[locale]/page.tsx
app/search/page.tsx             — Replaced by app/[locale]/search/page.tsx
app/mantra/[id]/page.tsx        — Overlay replaces this; keep as SEO redirect
components/mantra-card.tsx      — Replaced by search-result-item.tsx
components/quick-filters.tsx    — Replaced by filter-chips.tsx
components/trending-mantras.tsx — Moved to admin-togglable section
components/deity-grid.tsx       — Moved to admin-togglable section
components/category-grid.tsx    — Moved to admin-togglable section
```

---

## Task 1: Brand Design Tokens — Update CSS Variables

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace the color system in globals.css**

Open `app/globals.css` and replace the `:root` color variables section (inside `@layer base`) with the saffron brand system. Keep the existing spacing, motion, and typography variables. Add the new brand tokens at the top of `:root`:

```css
/* Brand Colors — Saffron & Sacred */
--brand-50: #FFF8F0;
--brand-100: #FFEDD5;
--brand-200: #FED7AA;
--brand-300: #FDBA74;
--brand-400: #FB923C;
--brand-500: #F97316;
--brand-600: #EA580C;
--brand-700: #C2410C;
--brand-800: #9A3412;
--brand-900: #7C2D12;

/* Neutral — Warm Stone */
--neutral-0: #FFFFFF;
--neutral-50: #FAFAF9;
--neutral-100: #F5F5F4;
--neutral-200: #E7E5E4;
--neutral-300: #D6D3D1;
--neutral-400: #A8A29E;
--neutral-500: #78716C;
--neutral-600: #57534E;
--neutral-700: #44403C;
--neutral-800: #292524;
--neutral-900: #1C1917;

/* Semantic */
--sacred-gold: #B8860B;
--sacred-gold-light: #FEF9C3;

/* Shadows */
--shadow-search: 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
--shadow-search-focus: 0 4px 16px rgba(249,115,22,0.12), 0 0 0 2px rgba(249,115,22,0.2);
```

Also update the existing `--primary` to use the brand saffron: `--primary: 249 115 22;` (brand-500 in RGB).

- [ ] **Step 2: Add Noto fonts import**

At the top of `app/globals.css`, add after the existing `@import url(...)` line:

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap');
```

- [ ] **Step 3: Verify the build**

Run: `npx next build 2>&1 | head -20`
Expected: Build starts without CSS parse errors.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: replace color tokens with saffron brand system"
```

---

## Task 2: Update Tailwind Config

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Add brand colors and font families to tailwind config**

In `tailwind.config.js`, add inside `theme.extend.colors`:

```js
brand: {
  50: '#FFF8F0',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F97316',
  600: '#EA580C',
  700: '#C2410C',
  800: '#9A3412',
  900: '#7C2D12',
},
neutral: {
  0: '#FFFFFF',
  50: '#FAFAF9',
  100: '#F5F5F4',
  200: '#E7E5E4',
  300: '#D6D3D1',
  400: '#A8A29E',
  500: '#78716C',
  600: '#57534E',
  700: '#44403C',
  800: '#292524',
  900: '#1C1917',
},
sacred: {
  gold: '#B8860B',
  'gold-light': '#FEF9C3',
},
```

Add inside `theme.extend.fontFamily`:

```js
'noto-devanagari': ['"Noto Serif Devanagari"', 'serif'],
'noto-tamil': ['"Noto Sans Tamil"', 'sans-serif'],
```

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.js
git commit -m "feat: add saffron brand palette and Noto fonts to tailwind"
```

---

## Task 3: i18n Foundation — next-intl Setup

**Files:**
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `middleware.ts`
- Create: `messages/en.json`
- Create: `messages/ta.json`
- Create: `messages/hi.json`

- [ ] **Step 1: Create i18n/routing.ts**

```typescript
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ta', 'en', 'hi'],
  defaultLocale: 'ta',
})
```

- [ ] **Step 2: Create i18n/request.ts**

```typescript
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 3: Create middleware.ts**

```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(ta|en|hi)/:path*'],
}
```

- [ ] **Step 4: Create messages/en.json**

```json
{
  "home": {
    "logoTitle": "Dhivyuga",
    "logoSubtitle": "Sacred Mantra Search",
    "searchPlaceholder": "Search mantras, deities, categories..."
  },
  "search": {
    "resultsFor": "results for",
    "noResults": "No mantras found",
    "noResultsHint": "Try a different search term or browse categories",
    "views": "views",
    "allFilter": "All"
  },
  "mantra": {
    "backToResults": "Back to results",
    "deity": "Deity",
    "bestTime": "Best Time",
    "recitationCount": "Recitation Count",
    "auspiciousPeriod": "Auspicious Period",
    "meaning": "Meaning & Significance",
    "benefits": "Benefits",
    "howToChant": "How to Chant",
    "listen": "Listen",
    "copy": "Copy",
    "share": "Share",
    "close": "Close"
  },
  "language": {
    "en": "English",
    "ta": "Tamil",
    "hi": "Hindi"
  }
}
```

- [ ] **Step 5: Create messages/ta.json**

```json
{
  "home": {
    "logoTitle": "திவ்யுகா",
    "logoSubtitle": "புனித மந்திர தேடல்",
    "searchPlaceholder": "மந்திரங்கள், தெய்வங்கள், வகைகள் தேடுக..."
  },
  "search": {
    "resultsFor": "முடிவுகள்",
    "noResults": "மந்திரங்கள் கிடைக்கவில்லை",
    "noResultsHint": "வேறு சொல்லைத் தேடுக அல்லது வகைகளை உலாவுக",
    "views": "பார்வைகள்",
    "allFilter": "அனைத்தும்"
  },
  "mantra": {
    "backToResults": "முடிவுகளுக்குத் திரும்பு",
    "deity": "தெய்வம்",
    "bestTime": "சிறந்த நேரம்",
    "recitationCount": "ஜெப எண்ணிக்கை",
    "auspiciousPeriod": "சுப காலம்",
    "meaning": "பொருள் & முக்கியத்துவம்",
    "benefits": "பலன்கள்",
    "howToChant": "எவ்வாறு ஜபிக்க வேண்டும்",
    "listen": "கேளுங்கள்",
    "copy": "நகலெடு",
    "share": "பகிர்",
    "close": "மூடு"
  },
  "language": {
    "en": "English",
    "ta": "தமிழ்",
    "hi": "हिंदी"
  }
}
```

- [ ] **Step 6: Create messages/hi.json**

```json
{
  "home": {
    "logoTitle": "दिव्युगा",
    "logoSubtitle": "पवित्र मंत्र खोज",
    "searchPlaceholder": "मंत्र, देवता, श्रेणियाँ खोजें..."
  },
  "search": {
    "resultsFor": "परिणाम",
    "noResults": "कोई मंत्र नहीं मिला",
    "noResultsHint": "कोई अन्य शब्द खोजें या श्रेणियाँ ब्राउज़ करें",
    "views": "दृश्य",
    "allFilter": "सभी"
  },
  "mantra": {
    "backToResults": "परिणामों पर वापस जाएँ",
    "deity": "देवता",
    "bestTime": "सर्वोत्तम समय",
    "recitationCount": "जप संख्या",
    "auspiciousPeriod": "शुभ काल",
    "meaning": "अर्थ और महत्व",
    "benefits": "लाभ",
    "howToChant": "जप कैसे करें",
    "listen": "सुनें",
    "copy": "कॉपी",
    "share": "साझा करें",
    "close": "बंद करें"
  },
  "language": {
    "en": "English",
    "ta": "தமிழ்",
    "hi": "हिंदी"
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add i18n/ middleware.ts messages/
git commit -m "feat: add next-intl i18n foundation with 3 locales"
```

---

## Task 4: Locale Layout — app/[locale]/layout.tsx

**Files:**
- Create: `app/[locale]/layout.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create app/[locale]/layout.tsx**

```tsx
import { NextIntlClientProvider, useMessages } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { AuthProvider } from '@/contexts/auth-context'
import { CSSPreloader } from '@/components/css-preloader'

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = useMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CSSPreloader />
      <AuthProvider>
        {children}
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
```

- [ ] **Step 2: Update app/layout.tsx to be a bare shell**

Replace the content of `app/layout.tsx` with a minimal root layout that just provides the HTML shell with fonts. The locale-specific providers move into `app/[locale]/layout.tsx`:

```tsx
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = {
  title: 'திவ்யுகா (Dhivyuga) - Sacred Mantra Search Engine',
  description: 'Discover and explore sacred mantras for spiritual growth, prosperity, and well-being.',
  keywords: 'mantras, spiritual, meditation, hinduism, sanskrit, திவ்யுகா, दिव्युगा, dhivyuga',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx app/\[locale\]/layout.tsx
git commit -m "feat: add locale layout with NextIntlClientProvider"
```

---

## Task 5: Language Switcher — Compact Pill Style

**Files:**
- Modify: `components/language-switcher.tsx`

- [ ] **Step 1: Rewrite language-switcher.tsx as a compact pill**

Replace the entire file. This version works both inside the search bar and in the results header:

```tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const locales = [
  { code: 'ta', label: 'TA', name: 'தமிழ்' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'HI', name: 'हिंदी' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const current = locales.find(l => l.code === locale) || locales[0]

  const handleChange = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-full hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-150 cursor-pointer whitespace-nowrap">
          {current.label}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => handleChange(l.code)}
            className={`cursor-pointer ${locale === l.code ? 'bg-brand-50 text-brand-700 font-semibold' : ''}`}
          >
            <span className="font-medium mr-2">{l.label}</span>
            <span className="text-xs text-neutral-500">{l.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/language-switcher.tsx
git commit -m "feat: restyle language switcher as compact pill"
```

---

## Task 6: Search Bar — Pill Style with Language Switcher

**Files:**
- Modify: `components/search-bar.tsx`

- [ ] **Step 1: Rewrite search-bar.tsx with pill shape and lang switcher**

Replace the entire file with a pill-shaped search bar that includes the language switcher on the right side and autocomplete dropdown. Keep the existing autocomplete logic but restyle everything:

```tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { LanguageSwitcher } from '@/components/language-switcher'

interface Suggestion {
  text: string
  type: 'mantra' | 'deity' | 'category'
}

const typeIcons: Record<string, string> = {
  mantra: '🕉️',
  deity: '🙏',
  category: '📿',
}

export function SearchBar({ defaultValue = '', showLangSwitcher = true }: { defaultValue?: string; showLangSwitcher?: boolean }) {
  const [query, setQuery] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('home')

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return }
    try {
      const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setSuggestions(data.suggestions || [])
      setShowSuggestions(true)
    } catch { setSuggestions([]) }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, fetchSuggestions])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (searchQuery?: string) => {
    const q = searchQuery || query
    if (q.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(q.trim())}`)
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSubmit(suggestions[selectedIndex].text)
      } else {
        handleSubmit()
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={containerRef} className="w-full max-w-[640px] relative" role="search">
      <div className="flex items-center gap-3 bg-white border-[1.5px] border-neutral-200 rounded-full px-5 py-3 shadow-[var(--shadow-search)] transition-all duration-250 hover:border-neutral-300 hover:shadow-md focus-within:border-brand-400 focus-within:shadow-[var(--shadow-search-focus)]">
        <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIndex(-1) }}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={t('searchPlaceholder')}
          className="flex-1 bg-transparent border-none outline-none text-base text-neutral-800 placeholder:text-neutral-400 min-w-0 font-sans"
          aria-label={t('searchPlaceholder')}
          autoComplete="off"
        />
        {showLangSwitcher && <LanguageSwitcher />}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden z-50">
          {suggestions.map((s, i) => (
            <button
              key={`${s.type}-${s.text}`}
              onClick={() => handleSubmit(s.text)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                i === selectedIndex ? 'bg-neutral-50' : 'hover:bg-neutral-50'
              }`}
            >
              <span className="text-sm">{typeIcons[s.type]}</span>
              <span className="text-sm text-neutral-800 flex-1">{s.text}</span>
              <span className="text-[10px] font-medium text-neutral-400 uppercase">{s.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/search-bar.tsx
git commit -m "feat: restyle search bar as pill with language switcher"
```

---

## Task 7: Filter Chips Component

**Files:**
- Create: `components/filter-chips.tsx`

- [ ] **Step 1: Create filter-chips.tsx**

```tsx
'use client'

import { useTranslations } from 'next-intl'

interface FilterChipsProps {
  categories: { id: string; name: string }[]
  activeFilter: string
  onFilterChange: (id: string) => void
}

export function FilterChips({ categories, activeFilter, onFilterChange }: FilterChipsProps) {
  const t = useTranslations('search')

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onFilterChange('')}
        className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-all duration-150 ${
          activeFilter === ''
            ? 'border-brand-400 text-brand-700 bg-brand-50'
            : 'border-neutral-200 text-neutral-600 bg-white hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50'
        }`}
      >
        {t('allFilter')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onFilterChange(cat.id)}
          className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-all duration-150 ${
            activeFilter === cat.id
              ? 'border-brand-400 text-brand-700 bg-brand-50'
              : 'border-neutral-200 text-neutral-600 bg-white hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/filter-chips.tsx
git commit -m "feat: add filter chips component"
```

---

## Task 8: Search Result Item Component

**Files:**
- Create: `components/search-result-item.tsx`

- [ ] **Step 1: Create search-result-item.tsx**

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { Eye } from 'lucide-react'

interface SearchResultItemProps {
  id: string
  title: string
  text: string
  deityName?: string
  categoryName?: string
  timeName?: string
  countValue?: number
  viewCount: number
  onClick: (id: string) => void
}

export function SearchResultItem({
  id, title, text, deityName, categoryName, timeName, countValue, viewCount, onClick,
}: SearchResultItemProps) {
  const t = useTranslations('search')

  const snippet = text.length > 160 ? text.substring(0, 160) + '...' : text

  return (
    <button
      onClick={() => onClick(id)}
      className="w-full flex items-start gap-4 py-5 border-b border-neutral-100 cursor-pointer text-left transition-all duration-150 hover:bg-white hover:-mx-4 hover:px-4 hover:rounded-xl group"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-neutral-900 leading-snug mb-1 group-hover:text-brand-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">{snippet}</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {deityName && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-brand-50 text-brand-700">
              {deityName}
            </span>
          )}
          {categoryName && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
              {categoryName}
            </span>
          )}
          {timeName && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
              {timeName}{countValue ? ` · ${countValue}×` : ''}
            </span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1 text-xs text-neutral-400">
        <Eye className="w-3.5 h-3.5" />
        {viewCount}
      </div>
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/search-result-item.tsx
git commit -m "feat: add compact search result item component"
```

---

## Task 9: Sacred Text Block + Details Grid Components

**Files:**
- Create: `components/sacred-text-block.tsx`
- Create: `components/details-grid.tsx`

- [ ] **Step 1: Create sacred-text-block.tsx**

```tsx
interface SacredTextBlockProps {
  text: string
  transliteration?: string
}

export function SacredTextBlock({ text, transliteration }: SacredTextBlockProps) {
  return (
    <div className="relative bg-gradient-to-br from-sacred-gold-light to-orange-50 border border-amber-200 rounded-xl px-10 py-6 text-center mb-6">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-sacred-gold opacity-40 select-none">॥</span>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-sacred-gold opacity-40 select-none">॥</span>
      <p className="text-xl font-semibold text-neutral-900 leading-relaxed font-noto-tamil">
        {text}
      </p>
      {transliteration && (
        <p className="text-sm text-neutral-500 mt-3 italic tracking-wide">
          {transliteration}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create details-grid.tsx**

```tsx
'use client'

import { useTranslations } from 'next-intl'

interface DetailsGridProps {
  deity?: string
  bestTime?: string
  recitationCount?: string
  auspiciousPeriod?: string
  isAuspicious?: boolean
}

export function DetailsGrid({ deity, bestTime, recitationCount, auspiciousPeriod, isAuspicious }: DetailsGridProps) {
  const t = useTranslations('mantra')

  const items = [
    { label: t('deity'), value: deity },
    { label: t('bestTime'), value: bestTime },
    { label: t('recitationCount'), value: recitationCount },
    { label: t('auspiciousPeriod'), value: auspiciousPeriod, isGreen: isAuspicious },
  ].filter(item => item.value)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      {items.map((item) => (
        <div key={item.label} className="bg-neutral-50 border border-neutral-100 rounded-lg p-4">
          <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            {item.label}
          </div>
          <div className={`text-sm font-semibold ${item.isGreen ? 'text-green-600' : 'text-neutral-800'}`}>
            {item.value}{item.isGreen ? ' ✓' : ''}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sacred-text-block.tsx components/details-grid.tsx
git commit -m "feat: add sacred text block and details grid components"
```

---

## Task 10: Language Tabs Component

**Files:**
- Create: `components/language-tabs.tsx`

- [ ] **Step 1: Create language-tabs.tsx**

```tsx
'use client'

interface LanguageTab {
  code: string
  name: string
  nativeName: string
}

interface LanguageTabsProps {
  languages: LanguageTab[]
  activeCode: string
  onTabChange: (code: string) => void
}

export function LanguageTabs({ languages, activeCode, onTabChange }: LanguageTabsProps) {
  return (
    <div className="flex border-b border-neutral-200 mb-6 overflow-x-auto" role="tablist">
      {languages.map((lang) => (
        <button
          key={lang.code}
          role="tab"
          aria-selected={activeCode === lang.code}
          onClick={() => onTabChange(lang.code)}
          className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150 ${
            activeCode === lang.code
              ? 'text-brand-700 border-brand-500 font-semibold'
              : 'text-neutral-500 border-transparent hover:text-neutral-700'
          }`}
        >
          {lang.nativeName} ({lang.name})
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/language-tabs.tsx
git commit -m "feat: add language tabs component for content switching"
```

---

## Task 11: Mantra Content Component

**Files:**
- Create: `components/mantra-content.tsx`

- [ ] **Step 1: Create mantra-content.tsx**

This is the inner body of the mantra overlay — sacred text, details grid, meaning, benefits, how to chant:

```tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SacredTextBlock } from '@/components/sacred-text-block'
import { DetailsGrid } from '@/components/details-grid'
import { LanguageTabs } from '@/components/language-tabs'

interface Translation {
  id: string
  language_id: string
  text: string
  transliteration?: string
  pronunciation_guide?: string
  meaning?: string
  benefits?: string
  usage_notes?: string
  languages?: {
    id: string
    code: string
    name: string
    native_name: string
    direction?: string
    sort_order?: number
  }
}

interface MantraContentProps {
  mantra: {
    id: string
    title: string
    text: string
    view_count: number
    deities?: { id: string; name: string; description?: string } | null
    categories?: { id: string; name: string; description?: string } | null
    recitation_counts?: { id: string; count_value: number; description?: string } | null
    recitation_times?: { id: string; name: string; description?: string } | null
    kalams?: { id: string; name: string; description?: string; is_auspicious?: boolean } | null
    time_ranges?: { id: string; start_time: string; end_time: string } | null
    translations?: Translation[]
  }
}

export function MantraContent({ mantra }: MantraContentProps) {
  const t = useTranslations('mantra')
  const translations = mantra.translations || []

  const availableLanguages = translations
    .filter(tr => tr.languages)
    .map(tr => ({
      code: tr.languages!.code,
      name: tr.languages!.name,
      nativeName: tr.languages!.native_name,
    }))

  const [activeLang, setActiveLang] = useState(
    availableLanguages.find(l => l.code === 'ta')?.code || availableLanguages[0]?.code || ''
  )

  const activeTranslation = translations.find(tr => tr.languages?.code === activeLang)

  const bestTime = mantra.recitation_times
    ? `${mantra.recitation_times.name}${mantra.time_ranges ? ` (${mantra.time_ranges.start_time} – ${mantra.time_ranges.end_time})` : ''}`
    : undefined

  const recitationCount = mantra.recitation_counts
    ? `${mantra.recitation_counts.count_value} times${mantra.recitation_counts.description ? ` (${mantra.recitation_counts.description})` : ''}`
    : undefined

  // Parse benefits — could be JSON string array or plain text
  let benefitsList: string[] = []
  if (activeTranslation?.benefits) {
    try {
      const parsed = JSON.parse(activeTranslation.benefits)
      benefitsList = Array.isArray(parsed) ? parsed : [activeTranslation.benefits]
    } catch {
      benefitsList = activeTranslation.benefits.split('\n').filter(Boolean)
    }
  }

  return (
    <div className="max-w-[720px] mx-auto px-6 py-8 pb-16">
      {/* Hero */}
      <div className="text-center pb-6 border-b border-neutral-100 mb-6">
        <h1 className="text-2xl md:text-[31px] font-bold text-neutral-900 tracking-tight leading-tight mb-3">
          {mantra.title}
        </h1>
        <div className="flex gap-2 justify-center flex-wrap">
          {mantra.deities && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-brand-50 text-brand-700">
              {mantra.deities.name}
            </span>
          )}
          {mantra.categories && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700">
              {mantra.categories.name}
            </span>
          )}
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 text-neutral-600">
            {mantra.view_count} {t('views') || 'views'}
          </span>
        </div>
      </div>

      {/* Language Tabs */}
      {availableLanguages.length > 0 && (
        <LanguageTabs
          languages={availableLanguages}
          activeCode={activeLang}
          onTabChange={setActiveLang}
        />
      )}

      {/* Sacred Text */}
      <SacredTextBlock
        text={activeTranslation?.text || mantra.text}
        transliteration={activeTranslation?.transliteration}
      />

      {/* Details Grid */}
      <DetailsGrid
        deity={mantra.deities?.name}
        bestTime={bestTime}
        recitationCount={recitationCount}
        auspiciousPeriod={mantra.kalams?.name}
        isAuspicious={mantra.kalams?.is_auspicious}
      />

      {/* Meaning */}
      {activeTranslation?.meaning && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide pb-2 border-b border-neutral-100 mb-3">
            {t('meaning')}
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">{activeTranslation.meaning}</p>
        </section>
      )}

      {/* Benefits */}
      {benefitsList.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide pb-2 border-b border-neutral-100 mb-3">
            {t('benefits')}
          </h2>
          <ul className="flex flex-col gap-2">
            {benefitsList.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0 mt-[7px]" />
                {benefit}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* How to Chant */}
      {activeTranslation?.usage_notes && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide pb-2 border-b border-neutral-100 mb-3">
            {t('howToChant')}
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">{activeTranslation.usage_notes}</p>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/mantra-content.tsx
git commit -m "feat: add mantra content component with language switching"
```

---

## Task 12: Mantra Overlay — Full-Screen with Animation

**Files:**
- Create: `components/mantra-overlay.tsx`

- [ ] **Step 1: Create mantra-overlay.tsx**

```tsx
'use client'

import { useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Volume2, Copy, Share2, X } from 'lucide-react'
import { MantraContent } from '@/components/mantra-content'

interface MantraOverlayProps {
  mantra: any | null
  isOpen: boolean
  onClose: () => void
}

export function MantraOverlay({ mantra, isOpen, onClose }: MantraOverlayProps) {
  const t = useTranslations('mantra')

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  const handleSpeak = () => {
    if (!mantra?.title) return
    const utterance = new SpeechSynthesisUtterance(mantra.title)
    speechSynthesis.speak(utterance)
  }

  const handleCopy = async () => {
    if (!mantra?.text) return
    await navigator.clipboard.writeText(mantra.text)
  }

  const handleShare = async () => {
    if (!navigator.share || !mantra) return
    try {
      await navigator.share({ title: mantra.title, text: mantra.text, url: window.location.href })
    } catch {}
  }

  return (
    <AnimatePresence>
      {isOpen && mantra && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-white overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={mantra.title}
        >
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 px-2 py-1 rounded-lg transition-all"
            >
              <ChevronLeft className="w-[18px] h-[18px]" />
              {t('backToResults')}
            </button>
            <div className="flex gap-1">
              <button onClick={handleSpeak} title={t('listen')} className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <Volume2 className="w-[18px] h-[18px]" />
              </button>
              <button onClick={handleCopy} title={t('copy')} className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <Copy className="w-[18px] h-[18px]" />
              </button>
              <button onClick={handleShare} title={t('share')} className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <Share2 className="w-[18px] h-[18px]" />
              </button>
              <button onClick={onClose} title={t('close')} className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <MantraContent mantra={mantra} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/mantra-overlay.tsx
git commit -m "feat: add full-screen mantra overlay with slide animation"
```

---

## Task 13: Search Hero — Homepage Component

**Files:**
- Create: `components/search-hero.tsx`

- [ ] **Step 1: Create search-hero.tsx**

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { SearchBar } from '@/components/search-bar'

interface SearchHeroProps {
  categories?: { id: string; name: string }[]
  showChips?: boolean
}

export function SearchHero({ categories = [], showChips = true }: SearchHeroProps) {
  const t = useTranslations('home')

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 relative overflow-hidden bg-gradient-to-b from-white to-brand-50">
      {/* Subtle radial accent */}
      <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-gradient-radial from-brand-500/[0.04] to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl md:text-[49px] font-bold text-neutral-900 tracking-tight leading-none font-noto-devanagari">
          {t('logoTitle')}
        </h1>
        <p className="text-sm font-medium text-neutral-500 uppercase tracking-[0.15em] mt-2">
          {t('logoSubtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex justify-center"
      >
        <SearchBar showLangSwitcher={true} />
      </motion.div>

      {showChips && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-2 mt-6 flex-wrap justify-center"
        >
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`search?category=${cat.id}`}
              className="px-4 py-1 rounded-full text-sm font-medium border border-neutral-200 text-neutral-600 bg-white hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-all duration-150"
            >
              {cat.name}
            </a>
          ))}
        </motion.div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/search-hero.tsx
git commit -m "feat: add search hero homepage component"
```

---

## Task 14: Homepage — app/[locale]/page.tsx

**Files:**
- Create: `app/[locale]/page.tsx`

- [ ] **Step 1: Create app/[locale]/page.tsx**

```tsx
import { SearchHero } from '@/components/search-hero'
import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite'

export default async function HomePage() {
  let categories: { id: string; name: string }[] = []
  let showChips = true

  try {
    // Fetch site settings
    const settingsResult = await databases.listDocuments(DATABASE_ID, 'site_settings', [
      Query.limit(1),
    ]).catch(() => null)

    if (settingsResult?.documents?.[0]) {
      showChips = settingsResult.documents[0].show_category_chips ?? true
    }

    // Fetch categories for chips
    if (showChips) {
      const catResult = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CATEGORIES, [
        Query.equal('is_active', true),
        Query.orderAsc('name'),
        Query.limit(10),
      ])
      categories = catResult.documents.map(d => ({ id: d.$id, name: d.name }))
    }
  } catch (error) {
    console.error('Homepage fetch error:', error)
  }

  return <SearchHero categories={categories} showChips={showChips} />
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\[locale\]/page.tsx
git commit -m "feat: add locale homepage with search hero"
```

---

## Task 15: Search Results Page — app/[locale]/search/page.tsx

**Files:**
- Create: `app/[locale]/search/page.tsx`

- [ ] **Step 1: Create app/[locale]/search/page.tsx**

```tsx
'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { SearchBar } from '@/components/search-bar'
import { FilterChips } from '@/components/filter-chips'
import { SearchResultItem } from '@/components/search-result-item'
import { MantraOverlay } from '@/components/mantra-overlay'
import { LanguageSwitcher } from '@/components/language-switcher'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('search')

  const query = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''
  const mantraParam = searchParams.get('mantra') || ''

  const [mantras, setMantras] = useState<any[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [activeFilter, setActiveFilter] = useState(categoryParam)
  const [loading, setLoading] = useState(true)
  const [selectedMantra, setSelectedMantra] = useState<any | null>(null)
  const [overlayOpen, setOverlayOpen] = useState(false)

  // Fetch search results
  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (activeFilter) params.set('category', activeFilter)
      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      setMantras(data.mantras || [])
    } catch {
      setMantras([])
    } finally {
      setLoading(false)
    }
  }, [query, activeFilter])

  // Fetch categories for filter chips
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => { fetchResults() }, [fetchResults])

  // Open overlay if mantra param present
  useEffect(() => {
    if (mantraParam) {
      fetch(`/api/mantras/${mantraParam}`)
        .then(r => r.json())
        .then(d => { setSelectedMantra(d.mantra); setOverlayOpen(true) })
        .catch(() => {})
    }
  }, [mantraParam])

  // Handle browser back
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      if (!params.get('mantra')) {
        setOverlayOpen(false)
        setSelectedMantra(null)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleResultClick = async (id: string) => {
    try {
      const res = await fetch(`/api/mantras/${id}`)
      const data = await res.json()
      setSelectedMantra(data.mantra)
      setOverlayOpen(true)
      const url = new URL(window.location.href)
      url.searchParams.set('mantra', id)
      window.history.pushState({}, '', url.toString())
    } catch {}
  }

  const handleOverlayClose = () => {
    setOverlayOpen(false)
    setSelectedMantra(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('mantra')
    window.history.pushState({}, '', url.toString())
  }

  const handleFilterChange = (id: string) => {
    setActiveFilter(id)
    const url = new URL(window.location.href)
    if (id) url.searchParams.set('category', id)
    else url.searchParams.delete('category')
    url.searchParams.delete('mantra')
    window.history.replaceState({}, '', url.toString())
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3 bg-white border-b border-neutral-100">
        <a href={`/${locale}`} className="text-lg font-bold text-neutral-900 font-noto-devanagari flex-shrink-0">
          திவ்யுகா
        </a>
        <div className="flex-1 max-w-[580px]">
          <SearchBar defaultValue={query} showLangSwitcher={false} />
        </div>
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-6 py-3 bg-white border-b border-neutral-100">
        <FilterChips categories={categories} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </div>

      {/* Results meta */}
      {!loading && (
        <div className="px-6 py-3 text-xs text-neutral-500">
          {mantras.length} {t('resultsFor')} {query ? `"${query}"` : ''}
        </div>
      )}

      {/* Results list */}
      <div className="px-6 max-w-[800px]">
        {loading ? (
          <div className="py-12 text-center text-neutral-400 text-sm">Loading...</div>
        ) : mantras.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-base font-semibold text-neutral-900 mb-2">{t('noResults')}</h3>
            <p className="text-sm text-neutral-500">{t('noResultsHint')}</p>
          </div>
        ) : (
          mantras.map((m) => (
            <SearchResultItem
              key={m.id}
              id={m.id}
              title={m.title}
              text={m.text}
              deityName={m.deities?.name}
              categoryName={m.categories?.name}
              timeName={m.recitation_times?.name}
              countValue={m.recitation_counts?.count_value}
              viewCount={m.view_count || 0}
              onClick={handleResultClick}
            />
          ))
        )}
      </div>

      {/* Mantra Overlay */}
      <MantraOverlay mantra={selectedMantra} isOpen={overlayOpen} onClose={handleOverlayClose} />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center text-neutral-400">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\[locale\]/search/page.tsx
git commit -m "feat: add search results page with overlay integration"
```

---

## Task 16: Site Settings — Appwrite Collection + Admin UI

**Files:**
- Modify: `lib/appwrite.ts`
- Modify: `scripts/setup-appwrite.ts`

- [ ] **Step 1: Add SITE_SETTINGS to COLLECTIONS in lib/appwrite.ts**

In `lib/appwrite.ts`, add to the `COLLECTIONS` object:

```typescript
SITE_SETTINGS: 'site_settings',
```

- [ ] **Step 2: Add site_settings collection to setup script**

In `scripts/setup-appwrite.ts`, add after the languages collection setup (before `seedData()`):

```typescript
// --- site_settings ---
await createCollection('site_settings', 'Site Settings')
await createBoolAttr('site_settings', 'show_category_chips', false, true)
await createBoolAttr('site_settings', 'show_trending', false, false)
await createBoolAttr('site_settings', 'show_deity_grid', false, false)
await createBoolAttr('site_settings', 'show_category_grid', false, false)
await sleep(2000)
```

And in `seedData()`, add:

```typescript
// Site Settings (default document)
await databases.createDocument(DB_ID, 'site_settings', 'default', {
  show_category_chips: true,
  show_trending: false,
  show_deity_grid: false,
  show_category_grid: false,
})
console.log('Site settings seeded')
```

- [ ] **Step 3: Commit**

```bash
git add lib/appwrite.ts scripts/setup-appwrite.ts
git commit -m "feat: add site_settings collection for admin-configurable homepage"
```

---

## Task 17: SEO Fallback — /mantra/[id] Redirect

**Files:**
- Modify: `app/mantra/[id]/page.tsx`

- [ ] **Step 1: Replace mantra detail page with redirect to overlay**

Replace the entire content of `app/mantra/[id]/page.tsx` with a redirect that opens the search page with the overlay:

```tsx
import { redirect } from 'next/navigation'

export default async function MantraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/ta/search?mantra=${id}`)
}
```

- [ ] **Step 2: Commit**

```bash
git add app/mantra/\[id\]/page.tsx
git commit -m "feat: redirect /mantra/[id] to overlay for SEO fallback"
```

---

## Task 18: Update next.config.js for i18n

**Files:**
- Modify: `next.config.js`

- [ ] **Step 1: Check if next.config.js needs i18n plugin**

Read `next.config.js`. If it doesn't already have the `next-intl` plugin, add the `createNextIntlPlugin` wrapper:

```js
const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
}

module.exports = withNextIntl(nextConfig)
```

Keep all existing config options (images, trailingSlash, webpack, etc.) — just wrap the export with `withNextIntl()`.

- [ ] **Step 2: Commit**

```bash
git add next.config.js
git commit -m "feat: add next-intl plugin to next.config.js"
```

---

## Task 19: Verify Full Build

- [ ] **Step 1: Run the build**

```bash
npm run build 2>&1 | tail -30
```

Expected: Build succeeds. There may be warnings about unused components (mantra-card, trending-mantras, etc.) but no errors.

- [ ] **Step 2: Run the dev server and test**

```bash
npm run dev
```

Test checklist:
1. Visit `http://localhost:3000` — should redirect to `/ta/`
2. Homepage shows Tamil logo + search bar + category chips
3. Type "ganesha" in search → autocomplete suggestions appear
4. Submit search → navigate to `/ta/search?q=ganesha`
5. Results show as compact list with deity/category tags
6. Click a result → full-screen overlay slides up
7. Language tabs in overlay switch content
8. Click "Back to results" or press Escape → overlay closes
9. Switch language to EN via switcher → URL changes to `/en/search?q=ganesha`, UI labels change to English
10. Visit `/mantra/[any-id]` → redirects to `/ta/search?mantra=[id]` with overlay open

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build issues from frontend redesign"
```

---

## Summary

| Task | Component | Files |
|------|-----------|-------|
| 1 | Brand tokens | `globals.css` |
| 2 | Tailwind config | `tailwind.config.js` |
| 3 | i18n foundation | `i18n/`, `middleware.ts`, `messages/` |
| 4 | Locale layout | `app/[locale]/layout.tsx`, `app/layout.tsx` |
| 5 | Language switcher | `components/language-switcher.tsx` |
| 6 | Search bar | `components/search-bar.tsx` |
| 7 | Filter chips | `components/filter-chips.tsx` |
| 8 | Result item | `components/search-result-item.tsx` |
| 9 | Sacred text + grid | `components/sacred-text-block.tsx`, `components/details-grid.tsx` |
| 10 | Language tabs | `components/language-tabs.tsx` |
| 11 | Mantra content | `components/mantra-content.tsx` |
| 12 | Mantra overlay | `components/mantra-overlay.tsx` |
| 13 | Search hero | `components/search-hero.tsx` |
| 14 | Homepage | `app/[locale]/page.tsx` |
| 15 | Search page | `app/[locale]/search/page.tsx` |
| 16 | Site settings | `lib/appwrite.ts`, `scripts/setup-appwrite.ts` |
| 17 | SEO redirect | `app/mantra/[id]/page.tsx` |
| 18 | Next config | `next.config.js` |
| 19 | Build verify | Full build + manual test |
