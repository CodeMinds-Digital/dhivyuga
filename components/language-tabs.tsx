'use client'

interface LanguageTab {
  code: string
  name: string
  nativeName: string
}

interface LanguageTabsProps {
  languages: LanguageTab[]
  activeCode: string
  onTabChange: (code: string) => void
}

export function LanguageTabs({ languages, activeCode, onTabChange }: LanguageTabsProps) {
  return (
    <div className="flex border-b border-neutral-200 mb-6 overflow-x-auto" role="tablist" aria-label="Content language">
      {languages.map((lang) => (
        <button
          key={lang.code}
          role="tab"
          id={`lang-tab-${lang.code}`}
          aria-selected={activeCode === lang.code}
          onClick={() => onTabChange(lang.code)}
          className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150 ${
            activeCode === lang.code
              ? 'text-brand-700 border-brand-500 font-semibold'
              : 'text-neutral-500 border-transparent hover:text-neutral-700'
          }`}
        >
          {lang.nativeName} ({lang.name})
        </button>
      ))}
    </div>
  )
}
