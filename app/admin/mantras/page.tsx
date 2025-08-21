'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/admin/admin-layout'
import Link from 'next/link'

interface Mantra {
  id: string
  title: string
  text: string
  view_count: number
  created_at: string
  deities?: { id: string; name: string }
  categories?: { id: string; name: string }
  recitation_counts?: { id: string; count_value: number }
  recitation_times?: { id: string; name: string }
}

interface FormData {
  title: string
  text: string
  deity_id: string
  category_id: string
  count_id: string
  time_id: string
}

export default function MantraManagementPage() {
  const [mantras, setMantras] = useState<Mantra[]>([])
  const [deities, setDeities] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [recitationCounts, setRecitationCounts] = useState<any[]>([])
  const [recitationTimes, setRecitationTimes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMantra, setEditingMantra] = useState<Mantra | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    text: '',
    deity_id: '',
    category_id: '',
    count_id: '',
    time_id: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch mantras with related data
      const { data: mantrasData } = await supabase
        .from('mantras')
        .select(`
          *,
          deities(id, name),
          categories(id, name),
          recitation_counts(id, count_value),
          recitation_times(id, name)
        `)
        .order('created_at', { ascending: false })

      // Fetch dropdown options
      const [deitiesRes, categoriesRes, countsRes, timesRes] = await Promise.all([
        supabase.from('deities').select('*').order('name'),
        supabase.from('categories').select('*').order('name'),
        supabase.from('recitation_counts').select('*').order('count_value'),
        supabase.from('recitation_times').select('*').order('name')
      ])

      setMantras(mantrasData || [])
      setDeities(deitiesRes.data || [])
      setCategories(categoriesRes.data || [])
      setRecitationCounts(countsRes.data || [])
      setRecitationTimes(timesRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingMantra) {
        // Update existing mantra
        const { error } = await supabase
          .from('mantras')
          .update(formData)
          .eq('id', editingMantra.id)

        if (error) throw error
      } else {
        // Create new mantra
        const { error } = await supabase
          .from('mantras')
          .insert([formData])

        if (error) throw error
      }

      setIsDialogOpen(false)
      setEditingMantra(null)
      setFormData({
        title: '',
        text: '',
        deity_id: '',
        category_id: '',
        count_id: '',
        time_id: ''
      })
      fetchData()
    } catch (error) {
      console.error('Error saving mantra:', error)
      alert('Error saving mantra. Please try again.')
    }
  }

  const handleEdit = (mantra: Mantra) => {
    setEditingMantra(mantra)
    setFormData({
      title: mantra.title,
      text: mantra.text,
      deity_id: mantra.deities?.id || '',
      category_id: mantra.categories?.id || '',
      count_id: mantra.recitation_counts?.id || '',
      time_id: mantra.recitation_times?.id || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mantra?')) return

    try {
      const { error } = await supabase
        .from('mantras')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting mantra:', error)
      alert('Error deleting mantra. Please try again.')
    }
  }

  const openCreateDialog = () => {
    setEditingMantra(null)
    setFormData({
      title: '',
      text: '',
      deity_id: '',
      category_id: '',
      count_id: '',
      time_id: ''
    })
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
            <h1 className="text-2xl font-bold text-slate-900">Mantra Management</h1>
            <p className="text-slate-600">Manage and organize your sacred mantras</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Mantra
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMantra ? 'Edit Mantra' : 'Add New Mantra'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter mantra title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Text</label>
                  <Textarea
                    value={formData.text}
                    onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter mantra text"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Deity</label>
                    <Select value={formData.deity_id} onValueChange={(value) => setFormData(prev => ({ ...prev, deity_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deity" />
                      </SelectTrigger>
                      <SelectContent>
                        {deities.map((deity) => (
                          <SelectItem key={deity.id} value={deity.id}>
                            {deity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recitation Count</label>
                    <Select value={formData.count_id} onValueChange={(value) => setFormData(prev => ({ ...prev, count_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select count" />
                      </SelectTrigger>
                      <SelectContent>
                        {recitationCounts.map((count) => (
                          <SelectItem key={count.id} value={count.id}>
                            {count.count_value} times
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Best Time</label>
                    <Select value={formData.time_id} onValueChange={(value) => setFormData(prev => ({ ...prev, time_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {recitationTimes.map((time) => (
                          <SelectItem key={time.id} value={time.id}>
                            {time.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingMantra ? 'Update' : 'Create'} Mantra
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mantras Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>All Mantras ({mantras.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-slate-700">Title</TableHead>
                  <TableHead className="font-medium text-slate-700">Deity</TableHead>
                  <TableHead className="font-medium text-slate-700">Category</TableHead>
                  <TableHead className="font-medium text-slate-700">Views</TableHead>
                  <TableHead className="font-medium text-slate-700">Created</TableHead>
                  <TableHead className="text-right font-medium text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mantras.map((mantra) => (
                  <TableRow key={mantra.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{mantra.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {mantra.text}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {mantra.deities && (
                        <Badge variant="secondary">{mantra.deities.name}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {mantra.categories && (
                        <Badge variant="outline">{mantra.categories.name}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {mantra.view_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(mantra.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(mantra)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(mantra.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {mantras.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No mantras found. Create your first mantra to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout >
  )
}
