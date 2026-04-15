import { NextRequest, NextResponse } from 'next/server'
import { Client, Users, ID } from 'node-appwrite'
import { validateAdminSecret } from '@/lib/appwrite-server'

export async function POST(request: NextRequest) {
  if (!validateAdminSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const client = new Client()
    client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
      .setKey(process.env.APPWRITE_API_KEY || '')

    const users = new Users(client)

    const user = await users.create(
      ID.unique(),
      email,
      undefined, // phone
      password,
      'Dhivyuga Admin'
    )

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: user.$id,
        email: user.email,
        role: 'admin'
      }
    })

  } catch (error: any) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: error?.code === 409 ? 409 : 500 }
    )
  }
}
