import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Panel({ children }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex h-full flex-shrink-0">
      {/* Toggle tab — always in layout flow so it never gets clipped or overlapped */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Collapse panel' : 'Expand panel'}
        className="w-5 flex-shrink-0 h-full flex items-center justify-center cursor-pointer group transition-colors duration-200"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {open
          ? <ChevronRight size={11} strokeWidth={1.5} className="text-zinc-600 group-hover:text-zinc-300 transition-colors duration-200" />
          : <ChevronLeft  size={11} strokeWidth={1.5} className="text-zinc-600 group-hover:text-zinc-300 transition-colors duration-200" />
        }
      </button>

      {/* Sliding content */}
      <div
        className="h-full overflow-hidden"
        style={{
          width: open ? '272px' : '0px',
          transition: 'width 0.28s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div
          className="w-[272px] h-full overflow-y-auto overflow-x-hidden flex flex-col [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
          style={{
            background: '#090909',
            borderLeft: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
