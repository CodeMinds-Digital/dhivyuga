'use client'

import { useEffect, useState } from 'react'

export function CSSLoader({ children }: { children: React.ReactNode }) {
  const [cssLoaded, setCssLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Quick CSS check with fallback
    const checkCSS = () => {
      try {
        // Check if CSS is loaded by testing for a Tailwind class
        const testElement = document.createElement('div')
        testElement.className = 'hidden'
        testElement.style.position = 'absolute'
        testElement.style.top = '-9999px'
        document.body.appendChild(testElement)

        const styles = window.getComputedStyle(testElement)
        const isHidden = styles.display === 'none'

        document.body.removeChild(testElement)

        if (isHidden) {
          setCssLoaded(true)
        } else {
          // CSS not loaded, but don't wait too long
          setTimeout(() => {
            setCssLoaded(true) // Force show after short timeout
          }, 300)
        }
      } catch (error) {
        // If there's any error, just show the content
        setCssLoaded(true)
      }
    }

    // Check immediately and also after a short delay
    checkCSS()
    const timeout = setTimeout(() => {
      setCssLoaded(true) // Ensure content shows within 500ms
    }, 500)

    return () => clearTimeout(timeout)
  }, [])

  // Show loading state only if CSS is not loaded AND we're still mounting
  if (!mounted || !cssLoaded) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#fef7ed',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #fed7aa',
            borderTop: '4px solid #ea580c',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{
            color: '#9a3412',
            fontSize: '14px'
          }}>
            Loading திவ்யுகா...
          </p>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `
        }} />
      </div>
    )
  }

  return <>{children}</>
}
