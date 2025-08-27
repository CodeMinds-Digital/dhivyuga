#!/bin/bash

# Deployment script for Netlify with dependency conflict resolution
echo "🚀 Starting Dhivyuga deployment..."

# Set Node.js version
echo "📦 Setting Node.js version to 18..."
export NODE_VERSION=18

# Clean any existing node_modules and lock files
echo "🧹 Cleaning existing dependencies..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# Install dependencies with legacy peer deps
echo "📥 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps --no-audit --no-fund

# Verify critical packages
echo "🔍 Verifying critical packages..."
npm list react react-dom react-quill --depth=0 || echo "⚠️ Some packages may have peer dependency warnings (this is expected)"

# Build the application
echo "🏗️ Building the application..."
npm run build

echo "✅ Deployment preparation complete!"
