// Script to make an existing user an admin
// Run this with: node scripts/make-user-admin.js

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

async function makeUserAdmin() {
  try {
    const adminEmail = 'admin@dhivyuga.com'
    
    console.log(`Making ${adminEmail} an admin...`)
    
    // First, get the user by email
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers()
    
    if (getUserError) {
      console.error('Error getting users:', getUserError.message)
      return
    }
    
    const adminUser = users.users.find(user => user.email === adminEmail)
    
    if (!adminUser) {
      console.error(`User ${adminEmail} not found. Please create the user first.`)
      return
    }
    
    console.log('User found:', adminUser.email)
    
    // Check if profiles table exists and create profile if needed
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single()
    
    if (!existingProfile) {
      // Create profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: adminUser.id,
          email: adminUser.email,
          role: 'admin',
          full_name: 'Dhivyuga Admin'
        })
      
      if (insertError) {
        console.error('Error creating profile:', insertError.message)
        return
      }
      
      console.log('✅ Profile created with admin role!')
    } else {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          full_name: 'Dhivyuga Admin'
        })
        .eq('id', adminUser.id)
      
      if (updateError) {
        console.error('Error updating profile:', updateError.message)
        return
      }
      
      console.log('✅ Profile updated with admin role!')
    }
    
    console.log('🎉 Admin setup complete!')
    console.log('📧 Email: admin@dhivyuga.com')
    console.log('🔑 Password: DhivyugaAdmin2024!')
    console.log('🎯 You can now login to /admin')

  } catch (error) {
    console.error('Unexpected error:', error.message)
  }
}

makeUserAdmin()
