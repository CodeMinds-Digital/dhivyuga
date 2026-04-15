import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = {
  title: 'திவ்யுகா (Dhivyuga) - Sacred Mantra Search Engine',
  description: 'Discover and explore sacred mantras for spiritual growth, prosperity, and well-being.',
  keywords: 'mantras, spiritual, meditation, hinduism, sanskrit, திவ்யுகா, दिव्युगा, dhivyuga',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
