-- Test Active/Inactive functionality for Deities and Categories
-- Run this after implementing the active/inactive flags

-- 1. Show current status of all deities
SELECT 
    'Current Deities Status' as info,
    id,
    name,
    is_active,
    created_at
FROM deities 
ORDER BY name;

-- 2. Show current status of all categories
SELECT 
    'Current Categories Status' as info,
    id,
    name,
    is_active,
    created_at
FROM categories 
ORDER BY name;

-- 3. Test deactivating a deity (example)
-- UPDATE deities SET is_active = false WHERE name = 'Ganesha';

-- 4. Test deactivating a category (example)
-- UPDATE categories SET is_active = false WHERE name = 'Wealth';

-- 5. Test API queries - only active deities
SELECT 
    'Active Deities (Frontend will see)' as info,
    id,
    name,
    is_active
FROM deities 
WHERE is_active = true
ORDER BY name;

-- 6. Test API queries - only active categories
SELECT 
    'Active Categories (Frontend will see)' as info,
    id,
    name,
    is_active
FROM categories 
WHERE is_active = true
ORDER BY name;

-- 7. Admin view - all deities (active and inactive)
SELECT 
    'Admin View - All Deities' as info,
    id,
    name,
    is_active,
    CASE 
        WHEN is_active THEN 'Visible to users'
        ELSE 'Hidden from users'
    END as frontend_status
FROM deities 
ORDER BY is_active DESC, name;

-- 8. Admin view - all categories (active and inactive)
SELECT 
    'Admin View - All Categories' as info,
    id,
    name,
    is_active,
    CASE 
        WHEN is_active THEN 'Visible to users'
        ELSE 'Hidden from users'
    END as frontend_status
FROM categories 
ORDER BY is_active DESC, name;

-- 9. Count active vs inactive
SELECT 
    'Deities Summary' as type,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE is_active = true) as active,
    COUNT(*) FILTER (WHERE is_active = false) as inactive
FROM deities

UNION ALL

SELECT 
    'Categories Summary' as type,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE is_active = true) as active,
    COUNT(*) FILTER (WHERE is_active = false) as inactive
FROM categories;

-- 10. Example: Reactivate all deities and categories (uncomment to use)
-- UPDATE deities SET is_active = true;
-- UPDATE categories SET is_active = true;
