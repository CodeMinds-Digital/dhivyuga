'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function TermsPage() {
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
              <span className="inline-block text-6xl mb-4">📋</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-playfair font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent mb-6 tracking-tight"
            >
              Terms of Service
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Guidelines for using Dhivyuga platform
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-lg max-w-none"
            >
              <Card className="glass-effect rounded-2xl border-0 mb-8">
                <CardHeader>
                  <CardTitle className="text-gradient font-playfair">
                    1. Acceptance of Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    By accessing and using Dhivyuga, you accept and agree to be bound by the terms
                    and provision of this agreement. If you do not agree to abide by the above,
                    please do not use this service.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-effect rounded-2xl border-0 mb-8">
                <CardHeader>
                  <CardTitle className="text-gradient font-playfair">
                    2. Spiritual Content Usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    The mantras and spiritual content provided on Dhivyuga are for educational and
                    spiritual practice purposes. Users are encouraged to:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 space-y-2">
                    <li>Practice with respect and devotion</li>
                    <li>Follow traditional guidelines and precautions</li>
                    <li>Seek guidance from qualified spiritual teachers when needed</li>
                    <li>Use the content for personal spiritual growth</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-effect rounded-2xl border-0 mb-8">
                <CardHeader>
                  <CardTitle className="text-gradient font-playfair">
                    3. Intellectual Property
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    The mantras themselves are ancient spiritual heritage belonging to humanity.
                    However, the compilation, presentation, translations, and additional content
                    created by Dhivyuga are protected by copyright.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Users may share individual mantras for spiritual purposes but may not
                    reproduce the entire database or use it for commercial purposes without permission.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-effect rounded-2xl border-0 mb-8">
                <CardHeader>
                  <CardTitle className="text-gradient font-playfair">
                    4. User Conduct
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    Users agree to use Dhivyuga in a manner consistent with spiritual values:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 space-y-2">
                    <li>Respect the sacred nature of the content</li>
                    <li>Do not misuse or misrepresent spiritual teachings</li>
                    <li>Maintain the dignity and sanctity of spiritual practices</li>
                    <li>Report any inappropriate content or behavior</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-effect rounded-2xl border-0 mb-8">
                <CardHeader>
                  <CardTitle className="text-gradient font-playfair">
                    5. Disclaimer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    Dhivyuga provides spiritual content for educational purposes. While we strive
                    for accuracy, users should:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 space-y-2">
                    <li>Verify information with traditional sources</li>
                    <li>Consult qualified spiritual teachers for guidance</li>
                    <li>Practice at their own discretion and responsibility</li>
                    <li>Understand that spiritual results may vary</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-effect rounded-2xl border-0 mb-8">
                <CardHeader>
                  <CardTitle className="text-gradient font-playfair">
                    6. Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    We respect your privacy and are committed to protecting your personal information.
                    We collect minimal data necessary for providing our services and do not share
                    personal information with third parties without consent.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-effect rounded-2xl border-0 mb-8">
                <CardHeader>
                  <CardTitle className="text-gradient font-playfair">
                    7. Modifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    Dhivyuga reserves the right to modify these terms at any time. Users will be
                    notified of significant changes, and continued use of the platform constitutes
                    acceptance of the modified terms.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-effect rounded-2xl border-0 mb-8">
                <CardHeader>
                  <CardTitle className="text-gradient font-playfair">
                    8. Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    For questions about these terms or our services, please contact us at:
                  </p>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                    <p className="text-slate-700">
                      <strong>Email:</strong> support@dhivyuga.com<br />
                      <strong>Website:</strong> www.dhivyuga.com
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-slate-500 text-sm mt-12">
                <p>Last updated: August 20, 2025</p>
                <p className="mt-2">
                  These terms are governed by principles of dharma and spiritual ethics.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
