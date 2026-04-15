'use client'

import { useState, useEffect } from 'react'
import { databases, DATABASE_ID, COLLECTIONS, Query, ID, getRelatedDoc } from '@/lib/appwrite'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, ArrowLeft, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import LanguageManager from '@/components/admin/language-manager'
import Link from 'next/link'

interface Mantra {
  $id: string
  title: string
  text: string
  view_count: number
  $createdAt: string
  deity_id?: string
  category_id?: string
  count_id?: string
  time_id?: string
  deities?: { $id: string; name: string } | null
  categories?: { $id: string; name: string } | null
  recitation_counts?: { $id: string; count_value: number } | null
  recitation_times?: { $id: string; name: string } | null
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
      // Fetch mantras
      const mantrasRes = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MANTRAS,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      )

      // Fetch dropdown options in parallel
      const [deitiesRes, categoriesRes, countsRes, timesRes] = await Promise.all([
        databases.listDocuments(DATABASE_ID, COLLECTIONS.DEITIES, [Query.orderAsc('name'), Query.limit(100)]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.CATEGORIES, [Query.orderAsc('name'), Query.limit(100)]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.RECITATION_COUNTS, [Query.orderAsc('count_value'), Query.limit(100)]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.RECITATION_TIMES, [Query.orderAsc('name'), Query.limit(100)])
      ])

      // Resolve related documents for each mantra
      const mantrasWithRelations = await Promise.all(
        mantrasRes.documents.map(async (mantra: any) => {
          const [deity, category, count, time] = await Promise.all([
            getRelatedDoc(COLLECTIONS.DEITIES, mantra.deity_id),
            getRelatedDoc(COLLECTIONS.CATEGORIES, mantra.category_id),
            getRelatedDoc(COLLECTIONS.RECITATION_COUNTS, mantra.count_id),
            getRelatedDoc(COLLECTIONS.RECITATION_TIMES, mantra.time_id)
          ])
          return {
            ...mantra,
            deities: deity ? { $id: deity.$id, name: deity.name } : null,
            categories: category ? { $id: category.$id, name: category.name } : null,
            recitation_counts: count ? { $id: count.$id, count_value: count.count_value } : null,
            recitation_times: time ? { $id: time.$id, name: time.name } : null
          }
        })
      )

      setMantras(mantrasWithRelations)
      setDeities(deitiesRes.documents)
      setCategories(categoriesRes.documents)
      setRecitationCounts(countsRes.documents)
      setRecitationTimes(timesRes.documents)
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
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.MANTRAS,
          editingMantra.$id,
          formData
        )
      } else {
        // Create new mantra
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.MANTRAS,
          ID.unique(),
          formData
        )
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
      deity_id: mantra.deities?.$id || mantra.deity_id || '',
      category_id: mantra.categories?.$id || mantra.category_id || '',
      count_id: mantra.recitation_counts?.$id || mantra.count_id || '',
      time_id: mantra.recitation_times?.$id || mantra.time_id || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mantra?')) return

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.MANTRAS, id)
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
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingMantra ? 'Edit Mantra' : 'Add New Mantra'}
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger
                      value="basic"
                      className="font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700"
                    >
                      Basic Information
                    </TabsTrigger>
                    <TabsTrigger
                      value="translations"
                      disabled={!editingMantra}
                      className="font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Language Translations
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Title</Label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter mantra title"
                          required
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Text</Label>
                        <Textarea
                          value={formData.text}
                          onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                          placeholder="Enter mantra text"
                          rows={3}
                          required
                          className="mt-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Deity</Label>
                          <Select value={formData.deity_id} onValueChange={(value) => setFormData(prev => ({ ...prev, deity_id: value }))}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select deity" />
                            </SelectTrigger>
                            <SelectContent>
                              {deities.map((deity) => (
                                <SelectItem key={deity.$id} value={deity.$id}>
                                  {deity.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Category</Label>
                          <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.$id} value={category.$id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Recitation Count</Label>
                          <Select value={formData.count_id} onValueChange={(value) => setFormData(prev => ({ ...prev, count_id: value }))}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select count" />
                            </SelectTrigger>
                            <SelectContent>
                              {recitationCounts.map((count) => (
                                <SelectItem key={count.$id} value={count.$id}>
                                  {count.count_value} times
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Best Time</Label>
                          <Select value={formData.time_id} onValueChange={(value) => setFormData(prev => ({ ...prev, time_id: value }))}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {recitationTimes.map((time) => (
                                <SelectItem key={time.$id} value={time.$id}>
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
                  </TabsContent>

                  <TabsContent value="translations" className="mt-6">
                    {editingMantra && (
                      <LanguageManager
                        mantraId={editingMantra.$id}
                        onTranslationsChange={(translations) => {
                          // Handle translations change if needed
                          console.log('Translations updated:', translations)
                        }}
                      />
                    )}
                  </TabsContent>
                </Tabs>
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
                    <TableRow key={mantra.$id}>
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
                        {new Date(mantra.$createdAt).toLocaleDateString()}
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
                            onClick={() => handleDelete(mantra.$id)}
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
    </AdminLayout>
  )
}
