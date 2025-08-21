'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col content-bg">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 py-24 px-4 relative overflow-hidden">
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-block text-6xl mb-4">📖</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-playfair font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent mb-6 tracking-tight"
            >
              About Dhivyuga
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Your gateway to sacred mantras and spiritual wisdom
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-playfair font-bold text-gradient mb-6">
                  Our Mission
                </h2>
                <p className="text-slate-700 leading-relaxed mb-6">
                  Dhivyuga is dedicated to preserving and sharing the ancient wisdom of sacred mantras.
                  We believe that these powerful spiritual tools should be accessible to everyone seeking
                  inner peace, prosperity, and divine connection.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Our platform combines traditional knowledge with modern technology to create a
                  comprehensive resource for mantra practice, complete with proper pronunciation guides,
                  spiritual significance, and traditional usage instructions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-playfair font-bold text-gradient mb-6">
                  Our Vision
                </h2>
                <p className="text-slate-700 leading-relaxed mb-6">
                  To become the world's most trusted and comprehensive platform for sacred mantra
                  practice, bridging ancient wisdom with contemporary spiritual seekers.
                </p>
                <p className="text-slate-700 leading-relaxed">
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
