-- Quick check to see if translations are being saved
-- Run this to debug the translation issue

-- 1. Check if any translations exist at all
SELECT 
    'Total translations in database' as check_type,
    COUNT(*) as count
FROM mantra_translations;

-- 2. Check recent translations (last 24 hours)
SELECT 
    'Recent translations (last 24h)' as check_type,
    COUNT(*) as count
FROM mantra_translations 
WHERE created_at > NOW() - INTERVAL '24 hours';

-- 3. Check if languages table has data
SELECT 
    'Active languages' as check_type,
    COUNT(*) as count
FROM languages 
WHERE is_active = true;

-- 4. Check if mantras table has data
SELECT 
    'Total mantras' as check_type,
    COUNT(*) as count
FROM mantras;

-- 5. Check RLS policies that might be blocking inserts
SELECT 
    tablename,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'mantra_translations'
AND cmd = 'INSERT';

-- 6. Test if we can manually insert a translation (replace with actual IDs)
-- First, get a sample mantra ID and language ID
SELECT 
    'Sample mantra for testing' as info,
    m.id as mantra_id,
    m.title,
    l.id as language_id,
    l.name as language_name
FROM mantras m
CROSS JOIN languages l
WHERE l.code = 'en'
LIMIT 1;

-- 7. Check if the mantra_translations table structure is correct
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'mantra_translations'
ORDER BY ordinal_position;
