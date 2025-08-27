'use client'

import { motion } from 'framer-motion'
import { OptimizedImage } from '@/components/ui/optimized-image'

export function SacredSymbolsBar() {
  return (
    <div className="bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 border-b border-orange-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-3">
          <motion.div
            className="flex items-center gap-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* OM Symbol */}
            <motion.div
              className="flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              title="OM - The Universal Sound"
            >
              <OptimizedImage
                src="/images/hinduism.png"
                alt="OM Symbol"
                width={24}
                height={24}
                className="cursor-default"
                title="OM - The Universal Sound"
              />
            </motion.div>

            {/* Decorative Dot */}
            <div className="w-1 h-1 bg-orange-300 rounded-full"></div>

            {/* Ganesha Symbol */}
            <motion.div
              className="flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              title="Ganesha - Remover of Obstacles"
            >
              <OptimizedImage
                src="/images/ganesha.png"
                alt="Ganesha Symbol"
                width={24}
                height={24}
                className="cursor-default"
                title="Ganesha - Remover of Obstacles"
              />
            </motion.div>

            {/* Decorative Dot */}
            <div className="w-1 h-1 bg-orange-300 rounded-full"></div>

            {/* Swastika Symbol */}
            <motion.div
              className="flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              title="Swastika - Symbol of Auspiciousness"
            >
              <OptimizedImage
                src="/images/swastika.png"
                alt="Swastika Symbol"
                width={24}
                height={24}
                className="cursor-default"
                title="Swastika - Symbol of Auspiciousness"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
