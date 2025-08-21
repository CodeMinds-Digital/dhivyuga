# 🌱 Dhivyuga Database Seeding

This directory contains scripts to populate your Dhivyuga database with comprehensive spiritual content including categories, deities, and authentic Sanskrit mantras.

## 📋 What Gets Added

### Categories (15 total)
- **Wealth & Prosperity** - Financial abundance and material success
- **Protection & Safety** - Divine protection and safety
- **Health & Healing** - Physical and mental well-being
- **Wisdom & Knowledge** - Learning and spiritual understanding
- **Love & Relationships** - Harmonious relationships and family peace
- **Success & Achievement** - Career growth and accomplishments
- **Peace & Tranquility** - Inner peace and stress relief
- **Spiritual Growth** - Enlightenment and self-realization
- **Obstacle Removal** - Removing barriers and challenges
- **Good Fortune & Luck** - Positive energy and favorable outcomes
- **Devotion & Surrender** - Divine connection and surrender
- **Purification & Cleansing** - Spiritual purification
- **Strength & Courage** - Inner strength and overcoming fears
- **Meditation & Focus** - Concentration and mindfulness
- **Universal Mantras** - Mantras suitable for all purposes

### Deities (20 total)
- **Ganesha** - Remover of obstacles, patron of arts and sciences
- **Lakshmi** - Goddess of wealth, fortune, and prosperity
- **Saraswati** - Goddess of knowledge, music, arts, and wisdom
- **Hanuman** - Symbol of courage, strength, and devotion
- **Shiva** - The transformer, destroyer of evil, lord of meditation
- **Vishnu** - The preserver and protector of the universe
- **Devi Durga** - The divine mother, supreme goddess
- **Krishna** - God of love, compassion, and divine play
- **Rama** - Symbol of righteousness and virtue
- **Kali** - Fierce form of the divine mother
- **Surya** - Sun god, source of light and energy
- **Chandra** - Moon god, ruler of mind and emotions
- And 8 more authentic deities...

### Mantras (25+ total)
Authentic Sanskrit mantras including:
- **Om Gam Ganapataye Namaha** - Most popular Ganesha mantra
- **Om Shreem Mahalakshmiyei Namaha** - Powerful Lakshmi mantra
- **Gayatri Mantra** - Universal mantra for enlightenment
- **Mahamrityunjaya Mantra** - Shiva's healing mantra
- **Hare Krishna Maha Mantra** - Krishna devotion mantra
- **Om Namah Shivaya** - Universal Shiva mantra
- And many more with proper Sanskrit text, transliterations, and meanings

### Additional Data
- **Recitation Counts** - 1, 3, 5, 11, 21, 27, 54, 108, 1008, 10008
- **Recitation Times** - Brahma Muhurta, Morning, Noon, Evening, etc.
- **Kalams** - Auspicious and inauspicious time periods
- **Time Ranges** - Specific time periods for practice

## 🚀 Quick Start

### Method 1: Automated Script (Recommended)

1. **Install dependencies** (if not already installed):
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

2. **Make sure your `.env.local` has Supabase credentials**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   # Optional: SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

3. **Run the seeding script**:
   ```bash
   node scripts/seed-database.js
   ```

### Method 2: Manual SQL Execution

1. **Open your Supabase dashboard**
2. **Go to SQL Editor**
3. **Copy the entire content** of `scripts/seed-mantras.sql`
4. **Paste and run** the SQL

## 📊 Expected Results

After successful seeding, you should see:
- ✅ 15 Categories
- ✅ 20 Deities  
- ✅ 25+ Mantras with detailed descriptions
- ✅ 10 Recitation counts
- ✅ 10 Recitation times
- ✅ 10 Kalams (time periods)
- ✅ 10 Time ranges

## 🔍 Verification

The script automatically verifies the data after seeding. You can also manually check:

1. **Visit your app homepage** - You should see trending mantras
2. **Search functionality** - Try searching for "Ganesha", "wealth", or "Om"
3. **Category browsing** - Click on category filters
4. **Admin panel** - Check the admin interface for all the new content

## 🎯 What You Can Do Next

After seeding, your Dhivyuga app will have:

### 🔍 **Rich Search Experience**
- Search by deity names: "Ganesha", "Lakshmi", "Shiva"
- Search by categories: "wealth", "protection", "wisdom"
- Search by mantra text: "Om", "Namaha", "Gayatri"

### 📱 **Browse by Categories**
- Click category filters on homepage
- Explore mantras by purpose and intention

### 🙏 **Authentic Content**
- Proper Sanskrit text with Devanagari script
- Accurate transliterations and pronunciations
- Detailed meanings and spiritual significance
- Traditional usage instructions

### ⚙️ **Admin Management**
- Full CRUD operations for all content
- Add more mantras, categories, and deities
- Manage recitation counts and times

## 🛠 Troubleshooting

### Script Fails to Run
- Check your `.env.local` file has correct Supabase credentials
- Ensure you have internet connection
- Try the manual SQL method instead

### Missing Data After Seeding
- Check Supabase dashboard for any errors
- Verify your database schema matches the expected structure
- Re-run the script or execute SQL manually

### Search Not Working
- Make sure the `search_vector` column is properly indexed
- Check if the mantras have proper text content
- Verify the search API endpoints are working

## 📝 Customization

You can customize the seed data by editing `seed-mantras.sql`:

- **Add more categories** - Insert into `categories` table
- **Add more deities** - Insert into `deities` table  
- **Add more mantras** - Insert into `mantras` table with proper references
- **Add descriptions** - Insert into `mantra_descriptions` table

## 🤝 Contributing

To add more authentic mantras:
1. Research proper Sanskrit text and meanings
2. Add to the SQL file with proper categorization
3. Include transliteration and pronunciation guides
4. Test the additions before committing

---

**Happy Chanting! 🙏 ॐ**
