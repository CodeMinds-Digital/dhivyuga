'use client'

import { Eye } from 'lucide-react'

interface SearchResultItemProps {
  id: string
  title: string
  text: string
  deityName?: string
  categoryName?: string
  timeName?: string
  countValue?: number
  viewCount: number
  onClick: (id: string) => void
}

export function SearchResultItem({
  id, title, text, deityName, categoryName, timeName, countValue, viewCount, onClick,
}: SearchResultItemProps) {
  const snippet = text.length > 160 ? text.substring(0, 160) + '...' : text

  return (
    <button
      onClick={() => onClick(id)}
      className="w-full flex items-start gap-4 py-5 border-b border-neutral-100 cursor-pointer text-left transition-all duration-150 hover:bg-white hover:-mx-4 hover:px-4 hover:rounded-xl group"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-neutral-900 leading-snug mb-1 group-hover:text-brand-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">{snippet}</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {deityName && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-brand-50 text-brand-700">
              {deityName}
            </span>
          )}
          {categoryName && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
              {categoryName}
            </span>
          )}
          {timeName && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
              {timeName}{countValue ? ` · ${countValue}×` : ''}
            </span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-1 text-xs text-neutral-400" role="status" aria-label={`${viewCount} views`}>
        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{viewCount}</span>
      </div>
    </button>
  )
}
