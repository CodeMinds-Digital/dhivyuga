// Script to check if database setup is complete
// Run this with: node scripts/check-setup.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read environment variables from .env.local
let supabaseUrl, supabaseAnonKey

try {
  const envPath = path.join(__dirname, '..', '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  const envLines = envContent.split('\n')
  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1]
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1]
    }
  }
} catch (error) {
  console.error('Error reading .env.local file:', error.message)
  process.exit(1)
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSetup() {
  console.log('🔍 Checking database setup...\n')
  
  const tables = [
    'profiles',
    'categories', 
    'deities',
    'mantras',
    'mantra_descriptions',
    'recitation_counts',
    'recitation_times',
    'kalams',
    'time_ranges'
  ]
  
  let allTablesExist = true
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ Table '${table}' - Error: ${error.message}`)
        allTablesExist = false
      } else {
        console.log(`✅ Table '${table}' - OK`)
      }
    } catch (err) {
      console.log(`❌ Table '${table}' - Error: ${err.message}`)
      allTablesExist = false
    }
  }
  
  console.log('\n🔍 Checking admin user...')
  
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@dhivyuga.com')
      .single()
    
    if (profile && profile.role === 'admin') {
      console.log('✅ Admin user exists with proper role')
    } else if (profile) {
      console.log('⚠️  Admin user exists but role is not admin')
    } else {
      console.log('❌ Admin user not found')
    }
  } catch (error) {
    console.log('❌ Error checking admin user:', error.message)
  }
  
  console.log('\n📊 Summary:')
  if (allTablesExist) {
    console.log('✅ All database tables are set up correctly')
    console.log('🎯 You can now test the admin login at http://localhost:3000/admin')
  } else {
    console.log('❌ Some tables are missing. Please run the setup script:')
    console.log('   1. Go to Supabase Dashboard > SQL Editor')
    console.log('   2. Run the contents of scripts/setup-admin.sql')
  }
}

checkSetup()
