-- Complete Multi-Language Mantra System Setup
-- This script creates all tables, migrations, and demo data in one go
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- PART 1: CREATE TABLES AND CONSTRAINTS
-- ============================================================================

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

-- Add primary_language_id to mantras table
ALTER TABLE mantras ADD COLUMN IF NOT EXISTS primary_language_id UUID REFERENCES languages(id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_mantra_translations_mantra_id ON mantra_translations(mantra_id);
CREATE INDEX IF NOT EXISTS idx_mantra_translations_language_id ON mantra_translations(language_id);
CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);
CREATE INDEX IF NOT EXISTS idx_languages_active ON languages(is_active);

-- Add unique constraints for ON CONFLICT support
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE categories ADD CONSTRAINT unique_category_name UNIQUE (name);
    EXCEPTION
        WHEN duplicate_table THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE deities ADD CONSTRAINT unique_deity_name UNIQUE (name);
    EXCEPTION
        WHEN duplicate_table THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE recitation_counts ADD CONSTRAINT unique_count_value UNIQUE (count_value);
    EXCEPTION
        WHEN duplicate_table THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE recitation_times ADD CONSTRAINT unique_time_name UNIQUE (name);
    EXCEPTION
        WHEN duplicate_table THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE kalams ADD CONSTRAINT unique_kalam_name UNIQUE (name);
    EXCEPTION
        WHEN duplicate_table THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE time_ranges ADD CONSTRAINT unique_time_range UNIQUE (start_time, end_time);
    EXCEPTION
        WHEN duplicate_table THEN NULL;
    END;
END $$;

-- ============================================================================
-- PART 2: INSERT LANGUAGES
-- ============================================================================

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

-- ============================================================================
-- PART 3: INSERT COMPREHENSIVE CATEGORIES, DEITIES, AND RELATED DATA
-- ============================================================================

-- Insert comprehensive categories
INSERT INTO categories (name, description) VALUES
('Wealth & Prosperity', 'Mantras for financial abundance, prosperity, and material success'),
('Protection & Safety', 'Mantras for divine protection, safety, and warding off negative energies'),
('Health & Healing', 'Mantras for physical health, mental well-being, and healing'),
('Wisdom & Knowledge', 'Mantras for gaining knowledge, wisdom, and spiritual understanding'),
('Love & Relationships', 'Mantras for harmonious relationships, love, and family peace'),
('Success & Achievement', 'Mantras for success in endeavors, career growth, and accomplishments'),
('Peace & Tranquility', 'Mantras for inner peace, mental calm, and stress relief'),
('Spiritual Growth', 'Mantras for spiritual development, enlightenment, and self-realization'),
('Obstacle Removal', 'Mantras for removing barriers, difficulties, and challenges'),
('Good Fortune & Luck', 'Mantras for positive energy, good luck, and favorable outcomes'),
('Devotion & Surrender', 'Mantras expressing devotion, surrender, and divine connection'),
('Purification & Cleansing', 'Mantras for spiritual purification and cleansing negative karma'),
('Strength & Courage', 'Mantras for inner strength, courage, and overcoming fears'),
('Meditation & Focus', 'Mantras for meditation practice, concentration, and mindfulness'),
('Universal Mantras', 'Universal mantras suitable for all purposes and practitioners')
ON CONFLICT (name) DO NOTHING;

-- Insert comprehensive deities
INSERT INTO deities (name, description) VALUES
('Ganesha', 'Remover of obstacles, patron of arts and sciences, lord of beginnings'),
('Lakshmi', 'Goddess of wealth, fortune, prosperity, and abundance'),
('Saraswati', 'Goddess of knowledge, music, arts, wisdom, and learning'),
('Hanuman', 'Symbol of courage, strength, devotion, and protection'),
('Shiva', 'The transformer, destroyer of evil, lord of meditation and yoga'),
('Vishnu', 'The preserver and protector of the universe, sustainer of life'),
('Devi Durga', 'The divine mother, supreme goddess, protector of devotees'),
('Krishna', 'God of love, compassion, tenderness, and divine play'),
('Rama', 'Symbol of righteousness, virtue, and ideal conduct'),
('Kali', 'Fierce form of the divine mother, destroyer of evil and ego'),
('Surya', 'Sun god, source of light, energy, and vitality'),
('Chandra', 'Moon god, ruler of mind, emotions, and intuition')
ON CONFLICT (name) DO NOTHING;

