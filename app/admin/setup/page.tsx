'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SacredSymbolsBar } from '@/components/sacred-symbols-bar'
import { CheckCircle, AlertCircle, User, Lock } from 'lucide-react'

export default function AdminSetup() {
  const [email, setEmail] = useState('admin@dhivyuga.com')
  const [password, setPassword] = useState('dhivyuga2025')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setError('')
      } else {
        setError(data.error || 'Failed to create admin user')
        setSuccess(false)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50">
      <SacredSymbolsBar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
            <CardDescription>
              Create the initial admin user for Dhivyuga
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-green-700">Admin User Created!</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    You can now sign in to the admin panel with your credentials.
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.href = '/admin/login'}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Admin Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                  disabled={loading}
                >
                  {loading ? 'Creating Admin User...' : 'Create Admin User'}
                </Button>
              </form>
            )}
            
            <div className="mt-6 text-center text-sm text-gray-600">
              <p className="font-semibold">Default Credentials:</p>
              <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                Email: admin@dhivyuga.com<br />
                Password: dhivyuga2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
