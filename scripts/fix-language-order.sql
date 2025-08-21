-- Fix the language sort order to show Tamil first
-- This will correct the tab order in both frontend and admin panel

UPDATE languages SET sort_order = 1 WHERE code = 'ta';  -- Tamil first
UPDATE languages SET sort_order = 2 WHERE code = 'sa';  -- Sanskrit second
UPDATE languages SET sort_order = 3 WHERE code = 'hi';  -- Hindi third
UPDATE languages SET sort_order = 4 WHERE code = 'en';  -- English fourth
UPDATE languages SET sort_order = 5 WHERE code = 'te';  -- Telugu fifth
UPDATE languages SET sort_order = 6 WHERE code = 'kn';  -- Kannada sixth
UPDATE languages SET sort_order = 7 WHERE code = 'ml';  -- Malayalam seventh
UPDATE languages SET sort_order = 8 WHERE code = 'gu';  -- Gujarati eighth
UPDATE languages SET sort_order = 9 WHERE code = 'bn';  -- Bengali ninth
UPDATE languages SET sort_order = 10 WHERE code = 'or'; -- Odia tenth

-- Verify the new order
SELECT 
    code,
    name,
    native_name,
    sort_order
FROM languages 
WHERE is_active = true
ORDER BY sort_order;
