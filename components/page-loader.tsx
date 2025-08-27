'use client'

import { useEffect, useState } from 'react'

interface PageLoaderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  timeout?: number
}

export function PageLoader({ children, fallback, timeout = 1000 }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Quick loading check
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, timeout)

    // Also check if document is ready
    if (document.readyState === 'complete') {
      setIsLoading(false)
      clearTimeout(timer)
    } else {
      const handleLoad = () => {
        setIsLoading(false)
        clearTimeout(timer)
      }
      
      window.addEventListener('load', handleLoad)
      
      return () => {
        window.removeEventListener('load', handleLoad)
        clearTimeout(timer)
      }
    }

    return () => clearTimeout(timer)
  }, [timeout])

  if (isLoading && fallback) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
