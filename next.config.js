/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === 'production', // Disable optimization for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // Static asset handling for Netlify
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  trailingSlash: true,

  // Fix CSS loading issues in development
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      optimizeCss: false, // Disable CSS optimization in dev
      forceSwcTransforms: true,
    },
  }),

  // Webpack configuration to fix CSS loading
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Fix CSS loading issues in development
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }

    return config
  },

  // Development server configuration
  devIndicators: {
    position: 'bottom-right',
  },

  // Fast refresh configuration
  reactStrictMode: true,
}

module.exports = nextConfig