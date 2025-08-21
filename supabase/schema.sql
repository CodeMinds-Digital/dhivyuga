-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deities table
CREATE TABLE deities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recitation counts table
CREATE TABLE recitation_counts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    count_value INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recitation times table
CREATE TABLE recitation_times (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kalams table
CREATE TABLE kalams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    planet VARCHAR(100),
    description TEXT,
    is_auspicious BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time ranges table
CREATE TABLE time_ranges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mantras table
CREATE TABLE mantras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    text TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    deity_id UUID REFERENCES deities(id),
    count_id UUID REFERENCES recitation_counts(id),
    time_id UUID REFERENCES recitation_times(id),
    kalam_id UUID REFERENCES kalams(id),
    range_id UUID REFERENCES time_ranges(id),
    view_count INTEGER DEFAULT 0,
    search_vector tsvector,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mantra descriptions table
CREATE TABLE mantra_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mantra_id UUID REFERENCES mantras(id) ON DELETE CASCADE,
    meaning TEXT NOT NULL,
    transliteration TEXT,
    pronunciation_guide TEXT,
    benefits TEXT[],
    historical_context TEXT,
    spiritual_significance TEXT,
    usage_instructions TEXT,
    precautions TEXT,
    related_scriptures TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for search performance
CREATE INDEX mantras_search_idx ON mantras USING GIN(search_vector);
CREATE INDEX idx_mantras_view_count ON mantras(view_count DESC);
CREATE INDEX idx_mantras_created_at ON mantras(created_at DESC);
CREATE INDEX idx_mantra_descriptions_mantra_id ON mantra_descriptions(mantra_id);
CREATE INDEX idx_mantra_descriptions_updated_at ON mantra_descriptions(updated_at DESC);

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_mantra_search_vector()
RETURNS TRIGGER AS $$
DECLARE
  description_text TEXT := '';
BEGIN
  -- Get description data if it exists
  SELECT COALESCE(meaning, '') || ' ' || COALESCE(transliteration, '') || ' ' ||
         COALESCE(array_to_string(benefits, ' '), '') || ' ' ||
         COALESCE(spiritual_significance, '')
  INTO description_text
  FROM mantra_descriptions
  WHERE mantra_id = NEW.id;

  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.text, '') || ' ' ||
    COALESCE(description_text, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector
CREATE TRIGGER mantras_search_vector_update
  BEFORE INSERT OR UPDATE ON mantras
  FOR EACH ROW EXECUTE FUNCTION update_mantra_search_vector();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on mantra_descriptions
CREATE TRIGGER mantra_descriptions_updated_at
  BEFORE UPDATE ON mantra_descriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update mantra search vector when description changes
CREATE OR REPLACE FUNCTION update_mantra_search_on_description_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the related mantra's search vector
  UPDATE mantras SET search_vector = to_tsvector('english',
    COALESCE(title, '') || ' ' ||
    COALESCE(text, '') || ' ' ||
    COALESCE(NEW.meaning, '') || ' ' ||
    COALESCE(NEW.transliteration, '') || ' ' ||
    COALESCE(array_to_string(NEW.benefits, ' '), '') || ' ' ||
    COALESCE(NEW.spiritual_significance, '')
  ) WHERE id = NEW.mantra_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mantra_descriptions_search_update
  AFTER INSERT OR UPDATE ON mantra_descriptions
  FOR EACH ROW EXECUTE FUNCTION update_mantra_search_on_description_change();

-- Update existing mantras to populate search_vector
UPDATE mantras SET search_vector = to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(text, ''));

-- Insert initial data
INSERT INTO categories (name, description) VALUES
('Wealth', 'Mantras for prosperity and abundance'),
('Protection', 'Mantras for safety and divine protection'),
('Health', 'Mantras for physical and mental well-being'),
('Wisdom', 'Mantras for knowledge and understanding'),
('Love', 'Mantras for relationships and harmony'),
('Success', 'Mantras for achievement and accomplishment'),
('Peace', 'Mantras for inner calm and tranquility'),
('Spiritual Growth', 'Mantras for spiritual development'),
('Obstacle Removal', 'Mantras for removing barriers'),
('Good Fortune', 'Mantras for positive energy and luck');

INSERT INTO deities (name, description) VALUES
('Ganesha', 'Remover of obstacles, patron of arts and sciences'),
('Lakshmi', 'Goddess of wealth, fortune, prosperity'),
('Saraswati', 'Goddess of knowledge, music, arts, wisdom'),
('Hanuman', 'Symbol of courage, strength, and devotion'),
('Shiva', 'The transformer, destroyer of evil'),
('Vishnu', 'The preserver and protector of the universe'),
('Devi', 'The divine mother, supreme goddess'),
('Krishna', 'God of love, compassion, and tenderness'),
('Rama', 'Symbol of righteousness and virtue'),
('Kali', 'Fierce form of the divine mother');

INSERT INTO recitation_counts (count_value, description) VALUES
(11, 'Quick daily practice'),
(27, 'Standard practice'),
(54, 'Moderate practice'),
(108, 'Full mala count'),
(1008, 'Special occasions'),
(10008, 'Major spiritual undertakings');

INSERT INTO recitation_times (name, description) VALUES
('Morning', 'Early morning hours'),
('Noon', 'Midday period'),
('Evening', 'Evening hours'),
('Brahma Muhurta', 'Pre-dawn sacred time');

