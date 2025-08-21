// Script to create admin user programmatically
// Run this with: node scripts/create-admin-user.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read environment variables from .env.local
let supabaseUrl, supabaseServiceKey

try {
  const envPath = path.join(__dirname, '..', '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf8')

  const envLines = envContent.split('\n')
  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1]
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      supabaseServiceKey = line.split('=')[1]
    }
  }
} catch (error) {
  console.error('Error reading .env.local file:', error.message)
  console.log('Please make sure .env.local exists with your Supabase credentials')
  process.exit(1)
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  try {
    console.log('Creating admin user...')

    // Create the user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@dhivyuga.com',
      password: 'DhivyugaAdmin2024!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Dhivyuga Admin'
      }
    })

    if (authError) {
      console.error('Error creating user:', authError.message)
      return
    }

    console.log('User created successfully:', authData.user.email)

    // Update the user's profile to admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: 'admin',
        full_name: 'Dhivyuga Admin'
      })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('Error updating profile:', profileError.message)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@dhivyuga.com')
    console.log('🔑 Password: DhivyugaAdmin2024!')
    console.log('🎯 You can now login to /admin')

  } catch (error) {
    console.error('Unexpected error:', error.message)
  }
}

createAdminUser()
