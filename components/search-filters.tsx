'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Filters {
  category: string
  deity: string
  kalam: string
  timeOfDay: string
  recitationCount: string
}

interface SearchFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const categories = [
    { value: 'wealth', label: 'Wealth' },
    { value: 'protection', label: 'Protection' },
    { value: 'health', label: 'Health' },
    { value: 'wisdom', label: 'Wisdom' },
    { value: 'love', label: 'Love' },
    { value: 'success', label: 'Success' },
    { value: 'peace', label: 'Peace' },
    { value: 'spiritualGrowth', label: 'Spiritual Growth' },
    { value: 'obstacleRemoval', label: 'Obstacle Removal' },
    { value: 'goodFortune', label: 'Good Fortune' }
  ]

  const deities = [
    { value: 'ganesha', label: 'Ganesha' },
    { value: 'lakshmi', label: 'Lakshmi' },
    { value: 'saraswati', label: 'Saraswati' },
    { value: 'hanuman', label: 'Hanuman' },
    { value: 'shiva', label: 'Shiva' },
    { value: 'vishnu', label: 'Vishnu' },
    { value: 'devi', label: 'Devi' },
    { value: 'krishna', label: 'Krishna' }
  ]

  const kalams = [
    { value: 'rahu', label: 'Rahu Kalam' },
    { value: 'yama', label: 'Yama Kalam' },
    { value: 'gulika', label: 'Gulika Kalam' },
    { value: 'surya', label: 'Surya Hora' },
    { value: 'chandra', label: 'Chandra Hora' },
    { value: 'guru', label: 'Guru Hora' },
    { value: 'shukra', label: 'Shukra Hora' }
  ]

  const timesOfDay = [
    { value: 'morning', label: 'Morning' },
    { value: 'noon', label: 'Noon' },
    { value: 'evening', label: 'Evening' },
    { value: 'brahmaMuhurta', label: 'Brahma Muhurta' }
  ]

  const recitationCounts = [
    { value: '11', label: '11 times' },
    { value: '21', label: '21 times' },
    { value: '51', label: '51 times' },
    { value: '108', label: '108 times (1 mala)' },
    { value: '1008', label: '1008 times' },
    { value: '10008', label: '10008 times' }
  ]

  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      deity: '',
      kalam: '',
      timeOfDay: '',
      recitationCount: ''
    })
  }

  return (
    <Card className="card-outlined sticky top-24 shadow-sm">
      <CardHeader>
        <CardTitle className="text-title text-zinc-900">
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="text-label-large font-medium text-zinc-700 mb-3 block">
            Category
          </label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger className="rounded-lg border-zinc-200 h-11">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Deity Filter */}
        <div>
          <label className="text-label-large font-medium text-zinc-700 mb-3 block">
            Deity
          </label>
          <Select value={filters.deity} onValueChange={(value) => updateFilter('deity', value)}>
            <SelectTrigger className="rounded-lg border-zinc-200 h-11">
              <SelectValue placeholder="Select deity" />
            </SelectTrigger>
            <SelectContent>
              {deities.map((deity) => (
                <SelectItem key={deity.value} value={deity.value}>
                  {deity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Kalam Filter */}
        <div>
          <label className="text-label-large font-medium text-zinc-700 mb-3 block">
            Kalam
          </label>
          <Select value={filters.kalam} onValueChange={(value) => updateFilter('kalam', value)}>
            <SelectTrigger className="rounded-lg border-zinc-200 h-11">
              <SelectValue placeholder="Select kalam" />
            </SelectTrigger>
            <SelectContent>
              {kalams.map((kalam) => (
                <SelectItem key={kalam.value} value={kalam.value}>
                  {kalam.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time of Day Filter */}
        <div>
          <label className="text-label-large font-medium text-zinc-700 mb-3 block">
            Time of Day
          </label>
          <Select value={filters.timeOfDay} onValueChange={(value) => updateFilter('timeOfDay', value)}>
            <SelectTrigger className="rounded-lg border-zinc-200 h-11">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timesOfDay.map((time) => (
                <SelectItem key={time.value} value={time.value}>
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recitation Count Filter */}
        <div>
          <label className="text-label-large font-medium text-zinc-700 mb-3 block">
            Recitation Count
          </label>
          <Select value={filters.recitationCount} onValueChange={(value) => updateFilter('recitationCount', value)}>
            <SelectTrigger className="rounded-lg border-zinc-200 h-11">
              <SelectValue placeholder="Select count" />
            </SelectTrigger>
            <SelectContent>
              {recitationCounts.map((count) => (
                <SelectItem key={count.value} value={count.value}>
                  {count.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full rounded-lg border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 h-11"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}