INSERT INTO kalams (name, planet, description, is_auspicious) VALUES
('Rahu Kalam', 'Rahu', 'Inauspicious period ruled by Rahu', false),
('Yama Kalam', 'Yama', 'Period of death deity', false),
('Gulika Kalam', 'Gulika', 'Inauspicious period', false),
('Surya Hora', 'Surya', 'Sun period, auspicious', true),
('Chandra Hora', 'Chandra', 'Moon period', true),
('Guru Hora', 'Guru', 'Jupiter period, very auspicious', true),
('Shukra Hora', 'Shukra', 'Venus period, auspicious', true);

INSERT INTO time_ranges (start_time, end_time, description) VALUES
('03:30:00', '05:30:00', 'Brahma Muhurta - most sacred time'),
('06:00:00', '09:00:00', 'Morning hours'),
('11:30:00', '12:30:00', 'Midday period'),
('18:00:00', '20:00:00', 'Evening hours');

-- Sample mantras
INSERT INTO mantras (title, text, deity_id, category_id, count_id, time_id, view_count) 
SELECT 
    'Om Gam Ganapataye Namaha',
    'Om Gam Ganapataye Namaha - Salutations to Lord Ganesha',
    d.id,
    c.id,
    rc.id,
    rt.id,
    150
FROM deities d, categories c, recitation_counts rc, recitation_times rt
WHERE d.name = 'Ganesha' 
AND c.name = 'Obstacle Removal' 
AND rc.count_value = 108 
AND rt.name = 'Morning'
LIMIT 1;

INSERT INTO mantras (title, text, deity_id, category_id, count_id, time_id, view_count)
SELECT
    'Om Shreem Mahalakshmiyei Namaha',
    'Om Shreem Mahalakshmiyei Namaha - Salutations to Goddess Lakshmi',
    d.id,
    c.id,
    rc.id,
    rt.id,
    120
FROM deities d, categories c, recitation_counts rc, recitation_times rt
WHERE d.name = 'Lakshmi'
AND c.name = 'Wealth'
AND rc.count_value = 108
AND rt.name = 'Morning'
LIMIT 1;

-- Insert sample mantra descriptions
INSERT INTO mantra_descriptions (mantra_id, meaning, transliteration, pronunciation_guide, benefits, historical_context, spiritual_significance, usage_instructions, precautions, related_scriptures)
SELECT
    m.id,
    'Salutations to Lord Ganesha, the remover of obstacles and patron of arts and sciences. This powerful mantra invokes the blessings of Ganesha for success in new endeavors and removal of barriers in life.',
    'Om Gam Ganapataye Namaha',
    'Om (AUM) - Gam (GAHM) - Ga-na-pa-ta-ye (Gah-nah-pah-tah-yeh) - Na-ma-ha (Nah-mah-hah)',
    ARRAY['Removes obstacles in life', 'Brings success in new ventures', 'Enhances wisdom and intelligence', 'Provides divine protection', 'Improves concentration and focus', 'Grants good fortune in business'],
    'This ancient mantra has been chanted for thousands of years. Ganesha is traditionally invoked at the beginning of any new undertaking, making this one of the most popular mantras in Hindu tradition.',
    'Ganesha represents the removal of obstacles and the granting of wisdom. Chanting this mantra helps align oneself with the divine energy that clears the path forward and brings clarity to decision-making.',
    'Chant 108 times in the morning before starting any new work or important task. Face east while chanting. Use a rudraksha mala for counting. Maintain a clean and peaceful environment.',
    'Chant with devotion and respect. Avoid chanting during inauspicious times like Rahu Kalam unless specifically guided by a guru.',
    ARRAY['Ganapati Atharvashirsha', 'Ganesha Purana', 'Mudgala Purana']
FROM mantras m
WHERE m.title = 'Om Gam Ganapataye Namaha'
LIMIT 1;

INSERT INTO mantra_descriptions (mantra_id, meaning, transliteration, pronunciation_guide, benefits, historical_context, spiritual_significance, usage_instructions, precautions, related_scriptures)
SELECT
    m.id,
    'Salutations to Goddess Lakshmi, the divine mother of wealth, prosperity, and abundance. This sacred mantra invokes the blessings of Lakshmi for material and spiritual prosperity.',
    'Om Shreem Mahalakshmiyei Namaha',
    'Om (AUM) - Shreem (SHREEM) - Ma-ha-lak-shmi-yei (Mah-hah-lahk-shmee-yay) - Na-ma-ha (Nah-mah-hah)',
    ARRAY['Attracts wealth and prosperity', 'Brings financial stability', 'Enhances business success', 'Grants material abundance', 'Improves family harmony', 'Bestows spiritual wealth'],
    'This mantra is found in the Lakshmi Tantra and has been used for centuries to invoke the grace of the goddess of wealth. Shreem is the powerful seed syllable (bija mantra) of Lakshmi.',
    'Lakshmi represents not just material wealth but also spiritual abundance, beauty, and grace. This mantra helps cultivate an attitude of gratitude and abundance consciousness.',
    'Best chanted on Fridays, especially during Lakshmi Puja. Chant 108 times facing north or east. Light a ghee lamp and offer lotus flowers or gold coins if possible.',
    'Maintain purity of thought and action. Avoid greed and always share your prosperity with others. The goddess blesses those who use wealth for righteous purposes.',
    ARRAY['Lakshmi Tantra', 'Vishnu Purana', 'Sri Suktam']
FROM mantras m
WHERE m.title = 'Om Shreem Mahalakshmiyei Namaha'
LIMIT 1;