'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Play, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Mantra {
  id: string
  title: string
  text: string
  view_count: number
  deities?: { name: string }
  categories?: { name: string }
}

interface MantraCardProps {
  mantra: Mantra
}

export function MantraCard({ mantra }: MantraCardProps) {

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (navigator.share) {
      try {
        await navigator.share({
          title: mantra.title,
          text: mantra.text,
          url: `${window.location.origin}/mantra/${mantra.id}`
        })
      } catch (error) {
        // Handle cancellation gracefully - don't show error for user cancellation
        if (error instanceof Error && error.name === 'AbortError') {
          // User cancelled the share - this is normal behavior, do nothing
          return
        }
        // Only log other types of errors
        console.error('Error sharing:', error)
      }
    }
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()

    if ('speechSynthesis' in window) {
      // Use the basic mantra text from the card
      const utterance = new SpeechSynthesisUtterance(mantra.text)
      utterance.lang = 'sa' // Default to Sanskrit
      utterance.rate = 0.8 // Slightly slower for better pronunciation
      speechSynthesis.speak(utterance)
    } else {
      alert('Text-to-speech is not supported in your browser')
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/mantra/${mantra.id}`}>
        <Card className="h-full card-hover glass-effect rounded-2xl overflow-hidden group">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-xl font-playfair text-gray-900 line-clamp-2 leading-tight group-hover:text-purple-700 transition-colors font-semibold">
                {mantra.title}
              </CardTitle>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePlay}
                  className="h-8 w-8 p-0 hover:bg-purple-100"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleShare}
                  className="h-8 w-8 p-0 hover:bg-purple-100"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {mantra.deities && (
                <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                  {mantra.deities.name}
                </span>
              )}
              {mantra.categories && (
                <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {mantra.categories.name}
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-zinc-700 mb-6 line-clamp-3 leading-relaxed font-medium">
              {mantra.text}
            </p>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-zinc-600 text-sm font-medium">
                <Eye className="h-4 w-4" />
                {mantra.view_count} views
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600 font-medium">
                  Play Audio
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
