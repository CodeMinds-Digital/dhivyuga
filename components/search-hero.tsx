'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { SearchBar } from '@/components/search-bar'
import { LanguageSwitcher } from '@/components/language-switcher'

interface SearchHeroProps {
  categories?: { id: string; name: string }[]
  showChips?: boolean
}

export function SearchHero({ categories = [], showChips = true }: SearchHeroProps) {
  const t = useTranslations('home')
  const tCategories = useTranslations('categories')
  const locale = useLocale()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-gradient-to-b from-white to-brand-50">
      {/* Language switcher — top right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.04),transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl md:text-[49px] font-bold text-neutral-900 tracking-tight leading-none font-noto-devanagari">
          {t('logoTitle')}
        </h1>
        <p className="text-sm font-medium text-neutral-500 uppercase tracking-[0.15em] mt-2">
          {t('logoSubtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex justify-center"
      >
        <SearchBar />
      </motion.div>

      {showChips && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-2 mt-6 flex-wrap justify-center"
        >
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/${locale}/search?category=${cat.id}`}
              className="px-4 py-1 rounded-full text-sm font-medium border border-neutral-200 text-neutral-600 bg-white hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-all duration-150"
            >
              {(() => { try { return tCategories(cat.name) } catch { return cat.name } })()}
            </a>
          ))}
        </motion.div>
      )}
    </div>
  )
}
