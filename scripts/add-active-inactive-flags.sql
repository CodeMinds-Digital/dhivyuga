-- Add Active/Inactive flags for Deities and Categories
-- This script adds is_active columns and updates existing data

-- 1. Add is_active column to deities table
ALTER TABLE deities 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Add is_active column to categories table  
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 3. Set all existing deities as active (default behavior)
UPDATE deities SET is_active = true WHERE is_active IS NULL;

-- 4. Set all existing categories as active (default behavior)
UPDATE categories SET is_active = true WHERE is_active IS NULL;

-- 5. Add indexes for better performance on active status queries
CREATE INDEX IF NOT EXISTS idx_deities_is_active ON deities(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- 6. Add comments to document the purpose
COMMENT ON COLUMN deities.is_active IS 'Flag to control visibility of deity in frontend. true = visible, false = hidden';
COMMENT ON COLUMN categories.is_active IS 'Flag to control visibility of category in frontend. true = visible, false = hidden';

-- 7. Verify the changes
SELECT 
    'Deities Table Structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'deities' 
AND column_name IN ('id', 'name', 'is_active')
ORDER BY ordinal_position;

SELECT 
    'Categories Table Structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'categories' 
AND column_name IN ('id', 'name', 'is_active')
ORDER BY ordinal_position;

-- 8. Show current active counts
SELECT 
    'Active Deities Count' as metric,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE is_active = true) as active_count,
    COUNT(*) FILTER (WHERE is_active = false) as inactive_count
FROM deities;

SELECT 
    'Active Categories Count' as metric,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE is_active = true) as active_count,
    COUNT(*) FILTER (WHERE is_active = false) as inactive_count
FROM categories;

-- 9. Sample queries to test the new functionality
-- Get only active deities
SELECT id, name, is_active FROM deities WHERE is_active = true ORDER BY name;

-- Get only active categories  
SELECT id, name, is_active FROM categories WHERE is_active = true ORDER BY name;

-- Example: Deactivate a specific deity (uncomment to use)
-- UPDATE deities SET is_active = false WHERE name = 'Some Deity Name';

-- Example: Deactivate a specific category (uncomment to use)
-- UPDATE categories SET is_active = false WHERE name = 'Some Category Name';
