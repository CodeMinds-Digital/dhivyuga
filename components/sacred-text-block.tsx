interface SacredTextBlockProps {
  text: string
  transliteration?: string
}

export function SacredTextBlock({ text, transliteration }: SacredTextBlockProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#FEF9C3] to-orange-50 border border-amber-200 rounded-xl px-10 py-6 text-center mb-6">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#B8860B] opacity-40 select-none">॥</span>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#B8860B] opacity-40 select-none">॥</span>
      <p className="text-xl font-semibold text-neutral-900 leading-relaxed font-noto-tamil">
        {text}
      </p>
      {transliteration && (
        <p className="text-sm text-neutral-500 mt-3 italic tracking-wide">
          {transliteration}
        </p>
      )}
    </div>
  )
}
