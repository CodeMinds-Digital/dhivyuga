-- Script to create admin user and set up authentication
-- Run this in your Supabase SQL Editor

-- First, create the admin user via Supabase Auth (you'll need to do this in the Supabase dashboard)
-- Go to Authentication > Users > Add User
-- Email: admin@dhivyuga.com
-- Password: (choose a secure password)
-- Email Confirm: true

-- Create a profiles table to store user roles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update admin user role (replace with actual admin user ID)
-- You'll need to get the user ID from the auth.users table after creating the admin user
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@dhivyuga.com';

-- Create RLS policies for admin access to all tables
CREATE POLICY "Admins can do everything on categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can do everything on deities" ON deities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can do everything on mantras" ON mantras
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can do everything on mantra_descriptions" ON mantra_descriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can do everything on recitation_counts" ON recitation_counts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can do everything on recitation_times" ON recitation_times
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can do everything on kalams" ON kalams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can do everything on time_ranges" ON time_ranges
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Allow public read access to most tables (for the frontend)
CREATE POLICY "Public read access to categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public read access to deities" ON deities
    FOR SELECT USING (true);

CREATE POLICY "Public read access to mantras" ON mantras
    FOR SELECT USING (true);

CREATE POLICY "Public read access to mantra_descriptions" ON mantra_descriptions
    FOR SELECT USING (true);

CREATE POLICY "Public read access to recitation_counts" ON recitation_counts
    FOR SELECT USING (true);

CREATE POLICY "Public read access to recitation_times" ON recitation_times
    FOR SELECT USING (true);

CREATE POLICY "Public read access to kalams" ON kalams
    FOR SELECT USING (true);

CREATE POLICY "Public read access to time_ranges" ON time_ranges
    FOR SELECT USING (true);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE deities ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantra_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recitation_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recitation_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE kalams ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_ranges ENABLE ROW LEVEL SECURITY;
