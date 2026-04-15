# Dhivyuga — Full QA/QC Audit Report & Fix Plan

> Comprehensive end-to-end audit covering API routes, frontend components, i18n, config, admin, accessibility, performance, and security.

---

## Audit Summary

| Severity | Count |
|----------|-------|
| Critical | 7 |
| High | 13 |
| Medium | 16 |
| Low | 8 |
| **Total** | **44 issues** |

---

## All Issues Found

### CRITICAL (7)

| # | Area | File | Issue |
|---|------|------|-------|
| C-1 | Security | `.env.example` | **Live API key committed to source control.** Real Appwrite API key and project ID in `.env.example`. Must rotate key immediately. |
| C-2 | Security | `api/create-admin/route.ts` | **Public endpoint with hardcoded default password** (`dhivyuga2025`). No auth guard. Anyone can create admin users. |
| C-3 | Security | All write API routes | **No authentication on write operations.** POST/PUT/DELETE on categories, languages, translations have zero auth checks. |
| C-4 | Security | `api/seed-grahas/route.ts` | **Public seeding endpoint.** Anyone can POST and insert data. Fragile duplicate guard. |
| C-5 | Accessibility | `app/layout.tsx:18` | **`lang="en"` hardcoded** on `<html>` tag. Screen readers always report English regardless of locale. WCAG 3.1.1 failure. |
| C-6 | UX | `mantra-overlay.tsx:35` | **`speechSynthesis` not guarded.** Crashes in Firefox private mode. No cleanup on overlay close (audio keeps playing). |
| C-7 | UX | `mantra-overlay.tsx:40` | **`navigator.clipboard` fails silently.** No user feedback on copy success/failure. No HTTPS fallback. |

### HIGH (13)

