-- Step 1: Create basic tables for multi-language support
-- Run this first in your Supabase SQL Editor

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100),
    direction VARCHAR(3) DEFAULT 'ltr',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mantra_translations table
CREATE TABLE IF NOT EXISTS mantra_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mantra_id UUID NOT NULL REFERENCES mantras(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    transliteration TEXT,
    pronunciation_guide TEXT,
    meaning TEXT,
    benefits TEXT[],
    usage_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(mantra_id, language_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_mantra_translations_mantra_id ON mantra_translations(mantra_id);
CREATE INDEX IF NOT EXISTS idx_mantra_translations_language_id ON mantra_translations(language_id);
CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);
CREATE INDEX IF NOT EXISTS idx_languages_active ON languages(is_active);

-- Insert default languages
INSERT INTO languages (code, name, native_name, direction, sort_order) VALUES
('en', 'English', 'English', 'ltr', 1),
('sa', 'Sanskrit', 'संस्कृत', 'ltr', 2),
('ta', 'Tamil', 'தமிழ்', 'ltr', 3),
('hi', 'Hindi', 'हिन्दी', 'ltr', 4)
ON CONFLICT (code) DO NOTHING;

-- Enable RLS
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantra_translations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read languages" ON languages
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read mantra_translations" ON mantra_translations
    FOR SELECT USING (true);

-- Create policies for admin access (if profiles table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        CREATE POLICY "Admins can manage languages" ON languages
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.role = 'admin'
                )
            );

        CREATE POLICY "Admins can manage mantra_translations" ON mantra_translations
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid() 
                    AND profiles.role = 'admin'
                )
            );
    END IF;
END $$;
