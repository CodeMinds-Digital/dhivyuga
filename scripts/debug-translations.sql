-- Debug script to check translations
-- Run this to see what translations exist in your database

-- 1. Check all mantras and their translation counts
SELECT 
    m.id,
    m.title,
    COUNT(mt.id) as translation_count,
    STRING_AGG(l.name, ', ' ORDER BY l.sort_order) as available_languages
FROM mantras m
LEFT JOIN mantra_translations mt ON m.id = mt.mantra_id
LEFT JOIN languages l ON mt.language_id = l.id
GROUP BY m.id, m.title
HAVING COUNT(mt.id) > 0
ORDER BY translation_count DESC;

-- 2. Check specific mantra translations (replace with your mantra ID)
-- Replace 'YOUR_MANTRA_ID' with the actual ID you're testing
SELECT 
    m.title as mantra_title,
    l.name as language,
    l.code as language_code,
    LENGTH(mt.text) as text_length,
    mt.transliteration,
    CASE WHEN mt.meaning IS NOT NULL THEN 'Yes' ELSE 'No' END as has_meaning,
    ARRAY_LENGTH(mt.benefits, 1) as benefit_count
FROM mantras m
JOIN mantra_translations mt ON m.id = mt.mantra_id
JOIN languages l ON mt.language_id = l.id
WHERE m.id = 'YOUR_MANTRA_ID'  -- Replace with actual mantra ID
ORDER BY l.sort_order;

-- 3. Check the API response format (simulating what the API returns)
SELECT 
    m.*,
    json_agg(
        json_build_object(
            'id', mt.id,
            'language_id', mt.language_id,
            'text', mt.text,
            'transliteration', mt.transliteration,
            'pronunciation_guide', mt.pronunciation_guide,
            'meaning', mt.meaning,
            'benefits', mt.benefits,
            'usage_notes', mt.usage_notes,
            'languages', json_build_object(
                'id', l.id,
                'code', l.code,
                'name', l.name,
                'native_name', l.native_name,
                'direction', l.direction
            )
        ) ORDER BY l.sort_order
    ) FILTER (WHERE mt.id IS NOT NULL) AS translations
FROM mantras m
LEFT JOIN mantra_translations mt ON m.id = mt.mantra_id
LEFT JOIN languages l ON mt.language_id = l.id AND l.is_active = true
WHERE m.id = 'YOUR_MANTRA_ID'  -- Replace with actual mantra ID
GROUP BY m.id;

-- 4. Check if RLS policies are blocking access
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('mantra_translations', 'languages');

-- 5. Simple test - just get all translations
SELECT 
    mt.id,
    m.title,
    l.name as language,
    LEFT(mt.text, 50) as text_preview
FROM mantra_translations mt
JOIN mantras m ON mt.mantra_id = m.id
JOIN languages l ON mt.language_id = l.id
ORDER BY m.title, l.sort_order;
