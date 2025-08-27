#!/usr/bin/env node

/**
 * Development server with CSS loading fixes
 * This script starts the Next.js dev server with optimizations for CSS loading
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting Dhivyuga development server with CSS fixes...')

// Clear Next.js cache before starting
const nextDir = path.join(process.cwd(), '.next')
if (fs.existsSync(nextDir)) {
  console.log('🧹 Clearing Next.js cache...')
  fs.rmSync(nextDir, { recursive: true, force: true })
}

// Clear node_modules cache
const nodeModulesCache = path.join(process.cwd(), 'node_modules', '.cache')
if (fs.existsSync(nodeModulesCache)) {
  console.log('🧹 Clearing node_modules cache...')
  fs.rmSync(nodeModulesCache, { recursive: true, force: true })
}

// Set environment variables for better CSS handling
process.env.NODE_ENV = 'development'
process.env.NEXT_TELEMETRY_DISABLED = '1'
process.env.FAST_REFRESH = 'true'

// Start the development server
const devServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    // Force CSS recompilation
    FORCE_COLOR: '1',
    // Disable CSS optimization in development
    NODE_OPTIONS: '--max-old-space-size=4096'
  }
})

devServer.on('close', (code) => {
  console.log(`\n👋 Development server stopped with code ${code}`)
  process.exit(code)
})

devServer.on('error', (error) => {
  console.error('❌ Error starting development server:', error)
  process.exit(1)
})

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development server...')
  devServer.kill('SIGINT')
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping development server...')
  devServer.kill('SIGTERM')
})
