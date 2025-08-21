# Dhivyuga Admin Setup Guide

## 🔐 Setting Up Admin Authentication

### Step 1: Run the Database Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `scripts/setup-admin.sql`
4. Click **Run** to execute the script

This will:
- Create the `profiles` table
- Set up Row Level Security (RLS) policies
- Create functions for admin role checking
- Enable public read access to all tables

### Step 2: Create Admin User

✅ **ALREADY COMPLETED** - The admin user has been created and configured!

If you need to verify or recreate the admin user:

#### Option A: Using the Script (Recommended)
1. Run: `node scripts/make-user-admin.js`
2. This will ensure the admin user has proper privileges

#### Option B: Using Supabase Dashboard
1. Go to **Authentication > Users** in your Supabase dashboard
2. Find `admin@dhivyuga.com` or create if missing
3. Go to **SQL Editor** and run:
   ```sql
   UPDATE profiles
   SET role = 'admin', full_name = 'Dhivyuga Admin'
   WHERE email = 'admin@dhivyuga.com';
   ```

#### Check Setup Status
Run: `node scripts/check-setup.js` to verify everything is working

### Step 3: Test Admin Login

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/admin`
3. Login with:
   - **Email**: `admin@dhivyuga.com`
   - **Password**: `DhivyugaAdmin2024!`

## 🛡️ Security Features

### Role-Based Access Control
- Only users with `role = 'admin'` in the `profiles` table can access the admin panel
- Regular users are automatically denied access
- Admin role is checked on both login and page load

### Row Level Security (RLS)
- All database tables have RLS enabled
- Admins have full CRUD access to all tables
- Public users have read-only access to content tables
- User profiles are protected (users can only see their own)

### Authentication Flow
1. User enters credentials
2. Supabase authenticates the user
3. System checks if user has admin role
4. If not admin, user is logged out and denied access
5. If admin, user gains access to admin panel

## 🔧 Troubleshooting

### "Access denied" Error
- Make sure the user exists in the `auth.users` table
- Verify the user has `role = 'admin'` in the `profiles` table
- Check that RLS policies are properly set up

### Login Not Working
- Verify Supabase environment variables in `.env.local`
- Check that the user's email is confirmed
- Ensure the password is correct

### Database Connection Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check Supabase project status

## 📝 Default Credentials

**Email**: `admin@dhivyuga.com`  
**Password**: `DhivyugaAdmin2024!`

> ⚠️ **Security Note**: Change the default password after first login in a production environment.

## 🎯 Admin Panel Features

Once logged in, admins can:
- View dashboard with statistics
- Manage mantras, categories, and deities
- Configure recitation settings
- View analytics
- Review content

## 🔄 Changing Admin Credentials

To change the admin password:
1. Login to the admin panel
2. Go to Supabase Dashboard > Authentication > Users
3. Find the admin user and click "Edit"
4. Update the password
5. Save changes

To add more admin users:
1. Create a new user in Supabase Dashboard
2. Update their profile: `UPDATE profiles SET role = 'admin' WHERE email = 'new-admin@email.com'`

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure the database setup script ran successfully
4. Check Supabase logs for authentication errors
