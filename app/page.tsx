'use client'
import { SearchBar } from '@/components/search-bar'
import { QuickFilters } from '@/components/quick-filters'
import { TrendingMantras } from '@/components/trending-mantras'
import { DeityGrid } from '@/components/deity-grid'
import { CategoryGrid } from '@/components/category-grid'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Modern Hero Section - 2024 Standards */}
        <section className="relative py-20 md:py-28 lg:py-32 px-4 overflow-hidden hero-section">
          {/* Subtle geometric pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, hsl(var(--accent)) 1px, transparent 1px)`,
              backgroundSize: '60px 60px, 40px 40px'
            }}></div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.05, 0.7, 0.1, 1] // Material emphasized easing
              }}
              className="space-y-10"
            >
              {/* Hero Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-display-large bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent">
                    Dhivyuga
                  </h1>
                  <p className="text-body-large text-zinc-600 max-w-2xl mx-auto">
                    Discover sacred mantras and planetary wisdom for spiritual growth, prosperity, and divine connection
                  </p>
                </div>

                {/* Modern CTA Section */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                  <Button
                    size="lg"
                    className="px-8 py-3 text-label-large font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Explore Mantras
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 text-label-large font-medium rounded-full border-2 hover:bg-zinc-50 transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </motion.div>


            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.05, 0.7, 0.1, 1]
              }}
              className="mt-12"
            >
              <SearchBar />
            </motion.div>
          </div>
        </section>

        {/* Quick Filters Section */}
        <section className="py-20 px-4 section-bg border-b border-zinc-100">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                ease: [0.05, 0.7, 0.1, 1]
              }}
              className="text-center space-y-8"
            >
              <div className="space-y-3">
                <h2 className="text-headline text-zinc-900">
                  Popular Categories
                </h2>
                <p className="text-body text-zinc-600 max-w-xl mx-auto">
                  Quick access to the most sought-after spiritual practices
                </p>
              </div>
              <QuickFilters />
            </motion.div>
          </div>
        </section>

        {/* Trending Mantras Section */}
        <section className="py-24 px-4 surface">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                ease: [0.05, 0.7, 0.1, 1]
              }}
              className="text-center mb-16 space-y-4"
            >
              <h2 className="text-headline text-zinc-900">
                Trending Mantras
              </h2>
              <p className="text-body text-zinc-600 max-w-2xl mx-auto">
                Discover the most popular sacred chants and mantras being practiced by our community
              </p>
            </motion.div>
            <TrendingMantras />
          </div>
        </section>

        {/* Browse by Category Section */}
        <section className="py-24 px-4 section-bg">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                ease: [0.05, 0.7, 0.1, 1]
              }}
              className="text-center mb-16 space-y-4"
            >
              <h2 className="text-headline text-zinc-900">
                Browse by Category
              </h2>
              <p className="text-body text-zinc-600 max-w-2xl mx-auto">
                Discover mantras organized by purpose and intention
              </p>
            </motion.div>
            <CategoryGrid />
          </div>
        </section>

        {/* Browse by Deity Section */}
        <section className="py-24 px-4 surface">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                ease: [0.05, 0.7, 0.1, 1]
              }}
              className="text-center mb-16 space-y-4"
            >
              <h2 className="text-headline text-zinc-900">
                Browse by Deity
              </h2>
              <p className="text-body text-zinc-600 max-w-2xl mx-auto">
                Connect with divine energies through sacred mantras
              </p>
            </motion.div>
            <DeityGrid />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