-- Insert recitation counts
INSERT INTO recitation_counts (count_value, description) VALUES
(1, 'Single recitation for quick prayer'),
(3, 'Triple recitation for basic practice'),
(11, 'Eleven times for quick daily practice'),
(21, 'Twenty-one times for focused intention'),
(27, 'Standard practice count'),
(54, 'Half mala for moderate practice'),
(108, 'Full mala count - most auspicious'),
(1008, 'Ten malas for special occasions')
ON CONFLICT (count_value) DO NOTHING;

-- Insert recitation times
INSERT INTO recitation_times (name, description) VALUES
('Brahma Muhurta', 'Pre-dawn sacred time (4:00-6:00 AM) - most auspicious'),
('Morning', 'Early morning hours (6:00-10:00 AM)'),
('Noon', 'Midday period (11:00 AM-1:00 PM)'),
('Afternoon', 'Afternoon hours (1:00-5:00 PM)'),
('Evening', 'Evening hours (5:00-8:00 PM)'),
('Night', 'Night time (8:00 PM-12:00 AM)'),
('Anytime', 'Can be recited at any time of day'),
('Sunrise', 'During sunrise - for new beginnings'),
('Sunset', 'During sunset - for completion and gratitude')
ON CONFLICT (name) DO NOTHING;

-- Insert kalams
INSERT INTO kalams (name, planet, description, is_auspicious) VALUES
('Rahu Kalam', 'Rahu', 'Inauspicious time ruled by Rahu - avoid new beginnings', false),
('Yama Kalam', 'Yama', 'Time of death god - inauspicious for important activities', false),
('Gulika Kalam', 'Gulika', 'Inauspicious time - avoid important work', false),
('Surya Hora', 'Surya', 'Sun hour - auspicious for leadership and authority', true),
('Chandra Hora', 'Chandra', 'Moon hour - good for emotional and creative work', true),
('Guru Hora', 'Jupiter', 'Jupiter hour - most auspicious for spiritual activities', true)
ON CONFLICT (name) DO NOTHING;

-- Insert time ranges
INSERT INTO time_ranges (start_time, end_time, description) VALUES
('04:00:00', '06:00:00', 'Brahma Muhurta - most sacred time for spiritual practice'),
('06:00:00', '08:00:00', 'Early morning - ideal for meditation and mantras'),
('12:00:00', '14:00:00', 'Noon time - powerful for Surya mantras'),
('18:00:00', '20:00:00', 'Evening - ideal for family and peace mantras')
ON CONFLICT (start_time, end_time) DO NOTHING;

-- ============================================================================
-- PART 4: CREATE DEMO MANTRAS WITH FULL MULTI-LANGUAGE SUPPORT
-- ============================================================================

