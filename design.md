Color Palatte 

Got it ✅ — when we’re talking about **UI/UX best palette** (for readability, accessibility, and modern spiritual feel for *Dhivyuga*), we should balance:

* **Contrast** → Clear text on backgrounds
* **Consistency** → Limited core colors (primary, secondary, accent, neutral)
* **Mood** → Calm, spiritual, yet professional (not overly flashy)

---

### 🎨 **Best UI/UX Palette for Dhivyuga**

(optimized for modern design + spiritual feel)

* **Background (light mode):** `#F9FAFB` (soft off-white)

* **Background (dark mode):** `#0F172A` (deep indigo/black)

* **Primary (brand):** `#6D28D9` (royal purple → divine, spiritual)

* **Secondary (support):** `#2563EB` (calm sky blue → wisdom, devotion)

* **Accent:** `#FACC15` (golden → prosperity, light)

* **Neutral Text (light mode):** `#111827` (dark gray for readability)

* **Neutral Text (dark mode):** `#E5E7EB` (light gray for readability)

* **Success (positive states):** `#16A34A` (green → growth, blessings)

* **Danger (alerts):** `#DC2626` (red → warning, avoid confusion)

---

💡 Why this works:

* **Purple + Gold** → strong spiritual identity for Dhivyuga.
* **Blue** → balance + readability (works well in filters, links, buttons).
* **Light/Dark background** → ensures UX works in both modes.
* **Accessibility** → WCAG contrast-friendly.

**Prompt:**

*"Create a Next.js 14 application named **Dhivyuga** with Supabase as the backend. The app should support **Supabase email/password authentication** for admin login. Implement a **search-engine-like homepage** (centered search bar, quick filter chips) and a devotional, modern UI consistent with the Dhivyuga brand.*

**Brand & UI (must-have):**

* Name/Logo: **Dhivyuga** (divine + modern spiritual aura).
* **Color palette:** Deep indigo/royal blue (primary), gold/saffron (secondary), white accents; subtle gradients.
* **Typography:** Elegant serif for headings (brand), clean sans-serif for body.
* **Layout:** Minimal, sacred-geometry hints (subtle mandala/chakra background), card-based results, rounded buttons with soft glow.
* **Components:** TailwindCSS + shadcn/ui. Accessible, responsive.

**Pages:**

* **Home:** Centered search bar with placeholder “Search by deity, category, seed sound, purpose…”. Quick filter chips (Wealth, Protection, Health, Wisdom). Trending mantras (by view\_count).
* **Search Results:** Cards show title, deity, purpose tags/snippet; highlight query matches.
* **Mantra Detail:** Mantra text, meaning/guide, assigned category/deity, **recitation count**, **recitation time(s)** (morning/noon/evening/Brahma Muhurta), **kālam/planetary periods** (Rahu, Gulika, Yama, Surya/Chandra hora), **exact time ranges** (e.g., 3:30–5:30 AM, 11:45–12:15 PM). Related mantras. **View counter** increments on open.
* **Admin:** Email/password login; CRUD for mantras, categories, deities, counts, times, kālams, time ranges. Approve/curate content.

**Database (Supabase) schema:**

* **Categories** (id, name, description)
* **Deities** (id, name, description)
* **RecitationCounts** (id, count\_value, description)
* **RecitationTimes** (id, name, description)  // e.g., Morning, Noon, Evening, Brahma Muhurta
* **Kalams** (id, name, planet, description)    // e.g., Rahu Kālam, Yama Kālam, Gulika; planet can be Surya, Chandra, etc.
* **TimeRanges** (id, start\_time, end\_time, description) // e.g., 03:30–05:30, 11:45–12:15
* **Mantras** (id, title, text, category\_id, deity\_id, count\_id, time\_id, kalam\_id, range\_id, view\_count, created\_at)

**Search (no Meilisearch):**

* Implement **Postgres full-text search** across title, deity, tags/purposes/seed sounds (store as text/arrays).
* Provide `/api/search?q=` and `/api/autocomplete?q=` endpoints.
* Basic ranking via Postgres `ts_rank_cd`; boost exact matches and popular (higher view\_count) results.

**Features:**

* Admin login using Supabase email/password auth.
* Admin panel to create/edit/delete mantras and taxonomy (categories, deities, counts, times, kālams, time ranges).
* Assign a mantra to category, deity, recitation count, recitation time, kālam, and time range.
* Public search page with filters (category, deity, time, kālam).
* **View counter** for each mantra (unique per visitor/day recommended).
* Responsive UI with TailwindCSS and shadcn/ui components.

**Generate:**

* Next.js (App Router) project setup with Supabase client.
* Supabase schema SQL for the tables above (with foreign keys and indexes, including GIN/tsvector for search).
* API routes for CRUD (mantras, categories, deities, counts, times, kālams, time ranges), search, autocomplete, and views.
* Auth-protected admin pages.
* Public pages: Home (search engine style), Search Results, Mantra Detail (with view counter).

**Acceptance criteria:**

* Running `npm run dev` shows the Dhivyuga homepage with the **indigo–gold** theme and centered search.
* Creating taxonomy in Admin allows selecting them when creating a mantra.
* Searching “wealth”, “Gam”, or “Ganapathi” returns relevant results.
* Opening a mantra increments and displays its view counter.
* All pages are responsive and accessible."\*

---

Want me to include a **starter SQL** for the schema and example **search queries** in the same prompt too?
