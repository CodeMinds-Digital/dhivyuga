# Dhivyuga - Deep Feature & CRUD Analysis

> Complete inventory of all features, CRUD operations, API endpoints, database tables, and backend (Supabase) touchpoints before Appwrite migration.

---

## 1. Database Schema: 11 Tables

### 1.1 categories

| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | Nullable |
| is_active | BOOLEAN | Default true |
| created_at | TIMESTAMPTZ | Default NOW() |

**Relationships:** has_many mantras
**Seed Data:** 10 records - Wealth, Protection, Health, Wisdom, Love, Success, Peace, Spiritual Growth, Obstacle Removal, Good Fortune

### 1.2 deities

| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | Nullable |
| sanskrit_name | VARCHAR | For Grahas |
| day_of_week | VARCHAR | For Grahas |
| color | VARCHAR | For Grahas |
| gemstone | VARCHAR | For Grahas |
| metal | VARCHAR | For Grahas |
| element | VARCHAR | For Grahas |
| direction | VARCHAR | For Grahas |
| is_active | BOOLEAN | Default true |
| created_at | TIMESTAMPTZ | Default NOW() |

**Relationships:** has_many mantras
**Seed Data:** 10 deities (Ganesha, Lakshmi, Saraswati, Hanuman, Shiva, Vishnu, Devi, Krishna, Rama, Kali) + 9 Grahas (Surya, Chandra, Mangal, Budh, Guru, Shukra, Shani, Rahu, Ketu)

### 1.3 recitation_counts

| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| count_value | INTEGER | NOT NULL |
| description | TEXT | Nullable |
| created_at | TIMESTAMPTZ | Default NOW() |

**Relationships:** has_many mantras
**Seed Data:** 6 records - 11, 27, 54, 108, 1008, 10008

### 1.4 recitation_times

| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | Nullable |
| created_at | TIMESTAMPTZ | Default NOW() |

**Relationships:** has_many mantras
**Seed Data:** 4 records - Morning, Noon, Evening, Brahma Muhurta

### 1.5 kalams

| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| name | VARCHAR(255) | NOT NULL |
| planet | VARCHAR(100) | Nullable |
| description | TEXT | Nullable |
| is_auspicious | BOOLEAN | Default true |
| created_at | TIMESTAMPTZ | Default NOW() |

**Relationships:** has_many mantras
**Seed Data:** 7 records - Rahu Kalam, Yama Kalam, Gulika Kalam (inauspicious); Surya Hora, Chandra Hora, Guru Hora, Shukra Hora (auspicious)

### 1.6 time_ranges

| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| start_time | TIME | NOT NULL |
| end_time | TIME | NOT NULL |
| description | TEXT | Nullable |
| created_at | TIMESTAMPTZ | Default NOW() |

**Relationships:** has_many mantras
**Seed Data:** 4 records - 3:30-5:30 AM (Brahma Muhurta), 6:00-9:00 AM (Morning), 11:30-12:30 PM (Noon), 6:00-8:00 PM (Evening)

### 1.7 mantras (Core Entity)

| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| title | VARCHAR(500) | NOT NULL |
| text | TEXT | NOT NULL |
| category_id | UUID (FK) | References categories |
| deity_id | UUID (FK) | References deities |
| count_id | UUID (FK) | References recitation_counts |
| time_id | UUID (FK) | References recitation_times |
| kalam_id | UUID (FK) | References kalams |
| range_id | UUID (FK) | References time_ranges |
| view_count | INTEGER | Default 0 |
| search_vector | tsvector | Full-text search index |
| created_at | TIMESTAMPTZ | Default NOW() |

**Relationships:** belongs_to category, deity, count, time, kalam, range; has_many descriptions, translations
**Seed Data:** 2+ sample mantras (Om Gam Ganapataye Namaha, Om Shreem Mahalakshmiyei Namaha)

### 1.8 mantra_descriptions

| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| mantra_id | UUID (FK) | References mantras, ON DELETE CASCADE |
| meaning | TEXT | NOT NULL |
| transliteration | TEXT | Nullable |
| pronunciation_guide | TEXT | Nullable |
| benefits | TEXT[] | Array of benefits |
| historical_context | TEXT | Nullable |
| spiritual_significance | TEXT | Nullable |
| usage_instructions | TEXT | Nullable |
| precautions | TEXT | Nullable |
| related_scriptures | TEXT[] | Array of scripture references |
| created_at | TIMESTAMPTZ | Default NOW() |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