-- Demo Mantra 1: Om Gam Ganapataye Namaha (Ganesha)
INSERT INTO mantras (id, title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'Om Gam Ganapataye Namaha',
    'ॐ गं गणपतये नमः',
    c.id,
    d.id,
    rc.id,
    rt.id,
    245
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Obstacle Removal' AND d.name = 'Ganesha'
AND rc.count_value = 108 AND rt.name = 'Morning'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Demo Mantra 2: Om Shreem Mahalakshmiyei Namaha (Lakshmi)
INSERT INTO mantras (id, title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'Om Shreem Mahalakshmiyei Namaha',
    'ॐ श्रीं महालक्ष्म्यै नमः',
    c.id,
    d.id,
    rc.id,
    rt.id,
    298
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Wealth & Prosperity' AND d.name = 'Lakshmi'
AND rc.count_value = 108 AND rt.name = 'Evening'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Demo Mantra 3: Om Namah Shivaya (Shiva)
INSERT INTO mantras (id, title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'Om Namah Shivaya',
    'ॐ नमः शिवाय',
    c.id,
    d.id,
    rc.id,
    rt.id,
    412
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Universal Mantras' AND d.name = 'Shiva'
AND rc.count_value = 108 AND rt.name = 'Anytime'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PART 5: ADD COMPREHENSIVE TRANSLATIONS FOR DEMO MANTRAS
-- ============================================================================

-- Add translations for Ganesha mantra in all languages
DO $$
DECLARE
    ganesha_uuid UUID := '550e8400-e29b-41d4-a716-446655440001'::uuid;
    lang_en UUID; lang_sa UUID; lang_ta UUID; lang_hi UUID;
    lang_te UUID; lang_kn UUID; lang_ml UUID; lang_gu UUID;
BEGIN
    -- Get language IDs
    SELECT id INTO lang_en FROM languages WHERE code = 'en';
    SELECT id INTO lang_sa FROM languages WHERE code = 'sa';
    SELECT id INTO lang_ta FROM languages WHERE code = 'ta';
    SELECT id INTO lang_hi FROM languages WHERE code = 'hi';
    SELECT id INTO lang_te FROM languages WHERE code = 'te';
    SELECT id INTO lang_kn FROM languages WHERE code = 'kn';
    SELECT id INTO lang_ml FROM languages WHERE code = 'ml';
    SELECT id INTO lang_gu FROM languages WHERE code = 'gu';

    -- English Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        ganesha_uuid, lang_en,
        '<p><strong>Om Gam Ganapataye Namaha</strong></p><p>ॐ गं गणपतये नमः</p>',
        'Om Gam Ganapataye Namaha',
        'Om (AUM) - Gam (GAHM) - Ga-na-pa-ta-ye (Gah-nah-pah-tah-yeh) - Na-ma-ha (Nah-mah-hah)',
        '<p>Salutations to Lord Ganesha, the remover of obstacles and patron of arts and sciences. This powerful mantra invokes the blessings of Ganesha for success in new endeavors and removal of barriers in life.</p><p><strong>Gam</strong> is the seed syllable (bija mantra) of Lord Ganesha, containing his divine energy and power.</p>',
        ARRAY['Removes obstacles in life', 'Brings success in new ventures', 'Enhances wisdom and intelligence', 'Provides divine protection', 'Improves concentration and focus', 'Grants good fortune in business'],
        '<p><strong>Best Time:</strong> Early morning before starting any new work</p><p><strong>Repetitions:</strong> 108 times using a rudraksha mala</p><p><strong>Posture:</strong> Sit facing east in a clean, peaceful environment</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Sanskrit Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        ganesha_uuid, lang_sa,
        '<p><strong>ॐ गं गणपतये नमः</strong></p><p>गणानां पतिं गणेशं प्रणमामि</p>',
        'Om Gaṃ Gaṇapataye Namaḥ',
        'ॐ (प्रणव) - गं (गकार बीज) - गणपतये (गणपतिदेवाय) - नमः (प्रणाम)',
        '<p>गणपति देवस्य मूल मन्त्रम्। विघ्नहर्ता गणेशस्य आशीर्वादार्थं जपनीयम्।</p><p><strong>गं</strong> इति गणेशस्य बीजमन्त्रम्, सर्वविघ्ननाशकम्।</p>',
        ARRAY['विघ्ननाश', 'नवकार्यसिद्धि', 'बुद्धिवर्धन', 'दिव्यरक्षा', 'एकाग्रता', 'व्यापारवृद्धि'],
        '<p><strong>उत्तमकाल:</strong> प्रातःकाले नवकार्यारम्भे</p><p><strong>जपसंख्या:</strong> रुद्राक्षमाला द्वारा १०८ वारम्</p><p><strong>आसन:</strong> पूर्वमुखी होकर शुद्धस्थाने</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Tamil Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        ganesha_uuid, lang_ta,
        '<p><strong>ஓம் கம் கணபதயே நமஹ</strong></p><p>விநாயகப் பெருமானுக்கு வணக்கம்</p>',
        'Om Gam Gaṇapataye Namaḥ',
        'ஓம் (பிரணவம்) - கம் (கணேச பீஜம்) - கணபதயே (கணபதி தேவனுக்கு) - நமஹ (வணக்கம்)',
        '<p>விக்னேஸ்வரன் விநாயகனின் மூல மந்திரம். தடைகளை நீக்கி, புதிய காரியங்களில் வெற்றி தரும்.</p><p><strong>கம்</strong> என்பது கணேசனின் பீஜ மந்திரம், அனைத்து தடைகளையும் நீக்கும்.</p>',
        ARRAY['தடைகள் நீங்கும்', 'புதிய காரியங்களில் வெற்றி', 'புத்தி வளர்ச்சி', 'தெய்வீக பாதுகாப்பு', 'கவனம் அதிகரிக்கும்', 'வியாபார வளர்ச்சி'],
        '<p><strong>சிறந்த நேரம்:</strong> காலையில் புதிய வேலை தொடங்கும் முன்</p><p><strong>எண்ணிக்கை:</strong> ருத்ராட்ச மாலையில் 108 முறை</p><p><strong>திசை:</strong> கிழக்கு நோக்கி தூய்மையான இடத்தில்</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Hindi Translation
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        ganesha_uuid, lang_hi,
        '<p><strong>ॐ गं गणपतये नमः</strong></p><p>गणेश भगवान को प्रणाम</p>',
        'Om Gam Ganapataye Namah',
        'ॐ (ओम्) - गं (गम्) - गणपतये (गणपति जी को) - नमः (प्रणाम)',
        '<p>भगवान गणेश का मूल मंत्र। विघ्न हरने वाले गणपति बप्पा की कृपा पाने के लिए इस मंत्र का जाप करते हैं।</p><p><strong>गं</strong> गणेश जी का बीज मंत्र है जो सभी बाधाओं को दूर करता है।</p>',
        ARRAY['बाधाओं का नाश', 'नए काम में सफलता', 'बुद्धि का विकास', 'दैवीय सुरक्षा', 'एकाग्रता में वृद्धि', 'व्यापार में उन्नति'],
        '<p><strong>उत्तम समय:</strong> सुबह नया काम शुरू करने से पहले</p><p><strong>जाप संख्या:</strong> रुद्राक्ष की माला से 108 बार</p><p><strong>दिशा:</strong> पूर्व दिशा की ओर मुंह करके स्वच्छ स्थान पर</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

END $$;

-- Add translations for Lakshmi mantra (key languages)
DO $$
DECLARE
    lakshmi_uuid UUID := '550e8400-e29b-41d4-a716-446655440002'::uuid;
    lang_en UUID; lang_sa UUID; lang_ta UUID; lang_hi UUID;
BEGIN
    SELECT id INTO lang_en FROM languages WHERE code = 'en';
    SELECT id INTO lang_sa FROM languages WHERE code = 'sa';
    SELECT id INTO lang_ta FROM languages WHERE code = 'ta';
    SELECT id INTO lang_hi FROM languages WHERE code = 'hi';

    -- English
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        lakshmi_uuid, lang_en,
        '<p><strong>Om Shreem Mahalakshmiyei Namaha</strong></p><p>ॐ श्रीं महालक्ष्म्यै नमः</p>',
        'Om Shreem Mahalakshmiyei Namaha',
        'Om (AUM) - Shreem (SHREEM) - Ma-ha-lak-shmi-yei (Mah-hah-lahk-shmee-yay) - Na-ma-ha (Nah-mah-hah)',
        '<p>Salutations to Goddess Mahalakshmi, the divine mother of wealth, prosperity, and abundance. This sacred mantra invokes the blessings of Lakshmi for material and spiritual prosperity.</p><p><strong>Shreem</strong> is the powerful seed syllable (bija mantra) of Goddess Lakshmi.</p>',
        ARRAY['Attracts wealth and prosperity', 'Brings financial stability', 'Enhances business success', 'Grants material abundance', 'Improves family harmony', 'Bestows spiritual wealth'],
        '<p><strong>Best Time:</strong> Friday evenings, especially during Lakshmi Puja</p><p><strong>Repetitions:</strong> 108 times with a lotus seed mala</p><p><strong>Direction:</strong> Face north or east, light a ghee lamp</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Sanskrit
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        lakshmi_uuid, lang_sa,
        '<p><strong>ॐ श्रीं महालक्ष्म्यै नमः</strong></p><p>धनधान्यादि समृद्ध्यै लक्ष्मीदेव्यै प्रणामः</p>',
        'Om Śrīṃ Mahālakṣmyai Namaḥ',
        'ॐ (प्रणव) - श्रीं (लक्ष्मी बीज) - महालक्ष्म्यै (महालक्ष्मी देव्यै) - नमः (प्रणाम)',
        '<p>श्रीलक्ष्मी देव्याः मूलमन्त्रम्। धनैश्वर्यप्राप्त्यर्थं सर्वसमृद्धिदायिनी महालक्ष्म्याः आराधना।</p><p><strong>श्रीं</strong> इति लक्ष्मीदेव्याः बीजमन्त्रम्।</p>',
        ARRAY['धनसम्पत्प्राप्ति', 'आर्थिकस्थिरता', 'व्यापारवृद्धि', 'गृहसमृद्धि', 'पारिवारिकसुख', 'आध्यात्मिकसम्पत्'],
        '<p><strong>उत्तमकाल:</strong> शुक्रवासरे सायंकाले</p><p><strong>जपसंख्या:</strong> कमलबीजमाला द्वारा १०८ वारम्</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Tamil
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        lakshmi_uuid, lang_ta,
        '<p><strong>ஓம் ஶ்ரீம் மஹாலக்ஷ்மியை நமஹ</strong></p><p>திருமகள் லக்ஷ்மி தேவிக்கு வணக்கம்</p>',
        'Om Śrīm Mahālakṣmiyai Namaḥ',
        'ஓம் (பிரணவம்) - ஶ்ரீம் (லக்ஷ்மி பீஜம்) - மஹாலக்ஷ்மியை (மஹாலக்ஷ்மி தேவிக்கு) - நமஹ (வணக்கம்)',
        '<p>செல்வத்தின் அதிபதியான மஹாலக்ஷ்மி தேவியின் மூல மந்திரம். செல்வம், செழிப்பு, வளம் அனைத்தையும் அருளும்.</p>',
        ARRAY['செல்வ வளம் பெருகும்', 'பொருளாதார நிலைமை மேம்படும்', 'வியாபார வளர்ச்சி', 'குடும்ப நலம்', 'வீட்டில் செழிப்பு'],
        '<p><strong>சிறந்த நேரம்:</strong> வெள்ளிக்கிழமை மாலை</p><p><strong>எண்ணிக்கை:</strong> தாமரை விதை மாலையில் 108 முறை</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

END $$;

-- Add translations for Shiva mantra
DO $$
DECLARE
    shiva_uuid UUID := '550e8400-e29b-41d4-a716-446655440003'::uuid;
    lang_en UUID; lang_sa UUID; lang_ta UUID;
BEGIN
    SELECT id INTO lang_en FROM languages WHERE code = 'en';
    SELECT id INTO lang_sa FROM languages WHERE code = 'sa';
    SELECT id INTO lang_ta FROM languages WHERE code = 'ta';

    -- English
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        shiva_uuid, lang_en,
        '<p><strong>Om Namah Shivaya</strong></p><p>ॐ नमः शिवाय</p><p><em>The Universal Mantra of Lord Shiva</em></p>',
        'Om Namah Shivaya',
        'Om (AUM) - Na-mah (Nah-mah) - Shi-va-ya (Shee-vah-yah)',
        '<p>The most sacred and universal mantra of Lord Shiva. This five-syllable mantra (Panchakshari) represents the five elements and is considered one of the most powerful mantras in Hinduism.</p><p>It means "I bow to Shiva" - the auspicious one, the transformer, and the supreme consciousness.</p>',
        ARRAY['Spiritual awakening and growth', 'Inner peace and tranquility', 'Purification of mind and soul', 'Protection from negative energies', 'Enhanced meditation and focus', 'Liberation from worldly attachments'],
        '<p><strong>Best Time:</strong> Can be chanted anytime, especially during meditation</p><p><strong>Repetitions:</strong> 108 times or continuous chanting</p><p><strong>Special:</strong> This mantra can be chanted without any specific rituals</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

    -- Sanskrit
    INSERT INTO mantra_translations (mantra_id, language_id, text, transliteration, pronunciation_guide, meaning, benefits, usage_notes)
    VALUES (
        shiva_uuid, lang_sa,
        '<p><strong>ॐ नमः शिवाय</strong></p><p>पञ्चाक्षरी महामन्त्रम्</p>',
        'Om Namaḥ Śivāya',
        'ॐ (प्रणव) - नमः (प्रणाम) - शिवाय (शिवाय देवाय)',
        '<p>भगवान् शिवस्य पञ्चाक्षरी महामन्त्रम्। पञ्चतत्त्वात्मकं सर्वोत्कृष्टं मन्त्रम्।</p><p>शिवाय नमः इति अर्थः - कल्याणकारिणे परमेश्वराय प्रणामः।</p>',
        ARRAY['आध्यात्मिकोन्नति', 'चित्तशान्ति', 'मनःशुद्धि', 'नकारात्मकशक्तिनिवारण', 'ध्यानसाधना', 'मोक्षप्राप्ति'],
        '<p><strong>उत्तमकाल:</strong> सर्वकालं जप्यम्</p><p><strong>जपसंख्या:</strong> १०८ वारम् अथवा निरन्तरजपः</p>'
    ) ON CONFLICT (mantra_id, language_id) DO NOTHING;

END $$;

-- ============================================================================
-- PART 6: CREATE FUNCTIONS, TRIGGERS, AND POLICIES
-- ============================================================================

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

-- Enable RLS
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantra_translations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (with safe creation)
DO $$
BEGIN
    -- Create policy for languages if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'languages'
        AND policyname = 'Public can read languages'
    ) THEN
        CREATE POLICY "Public can read languages" ON languages
            FOR SELECT USING (is_active = true);
    END IF;

    -- Create policy for mantra_translations if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'mantra_translations'
        AND policyname = 'Public can read mantra_translations'
    ) THEN
        CREATE POLICY "Public can read mantra_translations" ON mantra_translations
            FOR SELECT USING (true);
    END IF;
END $$;

-- Create policies for admin access (if profiles table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        -- Create admin policy for languages if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE tablename = 'languages'
            AND policyname = 'Admins can manage languages'
        ) THEN
            CREATE POLICY "Admins can manage languages" ON languages
                FOR ALL USING (
                    EXISTS (
                        SELECT 1 FROM profiles
                        WHERE profiles.id = auth.uid()
                        AND profiles.role = 'admin'
                    )
                );
        END IF;

        -- Create admin policy for mantra_translations if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE tablename = 'mantra_translations'
            AND policyname = 'Admins can manage mantra_translations'
        ) THEN
            CREATE POLICY "Admins can manage mantra_translations" ON mantra_translations
                FOR ALL USING (
                    EXISTS (
                        SELECT 1 FROM profiles
                        WHERE profiles.id = auth.uid()
                        AND profiles.role = 'admin'
                    )
                );
        END IF;
    END IF;
