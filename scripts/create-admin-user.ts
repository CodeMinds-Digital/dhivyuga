/**
 * Script to create an admin user in Supabase
 * Run this script to set up the initial admin user for the application
 */

import { supabase } from '../lib/supabase'

async function createAdminUser() {
  const adminEmail = 'admin@dhivyuga.com'
  const adminPassword = 'dhivyuga2025'

  try {
    console.log('Creating admin user...')
    
    // Create the admin user
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          role: 'admin',
          name: 'Dhivyuga Admin'
        }
      }
    })

    if (error) {
      console.error('Error creating admin user:', error.message)
      return
    }

    if (data.user) {
      console.log('✅ Admin user created successfully!')
      console.log('📧 Email:', adminEmail)
      console.log('🔑 Password:', adminPassword)
      console.log('👤 User ID:', data.user.id)
      
      if (data.user.email_confirmed_at) {
        console.log('✅ Email confirmed automatically')
      } else {
        console.log('⚠️  Email confirmation may be required')
        console.log('   Check your Supabase Auth settings to disable email confirmation for development')
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the script
createAdminUser()

export { createAdminUser }