**Relationships:** belongs_to mantra

### 1.9 mantra_translations

| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| mantra_id | UUID (FK) | References mantras |
| language_id | UUID (FK) | References languages |
| text | TEXT | NOT NULL |
| transliteration | TEXT | Nullable |
| pronunciation_guide | TEXT | Nullable |
| meaning | TEXT | Nullable |
| benefits | TEXT[] | Array |
| usage_notes | TEXT | Nullable |
| created_at | TIMESTAMPTZ | Default NOW() |
| updated_at | TIMESTAMPTZ | Default NOW() |

**Relationships:** belongs_to mantra, language

### 1.10 languages

| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| code | VARCHAR | e.g., en, hi, ta, sa |
| name | VARCHAR | e.g., English, Hindi |
| native_name | VARCHAR | e.g., Tamil, Hindi |
| direction | VARCHAR | ltr or rtl |
| sort_order | INTEGER | Display ordering |
| is_active | BOOLEAN | Default true |
| created_at | TIMESTAMPTZ | Default NOW() |
| updated_at | TIMESTAMPTZ | Default NOW() |

**Relationships:** has_many translations
**Seed Data:** English, Hindi, Tamil, Sanskrit

### 1.11 auth.users (Supabase Auth)

| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Supabase managed |
| email | VARCHAR | Admin email |
| password | HASHED | Supabase managed |
| user_metadata | JSONB | { role: 'admin', name: 'Dhivyuga Admin' } |

**Seed Data:** 1 admin user (admin@dhivyuga.com)

---

## 2. PostgreSQL-Specific Features

- **tsvector** column on mantras for full-text search
- **GIN index** on search_vector for fast text search
- **3 Database Triggers:**
  1. `mantras_search_vector_update` - Auto-updates search_vector on mantra insert/update
  2. `mantra_descriptions_updated_at` - Auto-updates updated_at timestamp
  3. `mantra_descriptions_search_update` - Propagates description changes to mantra search_vector
- **5 Indexes:**
  1. `mantras_search_idx` (GIN on search_vector)
  2. `idx_mantras_view_count` (DESC on view_count)
  3. `idx_mantras_created_at` (DESC on created_at)
  4. `idx_mantra_descriptions_mantra_id` (on mantra_id FK)
  5. `idx_mantra_descriptions_updated_at` (DESC on updated_at)

---

## 3. API Routes: 17 Endpoints

### 3.1 Search & Discovery

| # | Route | Method | Purpose | Tables |
|---|-------|--------|---------|--------|
| 1 | `/api/search` | GET | Full-text search + multi-filter | mantras + 6 joins |
| 2 | `/api/autocomplete` | GET | Prefix-match suggestions (ILIKE) | mantras, deities, categories |
| 3 | `/api/filters` | GET | All filter dropdown options | categories, deities, recitation_times, kalams |

### 3.2 Mantra Endpoints

| # | Route | Method | Purpose | Tables |
|---|-------|--------|---------|--------|
| 4 | `/api/mantras/trending` | GET | Top 6 by view_count DESC | mantras + deities, categories |
| 5 | `/api/mantras/[id]` | GET | Full detail + translations + related | mantras + 7 joins + translations + related |
| 6 | `/api/mantras/[id]/view` | POST | Increment view counter | mantras (select + update) |
| 7 | `/api/mantras/[id]/translations` | GET | List translations | mantra_translations + languages |
| 8 | `/api/mantras/[id]/translations` | POST | Create translation | mantra_translations |
| 9 | `/api/mantras/[id]/translations` | PUT | Update translation | mantra_translations |
| 10 | `/api/mantras/[id]/translations` | DELETE | Delete translation | mantra_translations |

### 3.3 Reference Data

| # | Route | Method | Purpose | Tables |
|---|-------|--------|---------|--------|
| 11 | `/api/categories` | GET | List active categories | categories |
| 12 | `/api/categories` | POST | Create category | categories |
| 13 | `/api/deities` | GET | List active deities | deities |
| 14 | `/api/languages` | GET | List active languages | languages |
| 15 | `/api/languages` | POST | Create language | languages |

### 3.4 Admin & Seeding

| # | Route | Method | Purpose | Tables |
|---|-------|--------|---------|--------|
| 16 | `/api/seed-grahas` | POST | Seed 9 planetary deities (idempotent) | deities |
| 17 | `/api/create-admin` | POST | Create admin user account | auth.users |

---

