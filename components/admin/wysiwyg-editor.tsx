'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Label } from '@/components/ui/label'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

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

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }

  // Quill formats
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet',
    'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
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
