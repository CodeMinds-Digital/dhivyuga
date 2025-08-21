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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit, Trash2, ArrowLeft, Clock, Calendar, Timer, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/admin/admin-layout'
import Link from 'next/link'

interface RecitationTime {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface RecitationCount {
  id: string
  count_value: number
  description: string | null
  created_at: string
}

interface Kalam {
  id: string
  name: string
  description: string | null
  is_auspicious: boolean
  created_at: string
}

interface TimeRange {
  id: string
  start_time: string
  end_time: string
  description: string | null
  created_at: string
}

// Combined type for form data that includes all possible properties
interface FormData {
  id?: string
  name?: string
  description?: string | null
  count_value?: number
  is_auspicious?: boolean
  start_time?: string
  end_time?: string
  created_at?: string
}

// Union type for editing items
type EditingItem = RecitationTime | RecitationCount | Kalam | TimeRange | null

export default function SettingsManagementPage() {
  const [recitationTimes, setRecitationTimes] = useState<RecitationTime[]>([])
  const [recitationCounts, setRecitationCounts] = useState<RecitationCount[]>([])
  const [kalams, setKalams] = useState<Kalam[]>([])
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('times')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<EditingItem>(null)
  const [formData, setFormData] = useState<FormData>({})

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [timesRes, countsRes, kalamsRes, rangesRes] = await Promise.all([
        supabase.from('recitation_times').select('*').order('name'),
        supabase.from('recitation_counts').select('*').order('count_value'),
        supabase.from('kalams').select('*').order('name'),
        supabase.from('time_ranges').select('*').order('start_time')
      ])

      setRecitationTimes(timesRes.data || [])
      setRecitationCounts(countsRes.data || [])
      setKalams(kalamsRes.data || [])
      setTimeRanges(rangesRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const tableName = getTableName(activeTab)

      if (editingItem) {
        const { error } = await supabase
          .from(tableName)
          .update(formData)
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from(tableName)
          .insert([formData])

        if (error) throw error
      }

      setIsDialogOpen(false)
      setEditingItem(null)
      setFormData({})
      fetchAllData()
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Error saving item. Please try again.')
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({ ...item })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const tableName = getTableName(activeTab)
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchAllData()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Error deleting item. Please try again.')
    }
  }

  const getTableName = (tab: string) => {
    switch (tab) {
      case 'times': return 'recitation_times'
      case 'counts': return 'recitation_counts'
      case 'kalams': return 'kalams'
      case 'ranges': return 'time_ranges'
      default: return 'recitation_times'
    }
  }

  const openCreateDialog = () => {
    setEditingItem(null)
    setFormData({})
    setIsDialogOpen(true)
  }

  const renderForm = () => {
    switch (activeTab) {
      case 'times':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Morning, Evening"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description of this time period"
                rows={3}
              />
            </div>
          </>
        )
      case 'counts':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Count Value</label>
              <Input
                type="number"
                value={formData.count_value || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, count_value: parseInt(e.target.value) }))}
                placeholder="e.g., 108, 1008"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Significance of this count"
                rows={3}
              />
            </div>
          </>
        )
      case 'kalams':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Rahu Kalam, Guru Hora"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description of this kalam"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_auspicious"
                checked={formData.is_auspicious || false}
                onChange={(e) => setFormData(prev => ({ ...prev, is_auspicious: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="is_auspicious" className="text-sm font-medium">
                Is Auspicious
              </label>
            </div>
          </>
        )
      case 'ranges':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <Input
                  type="time"
                  value={formData.start_time || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <Input
                  type="time"
                  value={formData.end_time || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description of this time range"
                rows={3}
              />
            </div>
          </>
        )
      default:
        return null
    }
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
            <h1 className="text-2xl font-bold text-slate-900">Settings Management</h1>
            <p className="text-slate-600">Manage recitation times, counts, and planetary periods</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit' : 'Add New'} {activeTab === 'times' ? 'Time' : activeTab === 'counts' ? 'Count' : activeTab === 'kalams' ? 'Kalam' : 'Time Range'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {renderForm()}
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Settings Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-lg">
            <TabsTrigger
              value="times"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <Clock className="h-4 w-4" />
              Recitation Times
            </TabsTrigger>
            <TabsTrigger
              value="counts"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <Timer className="h-4 w-4" />
              Counts
            </TabsTrigger>
            <TabsTrigger
              value="kalams"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <Calendar className="h-4 w-4" />
              Kalams
            </TabsTrigger>
            <TabsTrigger
              value="ranges"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <Settings className="h-4 w-4" />
              Time Ranges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="times" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recitation Times ({recitationTimes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium text-slate-700">Name</TableHead>
                      <TableHead className="font-medium text-slate-700">Description</TableHead>
                      <TableHead className="font-medium text-slate-700">Created</TableHead>
                      <TableHead className="text-right font-medium text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recitationTimes.map((time) => (
                      <TableRow key={time.id}>
                        <TableCell className="font-medium">{time.name}</TableCell>
                        <TableCell>{time.description || '-'}</TableCell>
                        <TableCell>{new Date(time.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(time)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(time.id)}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="counts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recitation Counts ({recitationCounts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium text-slate-700">Count</TableHead>
                      <TableHead className="font-medium text-slate-700">Description</TableHead>
                      <TableHead className="font-medium text-slate-700">Created</TableHead>
                      <TableHead className="text-right font-medium text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recitationCounts.map((count) => (
                      <TableRow key={count.id}>
                        <TableCell className="font-medium">{count.count_value}</TableCell>
                        <TableCell>{count.description || '-'}</TableCell>
                        <TableCell>{new Date(count.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(count)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(count.id)}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kalams" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Kalams ({kalams.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium text-slate-700">Name</TableHead>
                      <TableHead className="font-medium text-slate-700">Auspicious</TableHead>
                      <TableHead className="font-medium text-slate-700">Description</TableHead>
                      <TableHead className="font-medium text-slate-700">Created</TableHead>
                      <TableHead className="text-right font-medium text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kalams.map((kalam) => (
                      <TableRow key={kalam.id}>
                        <TableCell className="font-medium">{kalam.name}</TableCell>
                        <TableCell>
                          <Badge variant={kalam.is_auspicious ? "success" : "secondary"}>
                            {kalam.is_auspicious ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell>{kalam.description || '-'}</TableCell>
                        <TableCell>{new Date(kalam.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(kalam)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(kalam.id)}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ranges" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Ranges ({timeRanges.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium text-slate-700">Time Range</TableHead>
                      <TableHead className="font-medium text-slate-700">Description</TableHead>
                      <TableHead className="font-medium text-slate-700">Created</TableHead>
                      <TableHead className="text-right font-medium text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeRanges.map((range) => (
                      <TableRow key={range.id}>
                        <TableCell className="font-medium">
                          {range.start_time} - {range.end_time}
                        </TableCell>
                        <TableCell>{range.description || '-'}</TableCell>
                        <TableCell>{new Date(range.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(range)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(range.id)}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
