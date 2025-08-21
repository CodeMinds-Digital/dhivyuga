# Multi-Language Support Migration Guide

## Overview
This migration adds comprehensive multi-language support to the Dhivyuga mantra database, including:

- **Languages table**: Stores supported languages (Sanskrit, Tamil, Hindi, etc.)
- **Mantra translations table**: Stores language-specific content with rich text support
- **WYSIWYG editor**: Admin interface for rich text editing
- **Multi-language frontend**: Display mantras in multiple languages with language switching

## Database Migration

### Step 1: Run the Migration Script
Copy and paste the contents of `scripts/add-multilanguage-support.sql` into your Supabase SQL Editor and execute it.

This will:
1. Create `languages` and `mantra_translations` tables
2. Add unique constraints for ON CONFLICT support
3. Insert default languages (English, Sanskrit, Tamil, Hindi, etc.)
4. Migrate existing mantra text to English translations
5. Update search functionality to include translations
6. Set up proper RLS policies

### Step 2: Verify Migration
After running the migration, verify that:

```sql
-- Check languages table
SELECT * FROM languages ORDER BY sort_order;

-- Check that existing mantras have English translations
SELECT m.title, mt.text, l.name as language
FROM mantras m
JOIN mantra_translations mt ON m.id = mt.mantra_id
JOIN languages l ON mt.language_id = l.id
LIMIT 5;

-- Check the new view
SELECT * FROM mantras_with_translations LIMIT 1;
```

## Frontend Features

### Admin Panel Enhancements
1. **WYSIWYG Editor**: Rich text editing with ReactQuill
2. **Language Tabs**: Switch between languages when editing mantras
3. **Translation Management**: Add/edit translations for each language
4. **Benefits Management**: Dynamic list of benefits per language

### Frontend Display
1. **Language Switching**: Tabs to switch between available languages
2. **Rich Text Display**: Proper rendering of formatted content
3. **Copy/Share Functions**: Copy mantra text or transliteration
4. **Text-to-Speech**: Audio playback for different languages
5. **Responsive Design**: Mobile-friendly language switching

## Usage Instructions

### For Administrators

1. **Creating a New Mantra**:
   - Fill in basic information (title, deity, category, etc.)
   - Save the mantra first
   - Switch to "Language Translations" tab
   - Add content in different languages using WYSIWYG editor

2. **Adding Translations**:
   - Select language tab
   - Use WYSIWYG editor for rich text formatting
   - Add transliteration for non-Latin scripts
   - Include pronunciation guide
   - Add meaning and benefits
   - Save each language separately

3. **Managing Languages**:
   - Languages are pre-configured but can be modified in database
   - Add new languages by inserting into `languages` table
   - Set `sort_order` to control tab display order

### For Users

1. **Viewing Mantras**:
   - Language tabs appear at top of mantra display
   - Switch between available languages
   - Copy text or transliteration with one click
   - Use text-to-speech for pronunciation help

2. **Language Availability**:
   - Only languages with content are shown
   - Green checkmark indicates available translations
   - Fallback to original text if no translations exist

## Technical Details

### Database Schema
- `languages`: Master list of supported languages
- `mantra_translations`: Language-specific content for each mantra
- `mantras_with_translations`: View for easy querying with all translations

### API Endpoints
- `GET /api/languages`: List all active languages
- `GET /api/mantras/[id]/translations`: Get translations for a mantra
- `POST /api/mantras/[id]/translations`: Create new translation
- `PUT /api/mantras/[id]/translations`: Update existing translation
- `DELETE /api/mantras/[id]/translations`: Delete translation

### Components
- `WysiwygEditor`: Rich text editor component
- `LanguageManager`: Admin interface for managing translations
- `MantraDisplay`: Frontend component for displaying multi-language content

## Troubleshooting

### Common Issues

1. **Migration Fails**: 
   - Ensure you have admin privileges in Supabase
   - Check for existing constraint conflicts
   - Run migration in smaller chunks if needed

2. **WYSIWYG Editor Not Loading**:
   - Ensure ReactQuill is properly installed: `npm install react-quill quill`
   - Check for SSR issues (component uses dynamic import)

3. **Translations Not Showing**:
   - Verify RLS policies are correctly set
   - Check that languages are marked as `is_active = true`
   - Ensure translations have content in the `text` field

4. **Search Not Working**:
   - Search vector updates automatically via triggers
   - Manually refresh if needed: `UPDATE mantras SET search_vector = search_vector WHERE id = 'mantra_id';`

### Performance Considerations

1. **Large Content**: WYSIWYG content can be large; monitor database size
2. **Search Performance**: GIN indexes handle multi-language search efficiently
3. **Frontend Loading**: Language tabs load content on-demand

## Next Steps

1. **Content Migration**: Add translations for existing mantras
2. **Language Expansion**: Add more regional languages as needed
3. **Audio Support**: Integrate audio files for pronunciation
4. **Advanced Features**: Add language-specific formatting, RTL support, etc.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify database migration completed successfully
3. Test with a simple mantra first
4. Check browser console for JavaScript errors
