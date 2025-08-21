-- Comprehensive Mantra Database Seed Script
-- This script adds authentic categories, deities, and mantras to your Dhivyuga database

-- Clear existing data (optional - remove if you want to keep existing data)
-- DELETE FROM mantra_descriptions;
-- DELETE FROM mantras;
-- DELETE FROM categories;
-- DELETE FROM deities;
-- DELETE FROM recitation_counts;
-- DELETE FROM recitation_times;
-- DELETE FROM kalams;
-- DELETE FROM time_ranges;

-- Add unique constraints to enable ON CONFLICT functionality (ignore errors if constraints already exist)
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
('Chandra', 'Moon god, ruler of mind, emotions, and intuition'),
('Brahma', 'Creator of the universe, source of knowledge and creativity'),
('Indra', 'King of gods, ruler of heaven, controller of rain and storms'),
('Agni', 'Fire god, purifier, messenger between humans and gods'),
('Vayu', 'Wind god, life force, breath of life'),
('Varuna', 'Water god, keeper of cosmic law and justice'),
('Kubera', 'God of wealth, treasurer of gods, guardian of riches'),
('Kartikeya', 'God of war, commander of gods army, remover of sins'),
('Ganga', 'Sacred river goddess, purifier of sins, bestower of liberation')
ON CONFLICT (name) DO NOTHING;

-- Insert recitation counts with spiritual significance
INSERT INTO recitation_counts (count_value, description) VALUES
(1, 'Single recitation for quick prayer'),
(3, 'Triple recitation for basic practice'),
(5, 'Five times for daily devotion'),
(11, 'Eleven times for quick daily practice'),
(21, 'Twenty-one times for focused intention'),
(27, 'Standard practice count'),
(54, 'Half mala for moderate practice'),
(108, 'Full mala count - most auspicious'),
(1008, 'Ten malas for special occasions'),
(10008, 'Major spiritual undertakings and festivals')
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
('Sunset', 'During sunset - for completion and gratitude'),
('Full Moon', 'On full moon days - for enhanced spiritual power')
ON CONFLICT (name) DO NOTHING;

-- Insert kalams (auspicious and inauspicious time periods)
INSERT INTO kalams (name, planet, description, is_auspicious) VALUES
('Rahu Kalam', 'Rahu', 'Inauspicious time ruled by Rahu - avoid new beginnings', false),
('Yama Kalam', 'Yama', 'Time of death god - inauspicious for important activities', false),
('Gulika Kalam', 'Gulika', 'Inauspicious time - avoid important work', false),
('Surya Hora', 'Surya', 'Sun hour - auspicious for leadership and authority', true),
('Chandra Hora', 'Chandra', 'Moon hour - good for emotional and creative work', true),
('Mangal Hora', 'Mars', 'Mars hour - good for courage and strength', true),
('Budha Hora', 'Mercury', 'Mercury hour - good for learning and communication', true),
('Guru Hora', 'Jupiter', 'Jupiter hour - most auspicious for spiritual activities', true),
('Shukra Hora', 'Venus', 'Venus hour - good for love and artistic pursuits', true),
('Shani Hora', 'Saturn', 'Saturn hour - good for discipline and hard work', true)
ON CONFLICT (name) DO NOTHING;

-- Insert time ranges for specific practices
INSERT INTO time_ranges (start_time, end_time, description) VALUES
('04:00:00', '06:00:00', 'Brahma Muhurta - most sacred time for spiritual practice'),
('06:00:00', '08:00:00', 'Early morning - ideal for meditation and mantras'),
('08:00:00', '10:00:00', 'Morning hours - good for new beginnings'),
('10:00:00', '12:00:00', 'Late morning - productive time for work mantras'),
('12:00:00', '14:00:00', 'Noon time - powerful for Surya mantras'),
('14:00:00', '16:00:00', 'Afternoon - good for prosperity mantras'),
('16:00:00', '18:00:00', 'Late afternoon - time for gratitude mantras'),
('18:00:00', '20:00:00', 'Evening - ideal for family and peace mantras'),
('20:00:00', '22:00:00', 'Night - good for protection mantras'),
('22:00:00', '04:00:00', 'Late night - for advanced practitioners only')
ON CONFLICT (start_time, end_time) DO NOTHING;

