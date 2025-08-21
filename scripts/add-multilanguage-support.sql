-- Multi-language Support Migration for Dhivyuga
-- This script adds support for multiple languages with WYSIWYG content

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) NOT NULL UNIQUE, -- 'en', 'ta', 'sa', 'hi', etc.
    name VARCHAR(100) NOT NULL, -- 'English', 'Tamil', 'Sanskrit', 'Hindi'
    native_name VARCHAR(100), -- 'தமிழ்', 'संस्कृत', 'हिन्दी'
    direction VARCHAR(3) DEFAULT 'ltr', -- 'ltr' or 'rtl'
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mantra_translations table for language-specific content
CREATE TABLE IF NOT EXISTS mantra_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mantra_id UUID NOT NULL REFERENCES mantras(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    text TEXT NOT NULL, -- Rich text content from WYSIWYG editor
    transliteration TEXT, -- Romanized version for non-Latin scripts
    pronunciation_guide TEXT, -- How to pronounce the mantra
    meaning TEXT, -- Meaning in this language
    benefits TEXT[], -- Array of benefits in this language
    usage_notes TEXT, -- Special usage instructions in this language
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(mantra_id, language_id) -- One translation per language per mantra
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_mantra_translations_mantra_id ON mantra_translations(mantra_id);
CREATE INDEX IF NOT EXISTS idx_mantra_translations_language_id ON mantra_translations(language_id);
CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);
CREATE INDEX IF NOT EXISTS idx_languages_active ON languages(is_active);

-- Insert default languages
INSERT INTO languages (code, name, native_name, direction, sort_order) VALUES
('en', 'English', 'English', 'ltr', 1),
('sa', 'Sanskrit', 'संस्कृत', 'ltr', 2),
('ta', 'Tamil', 'தமிழ்', 'ltr', 3),
('hi', 'Hindi', 'हिन्दी', 'ltr', 4),
('te', 'Telugu', 'తెలుగు', 'ltr', 5),
('kn', 'Kannada', 'ಕನ್ನಡ', 'ltr', 6),
('ml', 'Malayalam', 'മലയാളം', 'ltr', 7),
('gu', 'Gujarati', 'ગુજરાતી', 'ltr', 8),
('bn', 'Bengali', 'বাংলা', 'ltr', 9),
('or', 'Odia', 'ଓଡ଼ିଆ', 'ltr', 10)
ON CONFLICT (code) DO NOTHING;

-- Migrate existing mantra text to translations table
-- This will create English translations for all existing mantras
DO $$
DECLARE
    mantra_record RECORD;
    english_lang_id UUID;
BEGIN
    -- Get English language ID
    SELECT id INTO english_lang_id FROM languages WHERE code = 'en';
    
    -- Migrate existing mantras
    FOR mantra_record IN SELECT id, text, title FROM mantras WHERE text IS NOT NULL AND text != ''
    LOOP
        INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration)
        VALUES (
            mantra_record.id,
            english_lang_id,
            mantra_record.text,
            mantra_record.title
        )
        ON CONFLICT (mantra_id, language_id) DO NOTHING;
    END LOOP;
END $$;

-- Add primary_language_id to mantras table to track the main language
ALTER TABLE mantras ADD COLUMN IF NOT EXISTS primary_language_id UUID REFERENCES languages(id);

-- Set primary language to English for existing mantras
UPDATE mantras SET primary_language_id = (SELECT id FROM languages WHERE code = 'en')
WHERE primary_language_id IS NULL;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS languages_updated_at ON languages;
CREATE TRIGGER languages_updated_at
    BEFORE UPDATE ON languages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS mantra_translations_updated_at ON mantra_translations;
CREATE TRIGGER mantra_translations_updated_at
    BEFORE UPDATE ON mantra_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update search vector function to include translations
CREATE OR REPLACE FUNCTION update_mantra_search_vector()
RETURNS TRIGGER AS $$
DECLARE
    description_text TEXT := '';
    translations_text TEXT := '';
BEGIN
    -- Get description data if it exists
    SELECT COALESCE(meaning, '') || ' ' || COALESCE(transliteration, '') || ' ' ||
           COALESCE(array_to_string(benefits, ' '), '') || ' ' ||
           COALESCE(spiritual_significance, '')
    INTO description_text
    FROM mantra_descriptions
    WHERE mantra_id = NEW.id;

    -- Get all translations text for search
    SELECT string_agg(
        COALESCE(text, '') || ' ' || 
        COALESCE(transliteration, '') || ' ' || 
        COALESCE(meaning, '') || ' ' ||
        COALESCE(array_to_string(benefits, ' '), ''), ' '
    )
    INTO translations_text
    FROM mantra_translations
    WHERE mantra_id = NEW.id;

    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.title, '') || ' ' ||
        COALESCE(NEW.text, '') || ' ' ||
        COALESCE(description_text, '') || ' ' ||
        COALESCE(translations_text, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update mantra search when translations change
CREATE OR REPLACE FUNCTION update_mantra_search_on_translation_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the related mantra's search vector
    UPDATE mantras SET search_vector = to_tsvector('english',
        COALESCE(title, '') || ' ' ||
        COALESCE(text, '') || ' ' ||
        (SELECT string_agg(
            COALESCE(text, '') || ' ' || 
            COALESCE(transliteration, '') || ' ' || 
            COALESCE(meaning, '') || ' ' ||
            COALESCE(array_to_string(benefits, ' '), ''), ' '
        ) FROM mantra_translations WHERE mantra_id = NEW.mantra_id)
    ) WHERE id = NEW.mantra_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for translation changes
DROP TRIGGER IF EXISTS mantra_translations_search_update ON mantra_translations;
CREATE TRIGGER mantra_translations_search_update
    AFTER INSERT OR UPDATE OR DELETE ON mantra_translations
    FOR EACH ROW EXECUTE FUNCTION update_mantra_search_on_translation_change();

-- Add RLS policies for new tables
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantra_translations ENABLE ROW LEVEL SECURITY;

-- Public read access to languages
CREATE POLICY "Public can read languages" ON languages
    FOR SELECT USING (is_active = true);

-- Public read access to mantra translations
CREATE POLICY "Public can read mantra_translations" ON mantra_translations
    FOR SELECT USING (true);

-- Admin policies (assuming admin function exists)
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

-- Create view for easy mantra querying with translations
CREATE OR REPLACE VIEW mantras_with_translations AS
SELECT 
    m.*,
    json_agg(
        json_build_object(
            'language_code', l.code,
            'language_name', l.name,
            'language_native_name', l.native_name,
            'text', mt.text,
            'transliteration', mt.transliteration,
            'pronunciation_guide', mt.pronunciation_guide,
            'meaning', mt.meaning,
            'benefits', mt.benefits,
            'usage_notes', mt.usage_notes
        ) ORDER BY l.sort_order
    ) FILTER (WHERE mt.id IS NOT NULL) AS translations
FROM mantras m
LEFT JOIN mantra_translations mt ON m.id = mt.mantra_id
LEFT JOIN languages l ON mt.language_id = l.id AND l.is_active = true
GROUP BY m.id;

-- Grant permissions on the view
GRANT SELECT ON mantras_with_translations TO anon, authenticated;
