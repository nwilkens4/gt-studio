import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

export default function CarouselCard({ label, options, currentIndex, onSelect, onNext, onPrev }) {
  const hasColors = options[0]?.color !== undefined
  const [open, setOpen] = useState(false)

  if (hasColors) {
    const selected = options[currentIndex]
    return (
      <div className="px-5 pt-4 pb-3">
        {/* Accordion header */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={label}
          className="w-full flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <p className="text-[9px] tracking-[0.22em] uppercase font-medium text-zinc-500">
              {label}
            </p>
            {/* Selected swatch preview — always visible */}
            <span
              className="w-[10px] h-[10px] rounded-full flex-shrink-0"
              style={{ backgroundColor: selected.color, boxShadow: '0 0 0 1px rgba(255,255,255,0.15)' }}
            />
            <span className="text-[10px] text-zinc-400 font-medium">{selected.label}</span>
          </div>
          <ChevronDown
            size={11}
            strokeWidth={1.5}
            className="text-zinc-600 group-hover:text-zinc-300 transition-all duration-200"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {/* Collapsible swatch grid */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: open ? '320px' : '0px' }}
        >
          <div className="grid grid-cols-6 gap-[9px] mt-3 mb-3">
            {options.map((opt, i) => (
              <button
                key={opt.id}
                onClick={() => onSelect(i)}
                title={opt.label}
                aria-label={opt.label}
                className="w-7 h-7 rounded-full cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95 flex-shrink-0"
                style={{
                  backgroundColor: opt.color,
                  boxShadow: i === currentIndex
                    ? '0 0 0 2.5px #090909, 0 0 0 4.5px rgba(255,255,255,0.85)'
                    : '0 0 0 1px rgba(255,255,255,0.12)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 py-4">
      <p className="text-[9px] tracking-[0.22em] uppercase font-medium text-zinc-500 mb-2">{label}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          aria-label={`Previous ${label}`}
          className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-300 transition-colors duration-150 cursor-pointer rounded hover:bg-white/5 active:scale-95"
        >
          <ChevronLeft size={13} strokeWidth={1.5} />
        </button>
        <span className="flex-1 text-center text-[12px] text-zinc-200 font-medium select-none">
          {options[currentIndex].label}
        </span>
        <button
          onClick={onNext}
          aria-label={`Next ${label}`}
          className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-300 transition-colors duration-150 cursor-pointer rounded hover:bg-white/5 active:scale-95"
        >
          <ChevronRight size={13} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}