-- Insert comprehensive mantras with authentic Sanskrit texts
-- Ganesha Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Gam Ganapataye Namaha',
    'ॐ गं गणपतये नमः',
    c.id, d.id, rc.id, rt.id, 245
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Obstacle Removal' AND d.name = 'Ganesha'
AND rc.count_value = 108 AND rt.name = 'Morning';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Vakratunda Mahakaya Mantra',
    'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    c.id, d.id, rc.id, rt.id, 189
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Success & Achievement' AND d.name = 'Ganesha'
AND rc.count_value = 21 AND rt.name = 'Morning';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Ganesha Gayatri Mantra',
    'ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि तन्नो दन्ति प्रचोदयात्॥',
    c.id, d.id, rc.id, rt.id, 156
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Wisdom & Knowledge' AND d.name = 'Ganesha'
AND rc.count_value = 108 AND rt.name = 'Brahma Muhurta';

-- Lakshmi Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Shreem Mahalakshmiyei Namaha',
    'ॐ श्रीं महालक्ष्म्यै नमः',
    c.id, d.id, rc.id, rt.id, 298
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Wealth & Prosperity' AND d.name = 'Lakshmi'
AND rc.count_value = 108 AND rt.name = 'Morning';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Lakshmi Gayatri Mantra',
    'ॐ महालक्ष्म्यै च विद्महे विष्णुपत्न्यै च धीमहि तन्नो लक्ष्मी प्रचोदयात्॥',
    c.id, d.id, rc.id, rt.id, 167
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Wealth & Prosperity' AND d.name = 'Lakshmi'
AND rc.count_value = 108 AND rt.name = 'Evening';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Lakshmi Ashtakshara Mantra',
    'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः',
    c.id, d.id, rc.id, rt.id, 134
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Good Fortune & Luck' AND d.name = 'Lakshmi'
AND rc.count_value = 54 AND rt.name = 'Evening';

-- Saraswati Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Aim Saraswatyai Namaha',
    'ॐ ऐं सरस्वत्यै नमः',
    c.id, d.id, rc.id, rt.id, 223
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Wisdom & Knowledge' AND d.name = 'Saraswati'
AND rc.count_value = 108 AND rt.name = 'Morning';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Saraswati Gayatri Mantra',
    'ॐ वाग्देव्यै च विद्महे कामराजाय धीमहि तन्नो देवी प्रचोदयात्॥',
    c.id, d.id, rc.id, rt.id, 145
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Wisdom & Knowledge' AND d.name = 'Saraswati'
AND rc.count_value = 108 AND rt.name = 'Brahma Muhurta';

-- Hanuman Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Hanumate Namaha',
    'ॐ हनुमते नमः',
    c.id, d.id, rc.id, rt.id, 267
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Strength & Courage' AND d.name = 'Hanuman'
AND rc.count_value = 108 AND rt.name = 'Morning';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Hanuman Chalisa Opening',
    'श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि। बरनउं रघुबर बिमल जसु जो दायकु फल चारि॥',
    c.id, d.id, rc.id, rt.id, 198
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Devotion & Surrender' AND d.name = 'Hanuman'
AND rc.count_value = 1 AND rt.name = 'Anytime';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Hanuman Beej Mantra',
    'ॐ हं हनुमते रुद्रात्मकाय हुं फट्',
    c.id, d.id, rc.id, rt.id, 156
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Protection & Safety' AND d.name = 'Hanuman'
AND rc.count_value = 108 AND rt.name = 'Evening';