END $$;

-- Create view for easy mantra querying with translations (safe creation)
DROP VIEW IF EXISTS mantras_with_translations;
CREATE VIEW mantras_with_translations AS
SELECT
    m.*,
    json_agg(
        json_build_object(
            'id', mt.id,
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

-- Set primary language for demo mantras
UPDATE mantras SET primary_language_id = (SELECT id FROM languages WHERE code = 'sa')
WHERE id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003');

-- ============================================================================
-- PART 7: VERIFICATION QUERIES
-- ============================================================================

-- Summary of what was created
SELECT
    'SETUP COMPLETE! 🎉' as status,
    'Multi-language mantra system ready' as message;

-- Check demo mantras with translation counts
SELECT
    '📊 Demo Mantras Overview' as section,
    m.title,
    m.view_count,
    COUNT(mt.id) as translation_count,
    STRING_AGG(l.name, ', ' ORDER BY l.sort_order) as available_languages
FROM mantras m
LEFT JOIN mantra_translations mt ON m.id = mt.mantra_id
LEFT JOIN languages l ON mt.language_id = l.id
WHERE m.id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003')
GROUP BY m.id, m.title, m.view_count
ORDER BY m.view_count DESC;

-- Check languages
SELECT
    '🌍 Available Languages' as section,
    code,
    name,
    native_name,
    sort_order
FROM languages
WHERE is_active = true
ORDER BY sort_order;

-- Final success message
SELECT
    '✅ SUCCESS' as result,
    'Your multi-language mantra system is ready!' as message,
    'Visit /admin/mantras to manage translations' as next_step,
    'Visit /mantra/550e8400-e29b-41d4-a716-446655440001 to see the result' as demo_url;
