-- Temporarily disable RLS for testing
-- WARNING: This removes security - only use for development/testing

-- Disable RLS on translation tables
ALTER TABLE mantra_translations DISABLE ROW LEVEL SECURITY;
ALTER TABLE languages DISABLE ROW LEVEL SECURITY;

-- Test query after disabling RLS
SELECT 
    'RLS Disabled Test' as test,
    COUNT(*) as translation_count
FROM mantra_translations 
WHERE mantra_id = '550e8400-e29b-41d4-a716-446655440001';

-- Show current RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('mantra_translations', 'languages');

-- Note: To re-enable RLS later, run:
-- ALTER TABLE mantra_translations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
