'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MoreHorizontal, Plus, Eye } from 'lucide-react'

interface RecentActivity {
  id: string
  type: 'mantra_added' | 'mantra_viewed' | 'category_created'
  title: string
  description: string
  time: string
  user?: string
}

interface DataTableProps {
  title: string
  data: RecentActivity[]
  showAddButton?: boolean
  onAdd?: () => void
}

export function DataTable({ title, data, showAddButton, onAdd }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mantra_added':
        return <Plus className="h-4 w-4 text-green-600" />
      case 'mantra_viewed':
        return <Eye className="h-4 w-4 text-blue-600" />
      case 'category_created':
        return <Plus className="h-4 w-4 text-purple-600" />
      default:
        return <MoreHorizontal className="h-4 w-4 text-slate-400" />
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'mantra_added':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">Added</Badge>
      case 'mantra_viewed':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Viewed</Badge>
      case 'category_created':
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">Created</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">{title}</CardTitle>
          {showAddButton && (
            <Button onClick={onAdd} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-2">
                <Search className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-slate-600">No items found</p>
              <p className="text-sm text-slate-400">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      {getActivityIcon(item.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-slate-900 truncate">
                          {item.title}
                        </h4>
                        {getActivityBadge(item.type)}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>{item.time}</span>
                        {item.user && <span>by {item.user}</span>}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {filteredData.length > 0 && (
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Showing {filteredData.length} of {data.length} items</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
