#!/usr/bin/env node

/**
 * Script to prepare static assets for Netlify deployment
 * This ensures images are properly copied and accessible
 */

const fs = require('fs')
const path = require('path')

console.log('🖼️  Preparing static assets for deployment...')

// Ensure public directory exists
const publicDir = path.join(process.cwd(), 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
  console.log('✅ Created public directory')
}

// Ensure images directory exists
const imagesDir = path.join(publicDir, 'images')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
  console.log('✅ Created images directory')
}

// List of required images
const requiredImages = [
  'hinduism.png',
  'ganesha.png',
  'swastika.png'
]

// Check if all required images exist
let allImagesExist = true
for (const image of requiredImages) {
  const imagePath = path.join(imagesDir, image)
  if (fs.existsSync(imagePath)) {
    console.log(`✅ Found: ${image}`)
  } else {
    console.log(`❌ Missing: ${image}`)
    allImagesExist = false
  }
}

if (allImagesExist) {
  console.log('🎉 All required images are present!')
} else {
  console.log('⚠️  Some images are missing. Please ensure all PNG files are in public/images/')
}

// Create a manifest file for deployment verification
const manifest = {
  timestamp: new Date().toISOString(),
  images: requiredImages.map(image => ({
    name: image,
    path: `/images/${image}`,
    exists: fs.existsSync(path.join(imagesDir, image))
  }))
}

fs.writeFileSync(
  path.join(publicDir, 'asset-manifest.json'),
  JSON.stringify(manifest, null, 2)
)

console.log('📄 Created asset manifest')
console.log('🚀 Static assets preparation complete!')

// Exit with error code if images are missing
if (!allImagesExist) {
  process.exit(1)
}
