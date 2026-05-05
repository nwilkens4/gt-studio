import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CarouselCard({ label, value, onNext, onPrev }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{
        background: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
        {label}
      </span>
      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          aria-label={`Previous ${label}`}
          className="w-11 h-11 flex items-center justify-center text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-white font-medium text-sm text-center flex-1">
          {value}
        </span>
        <button
          onClick={onNext}
          aria-label={`Next ${label}`}
          className="w-11 h-11 flex items-center justify-center text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
