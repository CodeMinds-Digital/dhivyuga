'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe, Volume2, Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Language {
  id: string
  code: string
  name: string
  native_name: string
  direction: 'ltr' | 'rtl'
}

interface Translation {
  id: string
  language_id: string
  text: string
  transliteration: string
  pronunciation_guide: string
  meaning: string
  benefits: string[]
  usage_notes: string
  languages: Language
}

interface MantraDisplayProps {
  title: string
  translations: Translation[]
  defaultLanguage?: string
  showMeaning?: boolean
  showBenefits?: boolean
  className?: string
}

export default function MantraDisplay({
  title,
  translations,
  defaultLanguage = 'ta',
  showMeaning = true,
  showBenefits = true,
  className = ''
}: MantraDisplayProps) {
  const [activeLanguage, setActiveLanguage] = useState('')

  // Set active language when translations load
  useEffect(() => {
    if (translations.length > 0 && !activeLanguage) {
      const defaultLang = translations.find(t => t.languages.code === defaultLanguage)
      const initialLanguage = defaultLang?.language_id || translations[0]?.language_id || ''
      setActiveLanguage(initialLanguage)
    }
  }, [translations, defaultLanguage, activeLanguage])
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const activeTranslation = translations.find(t => t.language_id === activeLanguage)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(type)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const extractMantraText = (htmlText: string) => {
    // Remove HTML tags
    const withoutHtml = htmlText.replace(/<[^>]*>/g, ' ')

    // Split by common separators and take the first line (usually the mantra)
    const lines = withoutHtml.split(/[\n\r]+/).map(line => line.trim()).filter(line => line.length > 0)

    // Look for the actual mantra text (usually the first substantial line)
    // Skip very short lines that might be formatting
    const mantraLine = lines.find(line => line.length > 10) || lines[0] || withoutHtml

    // Clean up extra whitespace
    return mantraLine.replace(/\s+/g, ' ').trim()
  }

  const speakText = (text: string, languageCode: string) => {
    if ('speechSynthesis' in window) {
      // Extract only the mantra text, not instructions
      const mantraOnly = extractMantraText(text)
      const utterance = new SpeechSynthesisUtterance(mantraOnly)
      utterance.lang = languageCode
      utterance.rate = 0.8 // Slightly slower for better pronunciation
      speechSynthesis.speak(utterance)
    }
  }

  if (!translations.length) {
    return (
      <Card className={`border-0 shadow-sm ${className}`}>
        <CardContent className="p-6">
          <p className="text-slate-500 text-center">No translations available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-0 shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-purple-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {translations.slice(0, 5).map((translation) => (
              <TabsTrigger
                key={translation.language_id}
                value={translation.language_id}
                className="text-xs font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700"
              >
                {translation.languages.native_name || translation.languages.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            {translations.map((translation) => (
              <TabsContent key={translation.language_id} value={translation.language_id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Main Mantra Text */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {translation.languages.name}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakText(translation.text, translation.languages.code)}
                          className="h-8 w-8 p-0"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(translation.text, 'text')}
                          className="h-8 w-8 p-0"
                        >
                          {copiedText === 'text' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div
                      className={`text-2xl font-semibold leading-relaxed p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg ${translation.languages.direction === 'rtl' ? 'text-right' : 'text-left'
                        }`}
                      dir={translation.languages.direction}
                      dangerouslySetInnerHTML={{ __html: translation.text }}
                    />

                    {/* Transliteration */}
                    {translation.transliteration && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-slate-700">Transliteration</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(translation.transliteration, 'transliteration')}
                            className="h-6 w-6 p-0"
                          >
                            {copiedText === 'transliteration' ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <p className="text-lg text-slate-600 italic bg-slate-50 p-3 rounded">
                          {translation.transliteration}
                        </p>
                      </div>
                    )}

                    {/* Pronunciation Guide */}
                    {translation.pronunciation_guide && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-700">Pronunciation Guide</h4>
                        <p className="text-sm text-slate-600 bg-amber-50 p-3 rounded border-l-4 border-amber-200">
                          {translation.pronunciation_guide}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Meaning */}
                  {showMeaning && translation.meaning && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-slate-800">Meaning & Significance</h4>
                      <div
                        className="text-slate-700 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: translation.meaning }}
                      />
                    </div>
                  )}

                  {/* Benefits */}
                  {showBenefits && translation.benefits && translation.benefits.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-slate-800">Benefits</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {translation.benefits.map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border-l-4 border-green-200"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-green-800">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Usage Notes */}
                  {translation.usage_notes && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-slate-800">Usage Instructions</h4>
                      <div
                        className="text-slate-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: translation.usage_notes }}
                      />
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  )
}
