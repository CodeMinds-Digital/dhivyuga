# Dhivyuga - Mantra Search Engine V1 MVP Requirements

## 🎯 Product Vision
**Dhivyuga** - A divine, modern spiritual search engine for discovering mantras based on deity, category, seed sounds, and purposes. Users can search for mantras with comprehensive recitation guidelines including timing, planetary periods, and view detailed spiritual information.

## 🎨 Brand & Design Identity

### Brand Name & Concept
- **Name**: Dhivyuga (Divine + Modern Spiritual Aura)
- **Concept**: Sacred geometry meets modern search technology
- **Feel**: Devotional, elegant, accessible

### Color Palette (Dhivyuga Brand)
- **Background (Light Mode)**: `#F9FAFB` (soft off-white)
- **Background (Dark Mode)**: `#0F172A` (deep indigo/black)
- **Primary (Brand)**: `#6D28D9` (royal purple → divine, spiritual)
- **Secondary (Support)**: `#2563EB` (calm sky blue → wisdom, devotion)
- **Accent**: `#FACC15` (golden → prosperity, light)
- **Neutral Text (Light)**: `#111827` (dark gray for readability)
- **Neutral Text (Dark)**: `#E5E7EB` (light gray for readability)
- **Success**: `#16A34A` (green → growth, blessings)
- **Danger**: `#DC2626` (red → warning, avoid confusion)

### Typography & UI Elements
- **Headings**: Elegant serif fonts (brand identity)
- **Body Text**: Clean sans-serif (readability)
- **Layout**: Minimal with sacred geometry hints
- **Background**: Subtle mandala/chakra patterns
- **Cards**: Rounded with soft glow effects
- **Accessibility**: WCAG contrast-friendly

## 🚀 V1 MVP Scope

### Core Features (Must Have)
1. **Mantra Database** - Store and manage mantra data
2. **Search Functionality** - Full-text search with basic filtering
3. **Search Interface** - Clean, Google-like search experience
4. **Mantra Detail Pages** - Comprehensive mantra information
5. **View Tracking** - Basic analytics for popular mantras
6. **Admin Panel** - CRUD operations for mantras

### Out of Scope for V1
- User experiences/reviews
- User authentication (except admin)
- Advanced analytics
- Mobile app
- Social features
- Audio/video content

## 📊 Data Model

### Supabase Database Schema (Aligned with Design.md)

#### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Deities Table
```sql
CREATE TABLE deities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Recitation Counts Table
```sql
CREATE TABLE recitation_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  count_value INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Recitation Times Table
```sql
CREATE TABLE recitation_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- Morning, Noon, Evening, Brahma Muhurta
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Kalams Table (Planetary Periods)
```sql
CREATE TABLE kalams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- Rahu Kālam, Yama Kālam, Gulika, Surya Hora, Chandra Hora
  planet VARCHAR(50), -- Surya, Chandra, Rahu, Yama, Gulika, etc.
  description TEXT,
  is_auspicious BOOLEAN DEFAULT true, -- false for avoid periods
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Time Ranges Table
```sql
CREATE TABLE time_ranges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time TIME NOT NULL, -- 03:30:00
  end_time TIME NOT NULL,   -- 05:30:00
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Main Mantras Table
```sql
CREATE TABLE mantras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  text TEXT NOT NULL, -- The actual mantra text
  category_id UUID REFERENCES categories(id),
  deity_id UUID REFERENCES deities(id),
  count_id UUID REFERENCES recitation_counts(id),
  time_id UUID REFERENCES recitation_times(id),
  kalam_id UUID REFERENCES kalams(id),
  range_id UUID REFERENCES time_ranges(id),
  view_count INTEGER DEFAULT 0,
  search_vector tsvector, -- For full-text search
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX mantras_search_idx ON mantras USING GIN(search_vector);

-- Update search vector trigger
CREATE OR REPLACE FUNCTION update_mantra_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.text, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mantras_search_vector_update
  BEFORE INSERT OR UPDATE ON mantras
  FOR EACH ROW EXECUTE FUNCTION update_mantra_search_vector();
```

### View Tracking Entity
```
- id (UUID, Primary Key)
- mantra_id (UUID, Foreign Key)
- ip_address (String) // For basic uniqueness
- viewed_at (Timestamp)
```

## 🔍 Search Requirements

### Search Implementation (PostgreSQL Full-Text)

#### Search Capabilities
- **PostgreSQL full-text search** across title, mantra text, deity names, category names
- **ts_rank_cd ranking** with view_count boost for popularity
- **Autocomplete** with prefix matching
- **Advanced filtering** by:
  - Category (dropdown selection)
  - Deity (dropdown selection)
  - Recitation Time (Morning, Noon, Evening, Brahma Muhurta)
  - Kalam/Planetary Period (auspicious vs avoid periods)
- **Highlight query matches** in search results

#### Search API Endpoints
```typescript
// Main search with PostgreSQL full-text
GET /api/search?q={query}&category={id}&deity={id}&time={id}&kalam={id}

