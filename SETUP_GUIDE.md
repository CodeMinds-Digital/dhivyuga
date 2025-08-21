# Dhivyuga Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Click "New Project"
4. Choose your organization and create the project
5. Wait for the project to be ready

#### Get Your Credentials
1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" 
4. Copy the following:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role** key (also starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

#### Configure Environment Variables
1. Open `.env.local` in your project root
2. Replace the placeholder values:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Set up Database

#### Run the Schema
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Copy the entire content from `supabase/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- All necessary tables (categories, deities, mantras, etc.)
- Indexes for search performance
- Sample data for testing

### 4. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your Dhivyuga app!

## 🎯 Features Available

### Homepage
- **Search Bar** with autocomplete
- **Quick Filter Chips** for categories
- **Trending Mantras** section
- **Browse by Deity** grid

### Search Results (`/search?q=ganesha`)
- **Advanced Filtering** by category, deity, time, kalam
- **Query Highlighting** in results
- **Responsive Cards** with mantra details

### Mantra Detail Page (`/mantra/[id]`)
- **Complete Recitation Guidelines**
- **Planetary Period Warnings**
- **View Counter** tracking
- **Related Mantras** suggestions

### Admin Panel (`/admin`)
- **Supabase Authentication** required
- **Content Management** dashboard
- **Analytics Overview**

## 🔧 Troubleshooting

### CSS Not Loading
The CSS should load automatically. If you're seeing unstyled content:
1. Make sure `npm run dev` is running
2. Check browser console for errors
3. Verify Tailwind CSS is working by inspecting elements

### API Errors
If you see "Invalid URL" errors:
1. Check your `.env.local` file has correct Supabase credentials
2. Restart the development server after changing environment variables
3. Verify your Supabase project is active

### Database Issues
If mantras aren't loading:
1. Verify you ran the `supabase/schema.sql` script
2. Check the Supabase dashboard for table data
3. Ensure RLS (Row Level Security) is disabled for development

### Search Not Working
If search returns no results:
1. Verify sample data was inserted from schema.sql
2. Check the search_vector column is populated
3. Test with simple queries like "ganesha" or "wealth"

## 📊 Sample Data

The schema includes sample data for:
- **10 Categories**: Wealth, Protection, Health, Wisdom, etc.
- **10 Deities**: Ganesha, Lakshmi, Saraswati, etc.
- **6 Recitation Counts**: 11, 21, 51, 108, 1008, 10008
- **4 Recitation Times**: Morning, Noon, Evening, Brahma Muhurta
- **5 Kalam Periods**: Rahu Kalam, Surya Hora, etc.
- **4 Time Ranges**: Specific time windows
- **Sample Mantras**: Ganesha and Lakshmi mantras for testing

## 🎨 Customization

### Colors
The Dhivyuga color palette is defined in:
- `tailwind.config.js` - Tailwind color definitions
- `app/globals.css` - CSS custom properties

### Fonts
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Sacred Geometry
Background patterns are defined in:
- `mandala-bg` class in `globals.css`
- `backgroundImage.mandala` in `tailwind.config.js`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
Make sure to set these in your deployment platform:
```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## 📝 Next Steps

1. **Add More Mantras**: Use the admin panel to add more mantras
2. **Configure Authentication**: Set up admin user in Supabase Auth
3. **Customize Branding**: Update colors, fonts, and imagery
4. **Add Analytics**: Implement user tracking and search analytics
5. **Mobile Optimization**: Test and optimize for mobile devices

## 🆘 Support

If you encounter issues:
1. Check this setup guide first
2. Verify all environment variables are correct
3. Ensure Supabase project is properly configured
4. Check browser console for specific error messages

The app should work perfectly once Supabase is properly configured!
