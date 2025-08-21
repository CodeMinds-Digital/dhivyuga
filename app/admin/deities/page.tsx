'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, ArrowLeft, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/admin/admin-layout'
import Link from 'next/link'

interface Deity {
  id: string
  name: string
  description: string | null
  created_at: string
  mantra_count?: number
}

interface FormData {
  name: string
  description: string
}

export default function DeityManagementPage() {
  const [deities, setDeities] = useState<Deity[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeity, setEditingDeity] = useState<Deity | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: ''
  })

  useEffect(() => {
    fetchDeities()
  }, [])

  const fetchDeities = async () => {
    setLoading(true)
    try {
      // Fetch deities with mantra count
      const { data: deitiesData } = await supabase
        .from('deities')
        .select(`
          *,
          mantras(count)
        `)
        .order('name')

      // Transform data to include mantra count
      const deitiesWithCount = deitiesData?.map(deity => ({
        ...deity,
        mantra_count: deity.mantras?.length || 0
      })) || []

      setDeities(deitiesWithCount)
    } catch (error) {
      console.error('Error fetching deities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingDeity) {
        // Update existing deity
        const { error } = await supabase
          .from('deities')
          .update(formData)
          .eq('id', editingDeity.id)

        if (error) throw error
      } else {
        // Create new deity
        const { error } = await supabase
          .from('deities')
          .insert([formData])

        if (error) throw error
      }

      setIsDialogOpen(false)
      setEditingDeity(null)
      setFormData({ name: '', description: '' })
      fetchDeities()
    } catch (error) {
      console.error('Error saving deity:', error)
      alert('Error saving deity. Please try again.')
    }
  }

  const handleEdit = (deity: Deity) => {
    setEditingDeity(deity)
    setFormData({
      name: deity.name,
      description: deity.description || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deity? This will affect all associated mantras.')) return

    try {
      const { error } = await supabase
        .from('deities')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchDeities()
    } catch (error) {
      console.error('Error deleting deity:', error)
      alert('Error deleting deity. Please try again.')
    }
  }

  const openCreateDialog = () => {
    setEditingDeity(null)
    setFormData({ name: '', description: '' })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Deity Management</h1>
            <p className="text-slate-600">Manage divine beings associated with mantras</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Deity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingDeity ? 'Edit Deity' : 'Add New Deity'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter deity name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter deity description"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingDeity ? 'Update' : 'Create'} Deity
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Deities Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deities Grid */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>All Deities ({deities.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {deities.map((deity) => (
                    <motion.div
                      key={deity.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="admin-category-card p-6 relative group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-admin-secondary/10 to-admin-primary/10 rounded-lg">
                            <User className="h-5 w-5 text-admin-secondary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-slate-900 group-hover:text-admin-secondary transition-colors">
                              {deity.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="mt-1 bg-admin-secondary/10 text-admin-secondary border-admin-secondary/20"
                            >
                              {deity.mantra_count} mantras
                            </Badge>
                          </div>
                        </div>


                        {/* Action Buttons */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(deity)}
                            className="h-8 w-8 p-0 hover:bg-admin-secondary/10 hover:text-admin-secondary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(deity.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Description */}
                      {deity.description && (
                        <p className="text-zinc-700 text-sm mb-4 line-clamp-2 leading-relaxed font-medium">
                          {deity.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <span className="text-xs text-zinc-600 font-medium">
                          Created {new Date(deity.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-zinc-600 font-medium">Active</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {deities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No deities found. Create your first deity to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-700">Total Deities</span>
                  <span className="font-semibold text-slate-900">{deities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-700">Total Mantras</span>
                  <span className="font-semibold text-slate-900">
                    {deities.reduce((sum, deity) => sum + (deity.mantra_count || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-700">Avg per Deity</span>
                  <span className="font-semibold text-slate-900">
                    {deities.length > 0
                      ? Math.round(deities.reduce((sum, deity) => sum + (deity.mantra_count || 0), 0) / deities.length)
                      : 0
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Deities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deities
                    .sort((a, b) => (b.mantra_count || 0) - (a.mantra_count || 0))
                    .slice(0, 5)
                    .map((deity) => (
                      <div key={deity.id} className="flex justify-between items-center">
                        <span className="text-sm">{deity.name}</span>
                        <Badge variant="outline">{deity.mantra_count}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
