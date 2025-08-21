-- Setup Admin User for Dhivyuga
-- Run this in your Supabase SQL Editor

-- Create profiles table to store user roles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    role TEXT DEFAULT 'user',
    full_name TEXT,
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
    INSERT INTO public.profiles (id, email, role, full_name)
    VALUES (NEW.id, NEW.email, 'user', NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE deities ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantra_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recitation_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recitation_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE kalams ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_ranges ENABLE ROW LEVEL SECURITY;

-- Create admin policies for all tables
CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage deities" ON deities
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage mantras" ON mantras
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage mantra_descriptions" ON mantra_descriptions
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage recitation_counts" ON recitation_counts
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage recitation_times" ON recitation_times
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage kalams" ON kalams
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage time_ranges" ON time_ranges
    FOR ALL USING (is_admin(auth.uid()));

-- Create public read policies for all tables
CREATE POLICY "Public can read categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public can read deities" ON deities
    FOR SELECT USING (true);

CREATE POLICY "Public can read mantras" ON mantras
    FOR SELECT USING (true);

CREATE POLICY "Public can read mantra_descriptions" ON mantra_descriptions
    FOR SELECT USING (true);

CREATE POLICY "Public can read recitation_counts" ON recitation_counts
    FOR SELECT USING (true);

CREATE POLICY "Public can read recitation_times" ON recitation_times
    FOR SELECT USING (true);

CREATE POLICY "Public can read kalams" ON kalams
    FOR SELECT USING (true);

CREATE POLICY "Public can read time_ranges" ON time_ranges
    FOR SELECT USING (true);

-- After running this script, you need to:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User"
-- 3. Email: admin@dhivyuga.com
-- 4. Password: DhivyugaAdmin2024!
-- 5. Email Confirm: true
-- 6. Then run this query to make them admin:
-- UPDATE profiles SET role = 'admin', full_name = 'Dhivyuga Admin' WHERE email = 'admin@dhivyuga.com';
