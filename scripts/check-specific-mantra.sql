-- Check translations for the specific Ganesha mantra
-- This will tell us if the translations exist in the database

-- 1. Check if the mantra exists
SELECT 
    'Mantra Check' as test,
    id,
    title,
    text
FROM mantras 
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- 2. Check if translations exist for this mantra
SELECT 
    'Translation Check' as test,
    mt.id,
    mt.mantra_id,
    mt.language_id,
    l.name as language_name,
    l.code as language_code,
    LENGTH(mt.text) as text_length,
    LEFT(mt.text, 100) as text_preview
FROM mantra_translations mt
JOIN languages l ON mt.language_id = l.id
WHERE mt.mantra_id = '550e8400-e29b-41d4-a716-446655440001'
ORDER BY l.sort_order;

-- 3. Check what the API query should return (simulate the API query)
SELECT 
    'API Simulation' as test,
    mt.*,
    json_build_object(
        'id', l.id,
        'code', l.code,
        'name', l.name,
        'native_name', l.native_name,
        'direction', l.direction
    ) as languages
FROM mantra_translations mt
JOIN languages l ON mt.language_id = l.id AND l.is_active = true
WHERE mt.mantra_id = '550e8400-e29b-41d4-a716-446655440001'
ORDER BY l.sort_order;

-- 4. Check if there are ANY translations in the database
SELECT 
    'All Translations Count' as test,
    COUNT(*) as total_translations
FROM mantra_translations;

-- 5. Check if languages are active
SELECT 
    'Active Languages' as test,
    COUNT(*) as active_languages
FROM languages 
WHERE is_active = true;
