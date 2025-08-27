'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SacredSymbolsBar } from '@/components/sacred-symbols-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Heart } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex flex-col surface">
      <SacredSymbolsBar />
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
                  <span className="inline-block text-6xl mb-4">📞</span>
                </motion.div>

                <div className="space-y-4">
                  <h1 className="text-display bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent">
                    Contact Us
                  </h1>
                  <p className="text-body-large text-zinc-600 max-w-2xl mx-auto">
                    We're here to help you on your spiritual journey
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="glass-effect rounded-2xl border-0">
                  <CardHeader>
                    <CardTitle className="text-gradient font-playfair text-2xl">
                      Send us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Heart className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                          Thank You!
                        </h3>
                        <p className="text-slate-600">
                          Your message has been sent. We'll get back to you soon with spiritual guidance and support.
                        </p>
                        <Button
                          onClick={() => setSubmitted(false)}
                          className="mt-4"
                          variant="outline"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Name
                            </label>
                            <Input
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your name"
                              required
                              className="rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Email
                            </label>
                            <Input
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your@email.com"
                              required
                              className="rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Subject
                          </label>
                          <Input
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="How can we help you?"
                            required
                            className="rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Message
                          </label>
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Share your thoughts, questions, or spiritual experiences..."
                            rows={6}
                            required
                            className="rounded-xl"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full rounded-xl"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <Card className="glass-effect rounded-2xl border-0">
                  <CardHeader>
                    <CardTitle className="text-gradient font-playfair">
                      Get in Touch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-1">Email Us</h3>
                        <p className="text-slate-600">support@dhivyuga.com</p>
                        <p className="text-sm text-slate-500 mt-1">
                          We typically respond within 24 hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-1">Spiritual Guidance</h3>
                        <p className="text-slate-600">
                          Questions about mantras, pronunciation, or spiritual practice
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-1">Community Support</h3>
                        <p className="text-slate-600">
                          Share your experiences and connect with fellow practitioners
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect rounded-2xl border-0">
                  <CardHeader>
                    <CardTitle className="text-gradient font-playfair">
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        How do I pronounce mantras correctly?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Each mantra page includes detailed pronunciation guides. Start slowly and practice regularly.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        When is the best time to chant?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Early morning (Brahma Muhurta) is ideal, but any time with devotion works.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        Can I suggest new mantras?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Yes! Contact us with authentic mantras and their sources for review.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div >
  )
}
