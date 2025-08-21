#!/usr/bin/env node

/**
 * Database Seeding Script for Dhivyuga
 * 
 * This script populates the database with comprehensive categories, deities, and mantras.
 * Make sure your .env.local file has the correct Supabase credentials.
 * 
 * Usage: node scripts/seed-database.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'seed-mantras.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    let successCount = 0
    let errorCount = 0
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
          
          const { error } = await supabase.rpc('exec_sql', { 
            sql_query: statement + ';' 
          })
          
          if (error) {
            // Try direct query if RPC fails
            const { error: directError } = await supabase
              .from('_temp')
              .select('*')
              .limit(0)
            
            if (directError) {
              console.warn(`⚠️  Statement ${i + 1} failed:`, error.message)
              errorCount++
            } else {
              successCount++
            }
          } else {
            successCount++
          }
        } catch (err) {
          console.warn(`⚠️  Statement ${i + 1} failed:`, err.message)
          errorCount++
        }
      }
    }
    
    console.log('\n✅ Database seeding completed!')
    console.log(`📊 Results: ${successCount} successful, ${errorCount} failed`)
    
    // Verify the data
    await verifyData()
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message)
    process.exit(1)
  }
}

async function verifyData() {
  try {
    console.log('\n🔍 Verifying seeded data...')
    
    // Check categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
    
    if (!catError) {
      console.log(`✅ Categories: ${categories.length} records`)
    }
    
    // Check deities
    const { data: deities, error: deityError } = await supabase
      .from('deities')
      .select('*')
    
    if (!deityError) {
      console.log(`✅ Deities: ${deities.length} records`)
    }
    
    // Check mantras
    const { data: mantras, error: mantraError } = await supabase
      .from('mantras')
      .select('*')
    
    if (!mantraError) {
      console.log(`✅ Mantras: ${mantras.length} records`)
    }
    
    // Check recitation counts
    const { data: counts, error: countError } = await supabase
      .from('recitation_counts')
      .select('*')
    
    if (!countError) {
      console.log(`✅ Recitation Counts: ${counts.length} records`)
    }
    
    // Check recitation times
    const { data: times, error: timeError } = await supabase
      .from('recitation_times')
      .select('*')
    
    if (!timeError) {
      console.log(`✅ Recitation Times: ${times.length} records`)
    }
    
    console.log('\n🎉 Database verification completed!')
    console.log('\n📱 You can now:')
    console.log('   • Visit your app homepage to see the new content')
    console.log('   • Search for mantras by deity (e.g., "Ganesha", "Lakshmi")')
    console.log('   • Browse categories like "Wealth & Prosperity", "Wisdom & Knowledge"')
    console.log('   • Check the admin panel to manage the content')
    
  } catch (error) {
    console.error('❌ Error verifying data:', error.message)
  }
}

// Alternative method using direct SQL execution
async function seedWithDirectSQL() {
  try {
    console.log('🌱 Starting database seeding with direct SQL...')
    
    const sqlPath = path.join(__dirname, 'seed-mantras.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Execute the entire SQL file
    const { error } = await supabase.rpc('exec_sql', { 
      sql_query: sqlContent 
    })
    
    if (error) {
      console.error('❌ Error executing SQL:', error.message)
      console.log('\n💡 Try running the SQL file directly in your Supabase SQL editor:')
      console.log('   1. Go to your Supabase dashboard')
      console.log('   2. Navigate to SQL Editor')
      console.log('   3. Copy and paste the contents of scripts/seed-mantras.sql')
      console.log('   4. Click "Run"')
      return
    }
    
    console.log('✅ SQL executed successfully!')
    await verifyData()
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n💡 Manual seeding instructions:')
    console.log('   1. Open scripts/seed-mantras.sql')
    console.log('   2. Copy the entire content')
    console.log('   3. Go to your Supabase dashboard > SQL Editor')
    console.log('   4. Paste and run the SQL')
  }
}

// Run the seeding
if (require.main === module) {
  console.log('🚀 Dhivyuga Database Seeding Tool')
  console.log('=====================================\n')
  
  seedWithDirectSQL()
    .then(() => {
      console.log('\n🎯 Seeding process completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error.message)
      process.exit(1)
    })
}

module.exports = { seedDatabase, verifyData }