-- Shiva Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Namah Shivaya',
    'ॐ नमः शिवाय',
    c.id, d.id, rc.id, rt.id, 412
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Universal Mantras' AND d.name = 'Shiva'
AND rc.count_value = 108 AND rt.name = 'Anytime';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Mahamrityunjaya Mantra',
    'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥',
    c.id, d.id, rc.id, rt.id, 356
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Health & Healing' AND d.name = 'Shiva'
AND rc.count_value = 108 AND rt.name = 'Brahma Muhurta';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Shiva Gayatri Mantra',
    'ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि तन्नो रुद्रः प्रचोदयात्॥',
    c.id, d.id, rc.id, rt.id, 178
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Spiritual Growth' AND d.name = 'Shiva'
AND rc.count_value = 108 AND rt.name = 'Evening';

-- Vishnu Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Namo Narayanaya',
    'ॐ नमो नारायणाय',
    c.id, d.id, rc.id, rt.id, 289
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Protection & Safety' AND d.name = 'Vishnu'
AND rc.count_value = 108 AND rt.name = 'Morning';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Vishnu Gayatri Mantra',
    'ॐ नारायणाय विद्महे वासुदेवाय धीमहि तन्नो विष्णुः प्रचोदयात्॥',
    c.id, d.id, rc.id, rt.id, 167
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Peace & Tranquility' AND d.name = 'Vishnu'
AND rc.count_value = 108 AND rt.name = 'Evening';

-- Krishna Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Hare Krishna Maha Mantra',
    'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥',
    c.id, d.id, rc.id, rt.id, 445
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Devotion & Surrender' AND d.name = 'Krishna'
AND rc.count_value = 108 AND rt.name = 'Anytime';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Kleem Krishnaya Namaha',
    'ॐ क्लीं कृष्णाय नमः',
    c.id, d.id, rc.id, rt.id, 234
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Love & Relationships' AND d.name = 'Krishna'
AND rc.count_value = 108 AND rt.name = 'Evening';

-- Rama Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Sri Ramaya Namaha',
    'ॐ श्री रामाय नमः',
    c.id, d.id, rc.id, rt.id, 198
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Success & Achievement' AND d.name = 'Rama'
AND rc.count_value = 108 AND rt.name = 'Morning';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Ram Raksha Mantra',
    'श्री राम चन्द्र कृपालु भजु मन हरण भव भय दारुणम्। नव कंज लोचन कंज मुख कर कंज पद कंजारुणम्॥',
    c.id, d.id, rc.id, rt.id, 167
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Protection & Safety' AND d.name = 'Rama'
AND rc.count_value = 21 AND rt.name = 'Evening';

-- Durga Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Dum Durgayei Namaha',
    'ॐ दुं दुर्गायै नमः',
    c.id, d.id, rc.id, rt.id, 267
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Protection & Safety' AND d.name = 'Devi Durga'
AND rc.count_value = 108 AND rt.name = 'Morning';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Durga Gayatri Mantra',
    'ॐ गिरिजायै विद्महे शिवप्रियायै धीमहि तन्नो दुर्गा प्रचोदयात्॥',
    c.id, d.id, rc.id, rt.id, 189
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Strength & Courage' AND d.name = 'Devi Durga'
AND rc.count_value = 108 AND rt.name = 'Evening';

-- Surya Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Suryaya Namaha',
    'ॐ सूर्याय नमः',
    c.id, d.id, rc.id, rt.id, 234
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Health & Healing' AND d.name = 'Surya'
AND rc.count_value = 108 AND rt.name = 'Sunrise';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Gayatri Mantra',
    'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    c.id, d.id, rc.id, rt.id, 567
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Universal Mantras' AND d.name = 'Surya'
AND rc.count_value = 108 AND rt.name = 'Brahma Muhurta';

-- Kali Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Kreem Kalikayei Namaha',
    'ॐ क्रीं कालिकायै नमः',
    c.id, d.id, rc.id, rt.id, 178
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Protection & Safety' AND d.name = 'Kali'
AND rc.count_value = 108 AND rt.name = 'Night';