| # | Area | File | Issue |
|---|------|------|-------|
| H-1 | Performance | `api/search/route.ts` | **N+1 query pattern.** Per-mantra translation fetch + per-translation language fetch = 80+ DB calls for 20 results. |
| H-2 | Data | `api/mantras/[id]/view/route.ts` | **Race condition on view count.** Read-modify-write loses increments under concurrent requests. |
| H-3 | Security | `api/search`, `api/autocomplete` | **`limit` param not validated.** No max cap. `limit=5000` causes massive DB load. NaN not handled. |
| H-4 | Performance | `api/mantras/[id]/route.ts` | **Sequential `getRelatedDoc` in loop** for related mantras. Should use `Promise.all` + pre-built map. |
| H-5 | State | `[locale]/search/page.tsx:47` | **Race condition in fetch.** No AbortController. Stale results can overwrite newer ones. |
| H-6 | i18n | `[locale]/search/page.tsx:150` | **Results count text is broken for non-English locales.** String concatenation instead of interpolated translation key. |
| H-7 | Accessibility | `search-bar.tsx:102` | **No ARIA roles on autocomplete.** Missing `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `role="listbox"`. |
| H-8 | Accessibility | `mantra-overlay.tsx:54` | **No focus trap in modal.** Focus escapes to content behind overlay. Focus not restored on close. |
| H-9 | Routing | `search-hero.tsx:58` | **Category chip `href` is relative** (`search?category=...`). Will break under nested routes. Missing locale prefix. |
| H-10 | Performance | `mantra-content.tsx:10` | **All 4 locale JSON files statically imported.** Every user downloads all 4 languages. Bundle bloat. |
| H-11 | Security | `admin/deities/page.tsx`, `admin/settings/page.tsx` | **Missing `AuthGuard`** on these admin pages. Unauthenticated access possible. |
| H-12 | Routing | `app/about/`, `app/contact/`, `app/terms/`, `app/search/` | **Static pages outside `[locale]` tree.** Bypass i18n middleware. No locale context. |
| H-13 | Config | `package.json` | **`eslint-config-next@14.2.5` vs `next@^15.5.2`.** Major version mismatch. |

### MEDIUM (16)

| # | Area | File | Issue |
|---|------|------|-------|
| M-1 | Architecture | `lib/appwrite.ts` | **Browser SDK used for server-side API routes.** Should use `node-appwrite` for routes. |
| M-2 | i18n | `middleware.ts:7` | **Matcher doesn't cover non-locale paths** (`/about`, `/contact`, etc.). |
| M-3 | Data | `api/mantras/[id]/translations` | **Inconsistent `languages` shape** between detail and translation endpoints. Missing `sort_order`. |
| M-4 | Data | `api/seed-grahas/route.ts` | **Grahas inserted into deities collection.** Fragile name-based existence check. |
| M-5 | Data | `api/search/route.ts` | **`Query.search` + `Query.equal` combo may fail** in some Appwrite versions. |
| M-6 | Security | `api/create-admin/route.ts:40` | **Raw Appwrite error messages leaked to client.** Exposes internal details. |
| M-7 | Config | `tailwind.config.js` | **Spacing keys depend on CSS variables** that may not all be defined. |
| M-8 | Config | `next.config.js` | **`images.unoptimized: true` in production** for server mode. `assetPrefix` is a no-op. |
| M-9 | State | `search-bar.tsx:22` | **`defaultValue` desync.** `useState(defaultValue)` doesn't update on prop change. |
| M-10 | UX | `language-switcher.tsx:27` | **Locale switch drops query params.** Search context lost when switching language. |
| M-11 | i18n | `messages/ta.json:64` | **Mixed Devanagari+Tamil script** in `language.sa` value. |
| M-12 | Architecture | `[locale]/layout.tsx`, `admin/layout.tsx` | **Two separate `AuthProvider` roots.** Won't share auth state. |
| M-13 | Accessibility | `filter-chips.tsx:16` | **Missing `aria-pressed`** on active filter buttons. |
| M-14 | Accessibility | `language-tabs.tsx:16` | **Incomplete tab widget.** Missing `aria-label`, `role="tabpanel"`. |
| M-15 | Accessibility | `sacred-text-block.tsx:9` | **Decorative `॥` symbols read by screen readers.** Missing `aria-hidden`. |
| M-16 | Accessibility | `search-result-item.tsx:50` | **View count icon has no accessible label.** |

### LOW (8)

| # | Area | File | Issue |
|---|------|------|-------|
| L-1 | Types | Multiple API routes | **Widespread `any` types.** No typed interfaces for Appwrite documents. |
| L-2 | Error | `lib/appwrite.ts:33` | **`getRelatedDoc` silently swallows all errors** including infra failures. No logging. |
| L-3 | Dead code | `components/trending-mantras.tsx` + 3 others | **Dead component files.** Never imported. |
| L-4 | Dead code | `components/mantra-card.tsx` | **Only used by deprecated `app/search/page.tsx`.** |
| L-5 | Config | `tsconfig.json` | **`lib` missing `esnext`** alongside `target: "es5"`. |
| L-6 | Config | `app/layout.tsx:9` | **`metadata.keywords` is string, should be array.** |
| L-7 | Bug | `mantra-overlay.tsx:35` | **`handleSpeak` speaks `mantra.title` not `mantra.text`** (user expects mantra recitation). |
| L-8 | UX | `app/contact/page.tsx` | **Contact form is fake.** Simulates success but sends nothing. |

---

## Fix Plan — Phases

### Phase 1: Security & Credentials (URGENT)
> **Priority:** Do this first. These are production-blocking.

| Task | Files | Effort |
|------|-------|--------|
| 1.1 Sanitize `.env.example` — replace real keys with placeholders | `.env.example` | 5 min |
| 1.2 Rotate Appwrite API key in console (old one is leaked) | Appwrite Console | 5 min |
| 1.3 Protect `create-admin` route — require secret header, remove hardcoded password | `api/create-admin/route.ts` | 15 min |
| 1.4 Protect `seed-grahas` route — require secret header or delete | `api/seed-grahas/route.ts` | 10 min |
| 1.5 Add `AuthGuard` to deities and settings admin pages | `admin/deities/page.tsx`, `admin/settings/page.tsx` | 10 min |
| 1.6 Create `lib/appwrite-server.ts` with `node-appwrite` + API key for all API routes | `lib/appwrite-server.ts`, all `api/` routes | 30 min |
| 1.7 Add auth check to write API routes (categories POST, languages POST, translations CRUD) | 3 API route files | 20 min |
| 1.8 Sanitize error messages in `create-admin` route | `api/create-admin/route.ts` | 5 min |

**Total: ~1.5 hours**

---

### Phase 2: i18n & Routing Fixes
> **Priority:** Fixes broken language switching and routing issues.

| Task | Files | Effort |
|------|-------|--------|
| 2.1 Fix `<html lang>` — move `<html>`/`<body>` into `app/[locale]/layout.tsx` with dynamic `lang={locale}` | `app/layout.tsx`, `app/[locale]/layout.tsx` | 20 min |
| 2.2 Remove hard redirect from `app/page.tsx`, let next-intl middleware handle locale detection | `app/page.tsx`, `i18n/routing.ts` | 10 min |
| 2.3 Move static pages (`about`, `contact`, `terms`) under `app/[locale]/` | 3 page files | 20 min |
| 2.4 Delete deprecated `app/search/page.tsx` (replaced by `app/[locale]/search/page.tsx`) | `app/search/page.tsx` | 5 min |
| 2.5 Expand middleware matcher to cover all non-asset routes | `middleware.ts` | 10 min |
| 2.6 Fix language switcher to preserve query params when switching locale | `components/language-switcher.tsx` | 10 min |
| 2.7 Fix results count text — use single interpolated translation key with `{count}` and `{query}` | All 4 `messages/*.json`, `search/page.tsx` | 15 min |
| 2.8 Fix category chip href to use absolute locale path | `components/search-hero.tsx` | 5 min |
| 2.9 Fix mixed script in `ta.json` — `language.sa` should be fully Tamil | `messages/ta.json` | 2 min |
| 2.10 Fix `search-bar.tsx` `defaultValue` desync — add `useEffect` to sync prop | `components/search-bar.tsx` | 5 min |

**Total: ~1.5 hours**

---

### Phase 3: Accessibility (WCAG 2.1 AA)
> **Priority:** Fixes screen reader and keyboard issues.

| Task | Files | Effort |
|------|-------|--------|
| 3.1 Add ARIA combobox pattern to search bar — `role="combobox"`, `aria-expanded`, `role="listbox"`, `role="option"` | `components/search-bar.tsx` | 20 min |
| 3.2 Add focus trap to mantra overlay — use `focus-trap-react` or manual implementation | `components/mantra-overlay.tsx` | 20 min |
| 3.3 Restore focus to trigger element on overlay close | `components/mantra-overlay.tsx` | 10 min |
| 3.4 Add `aria-pressed` to filter chip buttons | `components/filter-chips.tsx` | 5 min |
| 3.5 Add `aria-label` to tablist, associate tabpanel with active tab | `components/language-tabs.tsx`, `components/mantra-content.tsx` | 15 min |
| 3.6 Add `aria-hidden="true"` to decorative `॥` symbols | `components/sacred-text-block.tsx` | 2 min |
| 3.7 Add accessible label to view count and eye icon | `components/search-result-item.tsx` | 5 min |
| 3.8 Guard `speechSynthesis` with feature detection, add cleanup on overlay close | `components/mantra-overlay.tsx` | 10 min |
| 3.9 Add copy feedback (checkmark icon) and try/catch on clipboard API | `components/mantra-overlay.tsx` | 10 min |
| 3.10 Fix `handleSpeak` to speak `mantra.text` not `mantra.title` | `components/mantra-overlay.tsx` | 2 min |

**Total: ~1.5 hours**

---

### Phase 4: Performance & API Optimization
> **Priority:** Fixes N+1 queries, race conditions, and bundle size.

| Task | Files | Effort |
|------|-------|--------|
| 4.1 Validate and cap `limit` param in search and autocomplete APIs | `api/search/route.ts`, `api/autocomplete/route.ts` | 10 min |
| 4.2 Batch-fetch translations in search API — fetch all languages once, build map, join in memory | `api/search/route.ts` | 30 min |
| 4.3 Batch-fetch related mantra deities/categories with `Promise.all` instead of sequential loop | `api/mantras/[id]/route.ts` | 15 min |
| 4.4 Add AbortController to search page fetch — cancel stale requests | `app/[locale]/search/page.tsx` | 15 min |
| 4.5 Replace static message imports in `mantra-content.tsx` with dynamic label passing from parent or `useTranslations` per active tab | `components/mantra-content.tsx` | 20 min |
| 4.6 Document view count race condition as known limitation (or implement server-side queue) | `api/mantras/[id]/view/route.ts` | 5 min |

**Total: ~1.5 hours**

---

### Phase 5: Code Cleanup & Config
> **Priority:** Removes dead code, fixes config issues.

| Task | Files | Effort |
|------|-------|--------|
| 5.1 Delete dead components — `trending-mantras.tsx`, `deity-grid.tsx`, `category-grid.tsx`, `quick-filters.tsx`, `mantra-card.tsx` | 5 component files | 5 min |
| 5.2 Remove `CSSPreloader` component (anti-pattern, no effect in production) | `components/css-preloader.tsx`, `app/[locale]/layout.tsx` | 5 min |
| 5.3 Update `eslint-config-next` to `^15.0.0` | `package.json` | 5 min |
| 5.4 Fix `metadata.keywords` to be `string[]` | `app/layout.tsx` | 2 min |
| 5.5 Add `esnext` to `tsconfig.json` `lib` array | `tsconfig.json` | 2 min |
| 5.6 Fix `next.config.js` — remove no-op `assetPrefix`, fix `images.unoptimized` | `next.config.js` | 5 min |
| 5.7 Add consistent TypeScript interfaces for Appwrite documents (replace `any` types) | `lib/types.ts`, API routes | 30 min |
| 5.8 Add error logging to `getRelatedDoc` instead of silent swallow | `lib/appwrite.ts` | 5 min |
| 5.9 Fix contact form — either wire to Appwrite Function or add "coming soon" notice | `app/contact/page.tsx` | 15 min |

**Total: ~1.5 hours**

---

## Phase Summary

| Phase | Focus | Issues Fixed | Effort |
|-------|-------|-------------|--------|
| **Phase 1** | Security & Credentials | 10 (all Critical + auth) | ~1.5 hrs |
| **Phase 2** | i18n & Routing | 10 (routing, locale, translations) | ~1.5 hrs |
| **Phase 3** | Accessibility | 10 (WCAG 2.1 AA compliance) | ~1.5 hrs |
| **Phase 4** | Performance & API | 6 (N+1, race conditions, bundle) | ~1.5 hrs |
| **Phase 5** | Code Cleanup & Config | 9 (dead code, config, types) | ~1.5 hrs |
| **Total** | | **44 issues** | **~7.5 hrs** |

---

*Audit completed: April 15, 2026*
*Project: Dhivyuga — Sacred Mantra Search Engine*
