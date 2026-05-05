import { useRef, useCallback } from 'react'
import Panel from './components/Panel'
import CarouselCard from './components/CarouselCard'
import CarViewer from './components/CarViewer'
import { useCarStore } from './state/useCarStore'
import { ALL_CATEGORIES } from './config/carOptions'

export default function App() {
  const store = useCarStore()
  const rendererRef = useRef()

  const handleScreenshot = useCallback(() => {
    if (!rendererRef.current) return
    const link = document.createElement('a')
    link.download = 'gt2rs-build.png'
    link.href = rendererRef.current.domElement.toDataURL('image/png')
    link.click()
  }, [])

  return (
    <div className="w-full h-full flex">
      <div className="flex-1">
        <CarViewer onRendererReady={(gl) => { rendererRef.current = gl }} />
      </div>

      <Panel>
        {ALL_CATEGORIES.map(({ key, label, options }) => (
          <CarouselCard
            key={key}
            label={label}
            value={options[store[key].index].label}
            onNext={() => store.next(key, options.length)}
            onPrev={() => store.prev(key, options.length)}
          />
        ))}

        <div className="flex gap-2 mt-2">
          <button
            onClick={store.reset}
            className="flex-1 py-2 text-xs font-semibold tracking-widest uppercase text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors duration-200 cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={handleScreenshot}
            className="flex-1 py-2 text-xs font-semibold tracking-widest uppercase text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors duration-200 cursor-pointer"
          >
            Screenshot
          </button>
        </div>
      </Panel>
    </div>
  )
}
