import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CarouselCard({ label, options, currentIndex, onSelect, onNext, onPrev }) {
  const hasColors = options[0]?.color !== undefined

  if (hasColors) {
    return (
      <div className="px-5 pt-5 pb-4">
        <p className="text-[9px] tracking-[0.22em] uppercase font-medium text-zinc-500 mb-3">{label}</p>
        <div className="grid grid-cols-6 gap-[9px] mb-3">
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
        <p className="text-[12px] text-zinc-300 font-medium">{options[currentIndex].label}</p>
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