-- Universal Mantras
INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'Om Mani Padme Hum',
    'ॐ मणि पद्मे हूँ',
    c.id, d.id, rc.id, rt.id, 389
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Universal Mantras' AND d.name = 'Devi Durga'
AND rc.count_value = 108 AND rt.name = 'Anytime';

INSERT INTO mantras (title, text, category_id, deity_id, count_id, time_id, view_count)
SELECT
    'So Hum Mantra',
    'सो हम्',
    c.id, d.id, rc.id, rt.id, 298
FROM categories c, deities d, recitation_counts rc, recitation_times rt
WHERE c.name = 'Meditation & Focus' AND d.name = 'Shiva'
AND rc.count_value = 108 AND rt.name = 'Anytime';

-- Insert detailed descriptions for key mantras
INSERT INTO mantra_descriptions (mantra_id, meaning, transliteration, pronunciation_guide, benefits, historical_context, spiritual_significance, usage_instructions, precautions, related_scriptures)
SELECT
    m.id,
    'Salutations to Lord Ganesha. This is one of the most powerful and popular mantras dedicated to Lord Ganesha, the remover of obstacles and patron of arts and sciences. It invokes his blessings for success in new endeavors and removal of barriers in life.',
    'Om Gam Ganapataye Namaha',
    'Om (AUM) - Gam (GAHM) - Ga-na-pa-ta-ye (Gah-nah-pah-tah-yeh) - Na-ma-ha (Nah-mah-hah)',
    ARRAY['Removes obstacles', 'Brings success in new ventures', 'Enhances wisdom and intelligence', 'Provides protection', 'Improves concentration'],
    'This mantra has been chanted for thousands of years and is mentioned in various Puranas. It is traditionally recited before starting any new work, business, or spiritual practice.',
    'Ganesha represents the removal of obstacles on both material and spiritual levels. The mantra helps align the practitioner with divine grace and cosmic intelligence.',
    'Chant 108 times daily, preferably in the morning. Sit facing east, light a lamp or incense, and chant with devotion and concentration. Can be chanted mentally or aloud.',
    'Should be chanted with respect and devotion. Avoid chanting in impure places or states of mind.',
    ARRAY['Ganesha Purana', 'Mudgala Purana', 'Ganapati Atharvashirsha']
FROM mantras m
WHERE m.title = 'Om Gam Ganapataye Namaha';

INSERT INTO mantra_descriptions (mantra_id, meaning, transliteration, pronunciation_guide, benefits, historical_context, spiritual_significance, usage_instructions, precautions, related_scriptures)
SELECT
    m.id,
    'Salutations to Goddess Lakshmi. This powerful mantra invokes the blessings of Goddess Lakshmi for wealth, prosperity, abundance, and good fortune. Shreem is the seed sound (beej mantra) of Lakshmi.',
    'Om Shreem Mahalakshmiyei Namaha',
    'Om (AUM) - Shreem (SHREEM) - Ma-ha-lak-shmi-yei (Mah-hah-lahk-shmee-yay) - Na-ma-ha (Nah-mah-hah)',
    ARRAY['Attracts wealth and prosperity', 'Brings financial stability', 'Enhances abundance in all areas', 'Improves business success', 'Brings good fortune'],
    'This mantra is found in the Lakshmi Tantra and various Puranas. It has been used by devotees for centuries to invoke the grace of the wealth goddess.',
    'Lakshmi represents not just material wealth but also spiritual abundance, beauty, and grace. The mantra helps align with the energy of abundance and prosperity.',
    'Chant 108 times daily, preferably on Friday evenings or during Lakshmi Puja. Light a ghee lamp and offer flowers while chanting. Face north or east while chanting.',
    'Should be chanted with pure intentions. Avoid using for selfish or harmful purposes. Maintain cleanliness and devotion.',
    ARRAY['Lakshmi Tantra', 'Vishnu Purana', 'Sri Suktam']
FROM mantras m
WHERE m.title = 'Om Shreem Mahalakshmiyei Namaha';
