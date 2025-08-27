'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Label } from '@/components/ui/label'

// Import ReactQuill New (React 18 compatible)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="h-32 bg-gray-50 border border-gray-300 rounded-md flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  )
})

// Import styles
import 'react-quill-new/dist/quill.snow.css'

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  className?: string
  height?: string
}

const WysiwygEditor = ({ value, onChange, placeholder, label, error, className = '', height = '200px' }: WysiwygEditorProps) => {

  // Initialize Quill formats on component mount
  useEffect(() => {
    // This ensures Quill is properly initialized with all formats
    if (typeof window !== 'undefined') {
      import('react-quill-new').then(() => {
        // Quill is now loaded and initialized
      })
    }
  }, [])

  // Quill modules configuration (React 18 compatible)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }], // Simplified header options
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }

  // Quill formats (React 18 compatible)
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', // Includes both 'ordered' and 'bullet' as values
    'indent',
    'align',
    'blockquote', 'code-block',
    'link'
  ]

  const handleChange = (content: string, delta: any, source: any, editor: any) => {
    onChange(content)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-slate-700">
          {label}
        </Label>
      )}
      <div className="relative">
        <style jsx global>{`
            .ql-editor {
              min-height: ${height};
              font-family: 'Inter', sans-serif;
              font-size: 14px;
              line-height: 1.6;
            }
            .ql-toolbar {
              border-top: 1px solid #e2e8f0;
              border-left: 1px solid #e2e8f0;
              border-right: 1px solid #e2e8f0;
              border-bottom: none;
              border-radius: 0.375rem 0.375rem 0 0;
              background: #f8fafc;
            }
            .ql-container {
              border-bottom: 1px solid #e2e8f0;
              border-left: 1px solid #e2e8f0;
              border-right: 1px solid #e2e8f0;
              border-top: none;
              border-radius: 0 0 0.375rem 0.375rem;
              font-family: 'Inter', sans-serif;
            }
            .ql-editor.ql-blank::before {
              color: #94a3b8;
              font-style: normal;
            }
            .ql-snow .ql-tooltip {
              z-index: 1000;
            }
            ${error ? `
              .ql-toolbar,
              .ql-container {
                border-color: #ef4444;
              }
            ` : ''}
          `}</style>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || 'Enter mantra content...'}
          style={{
            backgroundColor: 'white',
            borderRadius: '0.375rem',
          }}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}

export default WysiwygEditor
