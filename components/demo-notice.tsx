'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Database, ExternalLink } from 'lucide-react'

export function DemoNotice() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if Supabase is configured
    const checkSupabaseConfig = async () => {
      try {
        const response = await fetch('/api/deities')
        if (!response.ok) {
          setIsVisible(true)
        }
      } catch (error) {
        setIsVisible(true)
      }
    }

    // Check if user has dismissed the notice
    const dismissed = localStorage.getItem('dhivyuga-demo-notice-dismissed')
    if (!dismissed) {
      checkSupabaseConfig()
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
    localStorage.setItem('dhivyuga-demo-notice-dismissed', 'true')
  }

  if (!isVisible || isDismissed) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="bg-accent/10 border-accent/30 p-4">
        <div className="flex items-start gap-3">
          <Database className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Demo Mode</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Supabase is not configured. You're seeing demo data. 
              Follow the setup guide to connect your database.
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-7"
                onClick={() => window.open('/SETUP_GUIDE.md', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Setup Guide
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-xs h-7"
                onClick={handleDismiss}
              >
                <X className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
