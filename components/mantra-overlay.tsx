'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Volume2, Copy, Check, Share2, X } from 'lucide-react'
import { MantraContent } from '@/components/mantra-content'

interface MantraOverlayProps {
  mantra: any | null
  isOpen: boolean
  onClose: () => void
}

export function MantraOverlay({ mantra, isOpen, onClose }: MantraOverlayProps) {
  const t = useTranslations('mantra')
  const overlayRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)
  const previousIsOpen = useRef(false)
  const [copied, setCopied] = useState(false)

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  // Focus trap handler
  const handleFocusTrap = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !overlayRef.current) return

    const focusableElements = overlayRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }, [])

  // Save trigger element and restore focus on close
  useEffect(() => {
    if (isOpen && !previousIsOpen.current) {
      // Transitioning from closed to open — save trigger
      triggerRef.current = document.activeElement
    }
    if (!isOpen && previousIsOpen.current) {
      // Transitioning from open to closed — restore focus
      if (triggerRef.current && triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus()
      }
    }
    previousIsOpen.current = isOpen
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('keydown', handleFocusTrap)
      document.body.style.overflow = 'hidden'

      // Focus the first focusable element (back button) after animation starts
      requestAnimationFrame(() => {
        if (overlayRef.current) {
          const firstFocusable = overlayRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          firstFocusable?.focus()
        }
      })
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleFocusTrap)
      document.body.style.overflow = ''
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isOpen, handleEscape, handleFocusTrap])

  const handleSpeak = () => {
    if (!mantra?.text || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(mantra.text)
    window.speechSynthesis.speak(utterance)
  }

  const handleCopy = async () => {
    if (!mantra?.text) return
    try {
      await navigator.clipboard.writeText(mantra.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silent fail — clipboard may not be available
    }
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
          ref={overlayRef}
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
                {copied ? <Check className="w-[18px] h-[18px]" /> : <Copy className="w-[18px] h-[18px]" />}
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
