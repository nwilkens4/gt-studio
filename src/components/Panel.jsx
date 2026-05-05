import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function Panel({ children }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="relative flex h-full">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Collapse panel' : 'Expand panel'}
        className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-16 flex items-center justify-center cursor-pointer z-10"
        style={{
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '8px 0 0 8px',
        }}
      >
        {open
          ? <ChevronRight size={16} className="text-white" />
          : <ChevronLeft size={16} className="text-white" />
        }
      </button>

      <div
        className="h-full overflow-hidden transition-all duration-300 ease-in-out"
        style={{ width: open ? '320px' : '0px' }}
      >
        <div className="w-80 h-full overflow-y-auto flex flex-col gap-3 p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
