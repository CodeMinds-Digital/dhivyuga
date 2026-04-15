'use client'

import { useState, useEffect } from 'react'
import { databases, DATABASE_ID, COLLECTIONS, Query, ID } from '@/lib/appwrite'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash2, ArrowLeft, Tag, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/admin/admin-layout'
import Link from 'next/link'

interface Category {
  $id: string
  name: string
  description: string | null
  is_active: boolean
  $createdAt: string
  mantra_count?: number
}

interface FormData {
  name: string
  description: string
  is_active: boolean
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    is_active: true
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      // Fetch categories
      const categoriesRes = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        [Query.orderAsc('name'), Query.limit(100)]
      )

      // Fetch all mantras to count by category_id
      const mantrasRes = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MANTRAS,
        [Query.limit(5000)]
      )

      // Count mantras per category
      const mantraCountByCategory: Record<string, number> = {}
      mantrasRes.documents.forEach((mantra: any) => {
        if (mantra.category_id) {
          mantraCountByCategory[mantra.category_id] = (mantraCountByCategory[mantra.category_id] || 0) + 1
        }
      })

      const categoriesWithCount = categoriesRes.documents.map((category: any) => ({
        ...category,
        mantra_count: mantraCountByCategory[category.$id] || 0
      }))

      setCategories(categoriesWithCount)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (editingCategory) {
        // Update existing category
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.CATEGORIES,
          editingCategory.$id,
          formData
        )
      } else {
        // Create new category
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.CATEGORIES,
          ID.unique(),
          formData
        )
      }

      setIsDialogOpen(false)
      setEditingCategory(null)
      setFormData({ name: '', description: '', is_active: true })
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      setError('Error saving category. Please try again.')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      is_active: category.is_active
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will affect all associated mantras.')) return

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.CATEGORIES, id)
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      setError('Error deleting category. Please try again.')
    }
  }

  const openCreateDialog = () => {
    setEditingCategory(null)
    setError('')
    setFormData({ name: '', description: '', is_active: true })
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
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
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

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((category) => (
                    <motion.div
                      key={category.$id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="admin-category-card p-6 relative group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-admin-primary/10 to-admin-secondary/10 rounded-lg">
                            <Tag className="h-5 w-5 text-admin-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-slate-900 group-hover:text-admin-primary transition-colors">
                              {category.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="mt-1 bg-admin-primary/10 text-admin-primary border-admin-primary/20"
                            >
                              {category.mantra_count} mantras
                            </Badge>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(category)}
                            className="h-8 w-8 p-0 hover:bg-admin-primary/10 hover:text-admin-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(category.$id)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Description */}
                      {category.description && (
                        <p className="text-zinc-700 text-sm mb-4 line-clamp-2 leading-relaxed font-medium">
                          {category.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <span className="text-xs text-zinc-600 font-medium">
                          Created {new Date(category.$createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${category.is_active ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                          <span className="text-xs text-zinc-600 font-medium">{category.is_active ? 'Active' : 'Inactive'}</span>
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
                      <div key={category.$id} className="flex justify-between items-center">
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
