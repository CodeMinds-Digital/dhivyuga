'use client'

import { useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Volume2, Copy, Share2, X } from 'lucide-react'
import { MantraContent } from '@/components/mantra-content'

interface MantraOverlayProps {
  mantra: any | null
  isOpen: boolean
  onClose: () => void
}

export function MantraOverlay({ mantra, isOpen, onClose }: MantraOverlayProps) {
  const t = useTranslations('mantra')

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  const handleSpeak = () => {
    if (!mantra?.title) return
    const utterance = new SpeechSynthesisUtterance(mantra.title)
    speechSynthesis.speak(utterance)
  }

  const handleCopy = async () => {
    if (!mantra?.text) return
    await navigator.clipboard.writeText(mantra.text)
  }

  const handleShare = async () => {
    if (!navigator.share || !mantra) return
    try {
      await navigator.share({ title: mantra.title, text: mantra.text, url: window.location.href })
    } catch {}
  }

  return (
    <AnimatePresence>
      {isOpen && mantra && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-white overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={mantra.title}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 px-2 py-1 rounded-lg transition-all"
            >
              <ChevronLeft className="w-[18px] h-[18px]" />
              {t('backToResults')}
            </button>
            <div className="flex gap-1">
              <button onClick={handleSpeak} title={t('listen')} className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <Volume2 className="w-[18px] h-[18px]" />
              </button>
              <button onClick={handleCopy} title={t('copy')} className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <Copy className="w-[18px] h-[18px]" />
              </button>
              <button onClick={handleShare} title={t('share')} className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <Share2 className="w-[18px] h-[18px]" />
              </button>
              <button onClick={onClose} title={t('close')} className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <MantraContent mantra={mantra} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
