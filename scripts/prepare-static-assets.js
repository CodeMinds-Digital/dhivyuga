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
const missingImages = []

for (const image of requiredImages) {
  const imagePath = path.join(imagesDir, image)
  if (fs.existsSync(imagePath)) {
    console.log(`✅ Found: ${image}`)
  } else {
    console.log(`❌ Missing: ${image}`)
    allImagesExist = false
    missingImages.push(image)
  }
}

if (allImagesExist) {
  console.log('🎉 All required images are present!')
} else {
  console.log('⚠️  Some images are missing. Please ensure all PNG files are in public/images/')
  console.log('📝 Missing images:', missingImages.join(', '))
  console.log('💡 Tip: Make sure the public directory is committed to your Git repository')
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

// Create simple placeholder images if missing (for deployment)
if (!allImagesExist) {
  console.log('🔧 Creating placeholder images for missing files...')

  for (const image of missingImages) {
    const imagePath = path.join(imagesDir, image)

    // Create a simple SVG placeholder
    const svgContent = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#f97316" stroke="#ea580c" stroke-width="1"/>
      <text x="12" y="16" text-anchor="middle" fill="white" font-family="serif" font-size="10" font-weight="bold">${image.charAt(0).toUpperCase()}</text>
    </svg>`

    // For deployment, create a simple text file that can be converted
    const placeholderContent = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`

    // Write placeholder info
    fs.writeFileSync(imagePath.replace('.png', '.placeholder'), placeholderContent)
    console.log(`🔧 Created placeholder for ${image}`)
  }

  console.log('⚠️  Warning: Using placeholder images. Please add actual PNG files and commit them to Git.')
  console.log('🚀 Build will continue with placeholders to prevent deployment failure.')
}
