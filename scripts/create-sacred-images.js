#!/usr/bin/env node

/**
 * Script to create sacred symbol images for Dhivyuga
 * This creates simple SVG-based PNG images for the sacred symbols
 */

const fs = require('fs')
const path = require('path')

console.log('🕉️  Creating sacred symbol images...')

// Ensure public/images directory exists
const imagesDir = path.join(process.cwd(), 'public', 'images')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
  console.log('✅ Created images directory')
}

// SVG content for each sacred symbol
const symbols = {
  'hinduism.png': {
    name: 'OM Symbol',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#f97316" stroke="#ea580c" stroke-width="1"/>
      <text x="12" y="16" text-anchor="middle" fill="white" font-family="serif" font-size="14" font-weight="bold">ॐ</text>
    </svg>`
  },
  'ganesha.png': {
    name: 'Ganesha Symbol',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#f97316" stroke="#ea580c" stroke-width="1"/>
      <text x="12" y="16" text-anchor="middle" fill="white" font-family="serif" font-size="12" font-weight="bold">🐘</text>
    </svg>`
  },
  'swastika.png': {
    name: 'Swastika Symbol',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#f97316" stroke="#ea580c" stroke-width="1"/>
      <g transform="translate(12,12)">
        <path d="M-6,-2 L-2,-2 L-2,-6 L2,-6 L2,-2 L6,-2 L6,2 L2,2 L2,6 L-2,6 L-2,2 L-6,2 Z" 
              fill="white" stroke="none"/>
      </g>
    </svg>`
  }
}

// Create a simple SVG to PNG conversion using data URLs
function createImageFile(filename, svgContent, symbolName) {
  const imagePath = path.join(imagesDir, filename)
  
  // Create a simple HTML file that can be used to generate the image
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${symbolName}</title>
</head>
<body style="margin:0;padding:20px;background:#fef7ed;">
  <div style="display:inline-block;background:white;padding:4px;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
    ${svgContent}
  </div>
  <p style="font-family:Arial,sans-serif;font-size:12px;color:#9a3412;margin-top:10px;">
    ${symbolName} for Dhivyuga
  </p>
</body>
</html>`

  // For now, create a simple text-based placeholder
  const placeholderContent = `# ${symbolName}
This is a placeholder for ${filename}
Sacred symbol for the Dhivyuga application
Size: 24x24 pixels
Color: Orange theme (#f97316)
`

  // Write a simple text file as placeholder (will be replaced with actual images)
  fs.writeFileSync(imagePath.replace('.png', '.txt'), placeholderContent)
  
  console.log(`✅ Created placeholder for ${filename}`)
  return htmlContent
}

// Generate all symbol files
Object.entries(symbols).forEach(([filename, { name, svg }]) => {
  createImageFile(filename, svg, name)
})

console.log('\n📝 Sacred symbol placeholders created!')
console.log('\n🎨 To complete the setup:')
console.log('   1. Replace the .txt files with actual .png images')
console.log('   2. Use the SVG content provided to create 24x24 PNG images')
console.log('   3. Ensure images use orange theme colors (#f97316)')
console.log('   4. Commit the PNG files to your repository')

// Create a README for the images
const readmeContent = `# Sacred Symbol Images

This directory contains the sacred symbol images used in the Dhivyuga application header.

## Required Images:

### hinduism.png (OM Symbol)
- **Size**: 24x24 pixels
- **Content**: OM symbol (ॐ)
- **Colors**: Orange background (#f97316), white symbol
- **Usage**: Universal sound symbol

### ganesha.png (Ganesha Symbol)  
- **Size**: 24x24 pixels
- **Content**: Ganesha representation
- **Colors**: Orange background (#f97316), white symbol
- **Usage**: Remover of obstacles

### swastika.png (Swastika Symbol)
- **Size**: 24x24 pixels
- **Content**: Traditional swastika (auspicious symbol)
- **Colors**: Orange background (#f97316), white symbol
- **Usage**: Symbol of auspiciousness

## Design Guidelines:
- Use circular background with orange color (#f97316)
- White symbols on orange background
- 24x24 pixel size for optimal display
- Clean, simple design for web display
- Maintain spiritual and respectful representation

## Creating the Images:
1. Use the SVG templates provided in create-sacred-images.js
2. Convert to PNG format at 24x24 pixels
3. Ensure proper colors and clarity
4. Test in browser before deployment
`

fs.writeFileSync(path.join(imagesDir, 'README.md'), readmeContent)
console.log('✅ Created images README.md')

console.log('\n🚀 Next steps:')
console.log('   • Create actual PNG images using the SVG templates')
console.log('   • Add them to public/images/ directory')
console.log('   • Commit to Git repository')
console.log('   • Deploy to Netlify')
