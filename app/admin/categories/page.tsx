'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, ArrowLeft, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/admin/admin-layout'
import Link from 'next/link'

interface Category {
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

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      // Fetch categories with mantra count
      const { data: categoriesData } = await supabase
        .from('categories')
        .select(`
          *,
          mantras(count)
        `)
        .order('name')

      // Transform data to include mantra count
      const categoriesWithCount = categoriesData?.map(category => ({
        ...category,
        mantra_count: category.mantras?.length || 0
      })) || []

      setCategories(categoriesWithCount)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingCategory.id)

        if (error) throw error
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([formData])

        if (error) throw error
      }

      setIsDialogOpen(false)
      setEditingCategory(null)
      setFormData({ name: '', description: '' })
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error saving category. Please try again.')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will affect all associated mantras.')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category. Please try again.')
    }
  }

  const openCreateDialog = () => {
    setEditingCategory(null)
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
            <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
            <p className="text-slate-600">Organize mantras by purpose and theme</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCategory ? 'Update' : 'Create'} Category
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Grid */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>All Categories ({categories.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ y: -2 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-purple-600" />
                          <h3 className="font-semibold">{category.name}</h3>
                        </div>
                        <Badge variant="secondary">
                          {category.mantra_count} mantras
                        </Badge>
                      </div>

                      {category.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {category.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Created {new Date(category.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {categories.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No categories found. Create your first category to get started.
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
                  <span className="text-sm font-medium text-slate-700">Total Categories</span>
                  <span className="font-semibold text-slate-900">{categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-700">Total Mantras</span>
                  <span className="font-semibold text-slate-900">
                    {categories.reduce((sum, cat) => sum + (cat.mantra_count || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-700">Avg per Category</span>
                  <span className="font-semibold text-slate-900">
                    {categories.length > 0
                      ? Math.round(categories.reduce((sum, cat) => sum + (cat.mantra_count || 0), 0) / categories.length)
                      : 0
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories
                    .sort((a, b) => (b.mantra_count || 0) - (a.mantra_count || 0))
                    .slice(0, 5)
                    .map((category) => (
                      <div key={category.id} className="flex justify-between items-center">
                        <span className="text-sm">{category.name}</span>
                        <Badge variant="outline">{category.mantra_count}</Badge>
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
