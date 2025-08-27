'use client'

import { useEffect } from 'react'

export function CSSPreloader() {
  useEffect(() => {
    // Preload critical CSS classes to ensure they're available
    const criticalClasses = [
      'bg-background',
      'text-foreground',
      'min-h-screen',
      'flex',
      'items-center',
      'justify-center',
      'p-4',
      'space-y-4',
      'rounded-lg',
      'border',
      'shadow-sm',
      'bg-gradient-to-r',
      'from-orange-50',
      'via-yellow-50',
      'to-orange-50',
      'text-orange-600',
      'hover:scale-110',
      'transition-all',
      'duration-200'
    ]

    // Create a hidden element with all critical classes to force CSS loading
    const preloadElement = document.createElement('div')
    preloadElement.className = criticalClasses.join(' ')
    preloadElement.style.position = 'absolute'
    preloadElement.style.top = '-9999px'
    preloadElement.style.left = '-9999px'
    preloadElement.style.visibility = 'hidden'
    preloadElement.style.pointerEvents = 'none'
    
    document.body.appendChild(preloadElement)

    // Force a reflow to ensure CSS is applied
    preloadElement.offsetHeight

    // Clean up after a short delay
    const cleanup = setTimeout(() => {
      if (document.body.contains(preloadElement)) {
        document.body.removeChild(preloadElement)
      }
    }, 100)

    return () => {
      clearTimeout(cleanup)
      if (document.body.contains(preloadElement)) {
        document.body.removeChild(preloadElement)
      }
    }
  }, [])

  return null
}
