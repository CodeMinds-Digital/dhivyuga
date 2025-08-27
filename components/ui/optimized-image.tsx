'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  title?: string
  priority?: boolean
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  title,
  priority = false 
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Handle image load error
  const handleError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false)
  }

  // Fallback for when image fails to load
  if (imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-orange-100 text-orange-600 rounded ${className}`}
        style={{ width, height }}
        title={title}
      >
        <span className="text-xs font-medium">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-orange-50 animate-pulse rounded ${className}`}
          style={{ width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        title={title}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        // Ensure images work in production
        unoptimized={process.env.NODE_ENV === 'production'}
      />
    </div>
  )
}