// Autocomplete suggestions
GET /api/autocomplete?q={query}&limit={limit}

// Increment view counter (unique per visitor/day)
POST /api/mantras/{id}/view

// Get filter options for dropdowns
GET /api/filters
```

#### Search Query Example
```sql
SELECT m.*, c.name as category_name, d.name as deity_name,
       ts_rank_cd(m.search_vector, plainto_tsquery('english', $1)) as rank
FROM mantras m
LEFT JOIN categories c ON m.category_id = c.id
LEFT JOIN deities d ON m.deity_id = d.id
WHERE m.search_vector @@ plainto_tsquery('english', $1)
ORDER BY rank DESC, m.view_count DESC
LIMIT $2;
```

## 🎨 Frontend Pages

### 1. Home Page (`/`) - Search Engine Style
- **Hero Section**:
  - Centered **Dhivyuga** logo with spiritual typography
  - Large search bar with placeholder: *"Search by deity, category, seed sound, purpose..."*
  - Subtle mandala/chakra background patterns
- **Quick Filter Chips**: Wealth, Protection, Health, Wisdom (royal purple with golden accents)
- **Trending Mantras**: Top 6 most viewed mantras (card-based with soft glow)
- **Sacred Geometry**: Subtle geometric patterns in background
- **Color Scheme**: Deep indigo background with golden accents

### 2. Search Results Page (`/search?q={query}`)
- **Search Bar**: Persistent at top with current query highlighted
- **Filters Sidebar** (Dhivyuga styled):
  - Category dropdown (purple theme)
  - Deity dropdown with spiritual icons
  - Recitation Time filters (Morning, Noon, Evening, Brahma Muhurta)
  - Kalam/Planetary Period filters (auspicious vs avoid)
- **Results Cards**:
  - Mantra title with **highlighted query matches**
  - Deity name with spiritual iconography
  - Category tags (golden accent chips)
  - Purpose snippet
  - View counter with spiritual numbering
- **Responsive Design**: TailwindCSS + shadcn/ui components

### 3. Mantra Detail Page (`/mantra/{id}`)
- **Header**:
  - Mantra title (elegant serif typography)
  - Deity name with spiritual imagery
  - **View counter** (increments on page open, unique per visitor/day)
- **Mantra Text**: Large, readable Sanskrit/transliteration
- **Comprehensive Recitation Guidelines**:
  - **Recitation Count**: Assigned count with significance
  - **Recitation Time**: Best times (Morning/Noon/Evening/Brahma Muhurta)
  - **Kalam/Planetary Periods**: Show auspicious periods, warn about avoid times
  - **Exact Time Ranges**: Specific times (e.g., 3:30–5:30 AM, 11:45–12:15 PM)
- **Meaning/Guide**: Step-by-step practice instructions
- **Related Mantras**: Same deity or category suggestions
- **Sacred Design**: Card-based layout with soft glows and spiritual aesthetics

### 4. Admin Panel (`/admin`) - Supabase Auth Protected
- **Authentication**: Supabase email/password login
- **Dashboard**: Analytics overview with spiritual-themed charts
- **CRUD Operations**:
  - **Mantras**: Create/edit with dropdown selections from all modules
  - **Categories**: Manage spiritual categories
  - **Deities**: Manage deity database
  - **Recitation Counts**: Manage count values and significance
  - **Recitation Times**: Manage time periods
  - **Kalams**: Manage planetary periods (auspicious/avoid)
  - **Time Ranges**: Manage exact time specifications
- **Content Curation**: Approve and organize spiritual content
- **Dhivyuga Admin Theme**: Consistent with brand colors and spiritual aesthetics

## 🛠 Technical Stack

### Technical Stack (Aligned with Design.md)

#### Backend
- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Search**: PostgreSQL full-text search with tsvector/GIN indexes
- **API**: Next.js API routes
- **Authentication**: Supabase email/password auth (admin only)

#### Frontend
- **Framework**: Next.js 14 with React
- **Styling**: TailwindCSS with Dhivyuga color palette
- **UI Components**: shadcn/ui (as specified in design.md)
- **Typography**: Elegant serif for headings, clean sans-serif for body
- **Responsive**: Mobile-first design with sacred geometry hints

#### Infrastructure
- **Hosting**: Vercel (seamless Next.js deployment)
- **Database**: Supabase (PostgreSQL with real-time features)
- **Authentication**: Supabase Auth
- **Search**: No external search service - pure PostgreSQL

#### Design Implementation
- **Color Variables**: CSS custom properties for Dhivyuga palette
- **Sacred Geometry**: Subtle mandala/chakra SVG backgrounds
- **Accessibility**: WCAG contrast compliance
- **Performance**: Optimized for spiritual content discovery

## 📋 Development Phases

### Phase 1: Foundation & Modules (Week 1)
- [ ] Set up Next.js project with Tailwind CSS
- [ ] Configure Supabase database
- [ ] Create all module tables (Categories, Deities, Recitation Counts, etc.)
- [ ] Create mantra data model with relationships
- [ ] Seed all modules with initial data
- [ ] Create basic admin interface for module management

### Phase 2: Core Search (Week 2)
- [ ] Implement search API with PostgreSQL full-text search
- [ ] Build autocomplete functionality
- [ ] Create home page with search bar and category chips
- [ ] Implement search results page with modular filters
- [ ] Add deity browsing functionality

### Phase 3: Mantra Details & Guidelines (Week 3)
- [ ] Build mantra detail page with recitation guidelines
- [ ] Implement view tracking
- [ ] Add related mantras functionality (by deity/category)
- [ ] Create trending mantras section
- [ ] Display time ranges and kalam periods

### Phase 4: Admin & Polish (Week 4)
- [ ] Build admin authentication
- [ ] Create comprehensive admin CRUD interface
- [ ] Implement modular mantra creation form
- [ ] Add analytics dashboard
- [ ] Polish UI/UX and responsive design
- [ ] Testing and bug fixes

## 🎯 Success Metrics for V1

### User Engagement
- **Search Success Rate**: >80% of searches return relevant results
- **Page Views**: Average 3+ pages per session
- **Time on Mantra Page**: >2 minutes average

### Content Metrics
- **Database**: 50+ mantras at launch
- **Module Coverage**: All major deities and categories covered
- **Recitation Guidelines**: 80% of mantras have complete recitation info
- **View Distribution**: No single mantra dominates >30% of views

### Technical Performance
- **Search Speed**: <500ms response time
- **Page Load**: <2s for all pages
- **Uptime**: >99% availability

## 🚀 Launch Strategy

### Pre-Launch
- Seed database with high-quality mantras
- Test with 5-10 beta users
- Optimize search relevance

### Launch
- Soft launch to spiritual communities
- Gather user feedback
- Monitor search patterns and popular mantras

### Post-Launch (V1.1)
- Add user experience sharing
- Implement user favorites
- Enhanced search filters
- Mobile optimization

## 📝 Content Strategy

### Initial Module Data

#### Categories (10-12 items)
- Wealth & Prosperity
- Protection & Safety
- Health & Healing
- Wisdom & Knowledge
- Love & Relationships
- Success & Achievement
- Peace & Calm
- Spiritual Growth
- Obstacle Removal
- Good Fortune

#### Deities (15-20 items)
- Ganesha (Obstacle Remover)
- Lakshmi (Wealth & Prosperity)
- Saraswati (Wisdom & Knowledge)
- Hanuman (Protection & Strength)
- Shiva (Transformation)
- Vishnu (Preservation)
- Devi/Durga (Divine Mother)
- Krishna (Love & Joy)
- Rama (Righteousness)
- Kali (Fierce Protection)

#### Recitation Counts (8-10 items)
- 11 times (Quick daily practice)
- 21 times (Standard practice)
- 51 times (Moderate practice)
- 108 times (Full mala)
- 1008 times (Special occasions)
- 10,008 times (Major spiritual work)

#### Recitation Times (6-8 items)
- Brahma Muhurta (3:30-5:30 AM)
- Morning (6:00-9:00 AM)
- Noon (11:30 AM-12:30 PM)
- Evening (6:00-8:00 PM)
- Night (8:00-10:00 PM)
- Anytime (flexible)

#### Kalam/Planetary Periods (8-10 items)
- Rahu Kalam (avoid)
- Yama Kalam (avoid)
- Gulika Kalam (avoid)
- Surya Hora (auspicious)
- Chandra Hora (auspicious)
- Guru Hora (very auspicious)
- Shukra Hora (auspicious)

### Initial Mantra Collection (50+ mantras)
- **Ganesha Mantras**: 8-10 variations with obstacle removal focus
- **Lakshmi Mantras**: 6-8 for wealth/prosperity with specific counts
- **Saraswati Mantras**: 5-6 for wisdom/knowledge with morning times
- **Hanuman Mantras**: 6-8 for protection/strength with evening times
- **Shiva Mantras**: 8-10 variations with transformation focus
- **Universal Mantras**: Om, Gayatri, Maha Mantra with flexible timing

### Content Quality Standards
- Accurate Sanskrit transliteration
- Clear category associations
- Complete recitation guidelines (count, time, periods)
- Step-by-step practice guides
- Proper deity associations
- Avoid/recommended time periods clearly marked

---

*This MVP focuses on core search functionality while maintaining simplicity and quality. Future versions can expand with user-generated content, advanced features, and mobile apps.*
