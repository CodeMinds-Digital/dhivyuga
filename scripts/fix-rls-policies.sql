-- Fix RLS policies to allow proper access to translations
-- This script fixes the Row Level Security policies that are blocking access

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Public can read mantra_translations" ON mantra_translations;
DROP POLICY IF EXISTS "Admins can manage mantra_translations" ON mantra_translations;

-- 2. Create more permissive policies for public read access
CREATE POLICY "Allow public read access to mantra_translations" 
ON mantra_translations FOR SELECT 
TO anon, authenticated 
USING (true);

-- 3. Create policy for authenticated users to insert/update (for admin panel)
CREATE POLICY "Allow authenticated users to manage mantra_translations" 
ON mantra_translations FOR ALL 
TO authenticated 
USING (true);

-- 4. Also fix languages table policies if needed
DROP POLICY IF EXISTS "Public can read languages" ON languages;
DROP POLICY IF EXISTS "Admins can manage languages" ON languages;

CREATE POLICY "Allow public read access to languages" 
ON languages FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage languages" 
ON languages FOR ALL 
TO authenticated 
USING (true);

-- 5. Verify the policies are working by testing a simple query
-- This should return data if policies are working correctly
SELECT 
    'Policy Test' as test,
    COUNT(*) as translation_count
FROM mantra_translations mt
JOIN languages l ON mt.language_id = l.id
WHERE mt.mantra_id = '550e8400-e29b-41d4-a716-446655440001';

-- 6. Test the exact query that the API uses
SELECT 
    'API Query Test' as test,
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