## 4. CRUD Operations by Entity

### 4.1 Mantras

| Operation | Location | Method |
|-----------|----------|--------|
| Create | Admin `/admin/mantras` | Direct Supabase `insert()` client-side |
| Read (list) | Admin `/admin/mantras` | Direct Supabase `select()` with joins client-side |
| Read (detail) | Public `/mantra/[id]` | API route `/api/mantras/[id]` |
| Read (trending) | Home page | API route `/api/mantras/trending` |
| Read (search) | Search page | API route `/api/search` |
| Update | Admin `/admin/mantras` | Direct Supabase `update()` client-side |
| Delete | Admin `/admin/mantras` | Direct Supabase `delete()` client-side |
| View count++ | Public detail page | API route `/api/mantras/[id]/view` |

### 4.2 Categories

| Operation | Location | Method |
|-----------|----------|--------|
| Create | Admin `/admin/categories` | Direct Supabase `insert()` client-side |
| Read | Admin + Public (home, filters) | Client-side + API `/api/categories` |
| Update | Admin `/admin/categories` | Direct Supabase `update()` client-side |
| Delete | Admin `/admin/categories` | Direct Supabase `delete()` client-side |

### 4.3 Deities

| Operation | Location | Method |
|-----------|----------|--------|
| Create | Admin `/admin/deities` | Direct Supabase `insert()` client-side |
| Read | Admin + Public (home, filters, grahas) | Client-side + API `/api/deities` |
| Update | Admin (incl. toggle active) | Direct Supabase `update()` client-side |
| Delete | Admin `/admin/deities` | Direct Supabase `delete()` client-side |

### 4.4 Mantra Translations

| Operation | Location | Method |
|-----------|----------|--------|
| Create | Admin LanguageManager | API POST `/api/mantras/[id]/translations` |
| Read | Admin + Public detail | API GET `/api/mantras/[id]/translations` |
| Update | Admin LanguageManager | API PUT `/api/mantras/[id]/translations` |
| Delete | Admin LanguageManager | API DELETE `/api/mantras/[id]/translations` |

### 4.5 Settings (4 sub-entities from `/admin/settings`)

| Entity | C | R | U | D | Method |
|--------|---|---|---|---|--------|
| Recitation Times | Yes | Yes | Yes | Yes | Direct Supabase client-side |
| Recitation Counts | Yes | Yes | Yes | Yes | Direct Supabase client-side |
| Kalams | Yes | Yes | Yes | Yes | Direct Supabase client-side |
| Time Ranges | Yes | Yes | Yes | Yes | Direct Supabase client-side |

### 4.6 Languages

| Operation | Location | Method |
|-----------|----------|--------|
| Create | API only | POST `/api/languages` |
| Read | Admin LanguageManager | GET `/api/languages` |

### 4.7 Authentication

| Operation | Location | Method |
|-----------|----------|--------|
| Create admin | Setup page `/admin/setup` | API POST `/api/create-admin` (Supabase Admin Auth) |
| Login | `/admin/login` | `supabase.auth.signInWithPassword()` |
| Logout | Admin sidebar | `supabase.auth.signOut()` |
| Session check | AuthGuard component | `supabase.auth.getSession()` + `onAuthStateChange` |

---

## 5. Public-Facing Features

| # | Feature | Page/Component | Data Source | Browser API |
|---|---------|---------------|-------------|-------------|
| 1 | Full-text search | `/search` + SearchBar | `/api/search` (tsvector) | - |
| 2 | Autocomplete suggestions | SearchBar | `/api/autocomplete` (ILIKE prefix) | - |
| 3 | Quick filter chips | QuickFilters | Hardcoded (Wealth, Protection, Health, Wisdom) | - |
| 4 | Advanced filtering | SearchFilters sidebar | `/api/filters` | - |
| 5 | Trending mantras | TrendingMantras | `/api/mantras/trending` | - |
| 6 | Browse by category | CategoryGrid | `/api/categories` | - |
| 7 | Browse by deity | DeityGrid | `/api/deities` | - |
| 8 | Mantra detail view | `/mantra/[id]` | `/api/mantras/[id]` | - |
| 9 | Multi-language translations | MantraDisplay | Embedded in mantra detail | - |
| 10 | Text-to-Speech | MantraCard + MantraDisplay | - | Web Speech API |
| 11 | Share mantra | MantraCard + MantraDisplay | - | Navigator.share API |
| 12 | Copy to clipboard | MantraDisplay | - | Clipboard API |
| 13 | View counter | Mantra detail page | `/api/mantras/[id]/view` | - |
| 14 | Navagraha planetary info | `/grahas` | Direct Supabase query | - |
| 15 | Contact form | `/contact` | Simulated (no backend) | - |
| 16 | About page | `/about` | Static content | - |
| 17 | Terms page | `/terms` | Static content | - |

