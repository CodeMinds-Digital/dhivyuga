'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit, Trash2, Globe, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import WysiwygEditor from './wysiwyg-editor'
import { supabase } from '@/lib/supabase'

interface Language {
  id: string
  code: string
  name: string
  native_name: string
  direction: 'ltr' | 'rtl'
  is_active: boolean
  sort_order: number
}

interface Translation {
  id?: string
  language_id: string
  text: string
  transliteration: string
  pronunciation_guide: string
  meaning: string
  benefits: string[]
  usage_notes: string
}

interface LanguageManagerProps {
  mantraId: string
  onTranslationsChange?: (translations: Translation[]) => void
  initialTranslations?: Translation[]
}

export default function LanguageManager({
  mantraId,
  onTranslationsChange,
  initialTranslations = []
}: LanguageManagerProps) {
  const [languages, setLanguages] = useState<Language[]>([])
  const [translations, setTranslations] = useState<Translation[]>(initialTranslations)
  const [activeLanguage, setActiveLanguage] = useState<string>('')

  // Set active language when languages load
  useEffect(() => {
    if (languages.length > 0 && !activeLanguage) {
      // Default to Tamil if available, otherwise first language
      const defaultLang = languages.find(l => l.code === 'ta') || languages[0]
      setActiveLanguage(defaultLang?.id || '')
    }
  }, [languages, activeLanguage])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // supabase is already imported

  useEffect(() => {
    fetchLanguages()
  }, [])

  useEffect(() => {
    if (languages.length > 0 && !activeLanguage) {
      // Set first active language as default
      const firstActive = languages.find(l => l.is_active)
      if (firstActive) {
        setActiveLanguage(firstActive.id)
      }
    }
  }, [languages, activeLanguage])

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (error) {
        throw error
      }
      setLanguages(data || [])

      // Fetch existing translations for this mantra
      if (mantraId) {
        const { data: translationsData, error: translationsError } = await supabase
          .from('mantra_translations')
          .select('*')
          .eq('mantra_id', mantraId)

        if (translationsError) {
          throw translationsError
        }
        setTranslations(translationsData || [])
      }
    } catch (error) {
      console.error('Error fetching languages:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTranslationForLanguage = (languageId: string): Translation => {
    const existing = translations.find(t => t.language_id === languageId)
    return existing || {
      language_id: languageId,
      text: '',
      transliteration: '',
      pronunciation_guide: '',
      meaning: '',
      benefits: [],
      usage_notes: ''
    }
  }

  const updateTranslation = (languageId: string, field: keyof Translation, value: any) => {
    const updatedTranslations = translations.map(t =>
      t.language_id === languageId ? { ...t, [field]: value } : t
    )

    // If translation doesn't exist, create new one
    if (!translations.find(t => t.language_id === languageId)) {
      updatedTranslations.push({
        language_id: languageId,
        text: field === 'text' ? value : '',
        transliteration: field === 'transliteration' ? value : '',
        pronunciation_guide: field === 'pronunciation_guide' ? value : '',
        meaning: field === 'meaning' ? value : '',
        benefits: field === 'benefits' ? value : [],
        usage_notes: field === 'usage_notes' ? value : ''
      })
    }

    setTranslations(updatedTranslations)
    onTranslationsChange?.(updatedTranslations)
  }

  const saveTranslation = async (languageId: string) => {
    setSaving(true)
    try {
      const translation = getTranslationForLanguage(languageId)

      if (!translation.text.trim()) {
        // Delete translation if text is empty
        if (translation.id) {
          await supabase
            .from('mantra_translations')
            .delete()
            .eq('id', translation.id)
        }
        return
      }

      const translationData = {
        mantra_id: mantraId,
        language_id: languageId,
        text: translation.text,
        transliteration: translation.transliteration,
        pronunciation_guide: translation.pronunciation_guide,
        meaning: translation.meaning,
        benefits: translation.benefits,
        usage_notes: translation.usage_notes
      }

      if (translation.id) {
        // Update existing
        const { error } = await supabase
          .from('mantra_translations')
          .update(translationData)
          .eq('id', translation.id)

        if (error) {
          throw error
        }
      } else {
        // Create new
        const { data, error } = await supabase
          .from('mantra_translations')
          .insert(translationData)
          .select()
          .single()

        if (error) {
          throw error
        }

        // Update local state with new ID
        setTranslations(prev => prev.map(t =>
          t.language_id === languageId ? { ...t, id: data.id } : t
        ))
      }
    } catch (error) {
      console.error('Error saving translation:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert(`Error saving translation: ${errorMessage}. Please try again.`)
    } finally {
      setSaving(false)
    }
  }

  const addBenefit = (languageId: string) => {
    const translation = getTranslationForLanguage(languageId)
    const newBenefits = [...(translation.benefits || []), '']
    updateTranslation(languageId, 'benefits', newBenefits)
  }

  const updateBenefit = (languageId: string, index: number, value: string) => {
    const translation = getTranslationForLanguage(languageId)
    const newBenefits = [...(translation.benefits || [])]
    newBenefits[index] = value
    updateTranslation(languageId, 'benefits', newBenefits)
  }

  const removeBenefit = (languageId: string, index: number) => {
    const translation = getTranslationForLanguage(languageId)
    const newBenefits = translation.benefits?.filter((_, i) => i !== index) || []
    updateTranslation(languageId, 'benefits', newBenefits)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="ml-4">Loading languages...</p>
      </div>
    )
  }

  if (languages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Globe className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold mb-2">No Languages Found</h3>
          <p className="text-slate-500">Please run the database migration script first.</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-purple-600" />
          Language Translations
        </CardTitle>
      </CardHeader>
      <CardContent>

        <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 gap-1 bg-gray-100 p-1 rounded-lg">
            {languages.slice(0, 6).map((language) => {
              const hasTranslation = translations.some(t =>
                t.language_id === language.id && t.text && t.text.trim()
              )

              return (
                <TabsTrigger
                  key={language.id}
                  value={language.id}
                  className="relative text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700"
                >
                  <span className="flex items-center gap-1">
                    {language.native_name || language.name}
                    {hasTranslation && (
                      <Check className="h-3 w-3 text-green-600" />
                    )}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <AnimatePresence mode="wait">
            {languages.map((language) => (
              <TabsContent key={language.id} value={language.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 mt-6"
                >
                  <TranslationForm
                    language={language}
                    translation={getTranslationForLanguage(language.id)}
                    onUpdate={(field, value) => updateTranslation(language.id, field, value)}
                    onSave={() => saveTranslation(language.id)}
                    onAddBenefit={() => addBenefit(language.id)}
                    onUpdateBenefit={(index, value) => updateBenefit(language.id, index, value)}
                    onRemoveBenefit={(index) => removeBenefit(language.id, index)}
                    saving={saving}
                  />
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface TranslationFormProps {
  language: Language
  translation: Translation
  onUpdate: (field: keyof Translation, value: any) => void
  onSave: () => void
  onAddBenefit: () => void
  onUpdateBenefit: (index: number, value: string) => void
  onRemoveBenefit: (index: number) => void
  saving: boolean
}

function TranslationForm({
  language,
  translation,
  onUpdate,
  onSave,
  onAddBenefit,
  onUpdateBenefit,
  onRemoveBenefit,
  saving
}: TranslationFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {language.name} ({language.native_name})
        </h3>
        <Button
          onClick={onSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {saving ? 'Saving...' : 'Save Translation'}
        </Button>
      </div>

      <WysiwygEditor
        label="Mantra Text"
        value={translation.text}
        onChange={(value) => onUpdate('text', value)}
        placeholder={`Enter the mantra in ${language.name}...`}
        height="150px"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Transliteration
          </label>
          <textarea
            value={translation.transliteration}
            onChange={(e) => onUpdate('transliteration', e.target.value)}
            placeholder="Romanized version..."
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pronunciation Guide
          </label>
          <textarea
            value={translation.pronunciation_guide}
            onChange={(e) => onUpdate('pronunciation_guide', e.target.value)}
            placeholder="How to pronounce..."
            className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
          />
        </div>
      </div>

      <WysiwygEditor
        label="Meaning & Significance"
        value={translation.meaning}
        onChange={(value) => onUpdate('meaning', value)}
        placeholder={`Explain the meaning in ${language.name}...`}
        height="120px"
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            Benefits
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddBenefit}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Benefit
          </Button>
        </div>
        <div className="space-y-2">
          {(translation.benefits || []).map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => onUpdateBenefit(index, e.target.value)}
                placeholder={`Benefit ${index + 1}...`}
                className="flex-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemoveBenefit(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <WysiwygEditor
        label="Usage Notes"
        value={translation.usage_notes}
        onChange={(value) => onUpdate('usage_notes', value)}
        placeholder={`Special instructions in ${language.name}...`}
        height="100px"
      />
    </div>
  )
}
