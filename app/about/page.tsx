'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col surface">
      <Header />

      <main className="flex-1">
        {/* Modern Hero Section */}
        <section className="hero-section py-20 md:py-28 px-4 relative overflow-hidden">
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
                ease: [0.05, 0.7, 0.1, 1]
              }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-6"
                >
                  <span className="inline-block text-6xl mb-4">📖</span>
                </motion.div>

                <div className="space-y-4">
                  <h1 className="text-display bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent">
                    About Dhivyuga
                  </h1>
                  <p className="text-body-large text-zinc-600 max-w-2xl mx-auto">
                    Your gateway to sacred mantras and spiritual wisdom
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 px-4 section-bg">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.05, 0.7, 0.1, 1]
                }}
              >
                <h2 className="text-headline text-zinc-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-body text-zinc-700 leading-relaxed mb-6">
                  Dhivyuga is dedicated to preserving and sharing the ancient wisdom of sacred mantras.
                  We believe that these powerful spiritual tools should be accessible to everyone seeking
                  inner peace, prosperity, and divine connection.
                </p>
                <p className="text-body text-zinc-700 leading-relaxed">
                  Our platform combines traditional knowledge with modern technology to create a
                  comprehensive resource for mantra practice, complete with proper pronunciation guides,
                  spiritual significance, and traditional usage instructions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.05, 0.7, 0.1, 1]
                }}
              >
                <h2 className="text-headline text-zinc-900 mb-6">
                  Our Vision
                </h2>
                <p className="text-body text-zinc-700 leading-relaxed mb-6">
                  To become the world's most trusted and comprehensive platform for sacred mantra
                  practice, bridging ancient wisdom with contemporary spiritual seekers.
                </p>
                <p className="text-body text-zinc-700 leading-relaxed">
                  We envision a world where everyone has access to authentic spiritual practices
                  that can transform their lives and bring them closer to the divine.
                </p>
              </motion.div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass-effect rounded-2xl border-0 h-full">
                  <CardHeader>
                    <CardTitle className="text-gradient font-playfair">
                      Authentic Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">
                      All mantras are sourced from traditional scriptures and verified by
                      spiritual scholars to ensure authenticity and accuracy.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass-effect rounded-2xl border-0 h-full">
                  <CardHeader>
                    <CardTitle className="text-gradient font-playfair">
                      Proper Guidance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">
                      Each mantra comes with detailed pronunciation guides, spiritual significance,
                      and traditional usage instructions for proper practice.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass-effect rounded-2xl border-0 h-full">
                  <CardHeader>
                    <CardTitle className="text-gradient font-playfair">
                      Modern Accessibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">
                      Advanced search, filtering by deity and purpose, and mobile-friendly
                      design make ancient wisdom accessible to modern practitioners.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-3xl font-playfair font-bold text-gradient mb-8">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🕉️</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Authenticity</h3>
                  <p className="text-slate-600 text-sm">
                    Preserving the original essence and power of sacred mantras
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🙏</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Respect</h3>
                  <p className="text-slate-600 text-sm">
                    Honoring the sacred traditions and cultural heritage
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Accessibility</h3>
                  <p className="text-slate-600 text-sm">
                    Making spiritual wisdom available to all seekers
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💫</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Transformation</h3>
                  <p className="text-slate-600 text-sm">
                    Empowering personal and spiritual growth
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
