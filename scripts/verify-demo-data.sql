-- Verification script for demo multi-language data
-- Run this to check if the demo data was loaded correctly

-- 1. Check if demo mantras exist
SELECT 
    'Demo Mantras Check' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) >= 3 THEN '✅ PASS' 
        ELSE '❌ FAIL' 
    END as status
FROM mantras 
WHERE id IN ('demo-ganesha-001', 'demo-lakshmi-001', 'demo-shiva-001');

-- 2. Check languages
SELECT 
    'Languages Check' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) >= 10 THEN '✅ PASS' 
        ELSE '❌ FAIL' 
    END as status
FROM languages 
WHERE is_active = true;

-- 3. Check translations count
SELECT 
    'Translations Check' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) >= 15 THEN '✅ PASS' 
        ELSE '❌ FAIL' 
    END as status
FROM mantra_translations 
WHERE mantra_id IN ('demo-ganesha-001', 'demo-lakshmi-001', 'demo-shiva-001');

-- 4. Detailed breakdown by mantra
SELECT 
    m.title,
    m.view_count,
    COUNT(mt.id) as translation_count,
    STRING_AGG(l.name, ', ' ORDER BY l.sort_order) as available_languages
FROM mantras m
LEFT JOIN mantra_translations mt ON m.id = mt.mantra_id
LEFT JOIN languages l ON mt.language_id = l.id
WHERE m.id IN ('demo-ganesha-001', 'demo-lakshmi-001', 'demo-shiva-001')
GROUP BY m.id, m.title, m.view_count
ORDER BY m.view_count DESC;

-- 5. Check specific content for Ganesha mantra
SELECT 
    l.name as language,
    l.native_name,
    CASE WHEN LENGTH(mt.text) > 50 THEN '✅ Has Content' ELSE '❌ Missing' END as text_status,
    CASE WHEN mt.transliteration IS NOT NULL THEN '✅ Yes' ELSE '❌ No' END as has_transliteration,
    CASE WHEN mt.meaning IS NOT NULL THEN '✅ Yes' ELSE '❌ No' END as has_meaning,
    COALESCE(ARRAY_LENGTH(mt.benefits, 1), 0) as benefit_count
FROM mantra_translations mt
JOIN languages l ON mt.language_id = l.id
WHERE mt.mantra_id = 'demo-ganesha-001'
ORDER BY l.sort_order;

-- 6. Test the view
SELECT 
    'View Test' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) >= 3 THEN '✅ PASS' 
        ELSE '❌ FAIL' 
    END as status
FROM mantras_with_translations 
WHERE id IN ('demo-ganesha-001', 'demo-lakshmi-001', 'demo-shiva-001');

-- 7. Sample translation content (first 100 chars)
SELECT 
    m.title,
    l.name as language,
    LEFT(mt.text, 100) || '...' as sample_text
FROM mantras m
JOIN mantra_translations mt ON m.id = mt.mantra_id
JOIN languages l ON mt.language_id = l.id
WHERE m.id = 'demo-ganesha-001'
AND l.code IN ('en', 'sa', 'ta', 'hi')
ORDER BY l.sort_order;
