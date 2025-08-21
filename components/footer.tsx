'use client'

import Link from 'next/link'

export function Footer() {

  return (
    <footer className="glass-effect border-t border-slate-200/20 mt-20 relative overflow-hidden">
      {/* Subtle mandala background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-purple-300 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-blue-300 rounded-full"></div>
        <div className="absolute top-20 right-20 w-16 h-16 border border-purple-200 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-playfair font-bold text-gradient mb-4">Dhivyuga</h3>
            <p className="text-slate-600 leading-relaxed">
              Discover sacred mantras for spiritual growth, prosperity, and divine connection.
            </p>
          </div>

          {/* Links */}
          <div className="text-center">
            <h4 className="font-semibold text-slate-700 mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-slate-600 hover:text-purple-700 transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-slate-600 hover:text-purple-700 transition-colors">
                Contact
              </Link>
              <Link href="/terms" className="block text-slate-600 hover:text-purple-700 transition-colors">
                Terms
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-slate-700 mb-4">Contact</h4>
            <p className="text-slate-600">
              Connect with us for spiritual guidance
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 text-center">
          <p className="text-slate-600">
            &copy; 2025 Dhivyuga. All rights reserved. Made with devotion for spiritual seekers.
          </p>
        </div>
      </div>
    </footer>
  )
}