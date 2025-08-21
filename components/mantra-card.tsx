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

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    if (navigator.share) {
      navigator.share({
        title: mantra.title,
        text: mantra.text,
        url: `${window.location.origin}/mantra/${mantra.id}`
      })
    }
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    // Future: Implement audio playback
    console.log('Play audio for:', mantra.title)
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
              <CardTitle className="text-xl font-playfair text-gradient line-clamp-2 leading-tight group-hover:text-purple-700 transition-colors">
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
            <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
              {mantra.text}
            </p>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-500 text-sm">
                <Eye className="h-4 w-4" />
                {mantra.view_count} views
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
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
