'use client'
import { SearchBar } from '@/components/search-bar'
import { QuickFilters } from '@/components/quick-filters'
import { TrendingMantras } from '@/components/trending-mantras'
import { DeityGrid } from '@/components/deity-grid'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Gradient Background */}
        <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 py-32 px-4 relative overflow-hidden">
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-7xl md:text-9xl font-playfair font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent mb-6 tracking-tight">
                Dhivyuga
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Discover sacred mantras and planetary wisdom for spiritual growth, prosperity, and divine connection
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <SearchBar />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-16"
            >
              <QuickFilters />
            </motion.div>


          </div>
        </section>

        {/* Trending Mantras Section */}
        <section className="py-24 px-4 content-bg">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-playfair font-semibold text-center mb-16 text-gradient"
              >
                Trending Mantras
              </motion.h2>
              <TrendingMantras />
            </div>
          </div>
        </section>

        {/* Browse by Deity Section */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-playfair font-semibold text-center mb-16 text-gradient"
              >
                Browse by Deity
              </motion.h2>
              <DeityGrid />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