---

## 6. Admin Features

| # | Feature | Page | Key Components |
|---|---------|------|----------------|
| 1 | Dashboard with stats | `/admin` | DashboardCards, DataTable |
| 2 | Mantra CRUD + translations | `/admin/mantras` | Dialog, Tabs, LanguageManager, WysiwygEditor |
| 3 | Category CRUD | `/admin/categories` | Card grid, Dialog, Framer Motion |
| 4 | Deity CRUD + toggle active | `/admin/deities` | Card grid, Dialog, Framer Motion |
| 5 | Settings CRUD (4 tables) | `/admin/settings` | 4 Tabs, Tables, Dialog |
| 6 | Analytics dashboard | `/admin/analytics` | Metric cards, top mantras, progress bars |
| 7 | Admin login | `/admin/login` | AuthContext, password toggle |
| 8 | Admin setup | `/admin/setup` | Creates initial admin user |
| 9 | Sidebar navigation | All admin pages | AdminLayout, responsive menu |
| 10 | Auth protection | All admin pages | AuthGuard component |

---

## 7. Supabase Touchpoints: 26 Files

| # | File | Usage |
|---|------|-------|
| 1 | `lib/supabase.ts` | Client init + TypeScript types |
| 2 | `contexts/auth-context.tsx` | signInWithPassword, signOut, getSession, onAuthStateChange |
| 3 | `app/api/search/route.ts` | textSearch, select with joins, eq filters |
| 4 | `app/api/autocomplete/route.ts` | ilike prefix queries on 3 tables |
| 5 | `app/api/filters/route.ts` | select from 4 tables |
| 6 | `app/api/mantras/trending/route.ts` | select with joins, order by view_count |
| 7 | `app/api/mantras/[id]/route.ts` | select with 7 joins + translations + related |
| 8 | `app/api/mantras/[id]/view/route.ts` | select + update (increment counter) |
| 9 | `app/api/mantras/[id]/translations/route.ts` | Full CRUD on mantra_translations |
| 10 | `app/api/categories/route.ts` | select + insert |
| 11 | `app/api/deities/route.ts` | select with is_active filter |
| 12 | `app/api/languages/route.ts` | select + insert |
| 13 | `app/api/seed-grahas/route.ts` | ilike check + insert 9 records |
| 14 | `app/api/create-admin/route.ts` | auth.admin.createUser() |
| 15 | `app/admin/page.tsx` | select with counts (dashboard stats) |
| 16 | `app/admin/mantras/page.tsx` | Full CRUD with joins (client-side) |
| 17 | `app/admin/categories/page.tsx` | Full CRUD with mantra count (client-side) |
| 18 | `app/admin/deities/page.tsx` | Full CRUD + toggle active (client-side) |
| 19 | `app/admin/settings/page.tsx` | CRUD on 4 tables (client-side) |
| 20 | `app/admin/analytics/page.tsx` | select for stats |
| 21 | `app/admin/login/page.tsx` | Uses AuthContext (indirect) |
| 22 | `app/admin/setup/page.tsx` | Calls /api/create-admin |
| 23 | `app/grahas/page.tsx` | Direct select + ilike filters |
| 24 | `components/admin/language-manager.tsx` | CRUD on translations + languages |
| 25 | `supabase/schema.sql` | Full DDL + triggers + seed data |
| 26 | `package.json` | @supabase/supabase-js dependency |

---

## 8. Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 15.5.2 (App Router) |
| UI Library | React 18.2.0 |
| Styling | TailwindCSS 3.3.0 + shadcn/ui + Radix UI |
| Animations | Framer Motion 12.23.12 |
| Icons | Lucide React 0.542.0 |
| Forms | React Hook Form 7.47.0 + Zod |
| Rich Text Editor | React Quill New 3.3.0 |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (email/password) |
| Search | PostgreSQL Full-Text Search (tsvector + GIN) |
| Deployment | Netlify (with @netlify/plugin-nextjs) |
| Language | TypeScript 5 |

---

*Document generated: April 15, 2026*
*Project: Dhivyuga - Sacred Mantra Search Engine*
