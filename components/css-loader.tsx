'use client'

import { useEffect, useState } from 'react'

export function CSSLoader({ children }: { children: React.ReactNode }) {
  const [cssLoaded, setCssLoaded] = useState(false)

  useEffect(() => {
    // Check if CSS is loaded by testing for a Tailwind class
    const testElement = document.createElement('div')
    testElement.className = 'hidden'
    document.body.appendChild(testElement)
    
    const styles = window.getComputedStyle(testElement)
    const isHidden = styles.display === 'none'
    
    document.body.removeChild(testElement)
    
    if (isHidden) {
      setCssLoaded(true)
    } else {
      // CSS not loaded, wait a bit and try again
      const timeout = setTimeout(() => {
        setCssLoaded(true) // Force show after timeout
      }, 1000)
      
      return () => clearTimeout(timeout)
    }
  }, [])

  // Show loading state if CSS is not loaded
  if (!cssLoaded) {
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
