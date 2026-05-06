import { useRef, useCallback } from 'react'
import Panel from './components/Panel'
import CarouselCard from './components/CarouselCard'
import CarViewer from './components/CarViewer'
import MusicPanel from './components/MusicPanel'
import { useCarStore } from './state/useCarStore'
import { CARS, ALL_CATEGORIES } from './config/carOptions'

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
      <div className="flex-1 min-w-0">
        <CarViewer onRendererReady={(gl) => { rendererRef.current = gl }} />
      </div>

      <Panel>
        <CarouselCard
          label="CAR MODEL"
          options={CARS}
          currentIndex={store.car.index}
          onSelect={(i) => store.setIndex('car', i)}
          onNext={() => store.next('car', CARS.length)}
          onPrev={() => store.prev('car', CARS.length)}
        />

        {ALL_CATEGORIES.map(({ key, label, options }) => (
          <CarouselCard
            key={key}
            label={label}
            options={options}
            currentIndex={store[key].index}
            onSelect={(i) => store.setIndex(key, i)}
            onNext={() => store.next(key, options.length)}
            onPrev={() => store.prev(key, options.length)}
          />
        ))}

        <MusicPanel />

        <div className="px-5 py-5 flex gap-3 mt-auto">
          <button
            onClick={store.reset}
            className="flex-1 py-2 text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-200 transition-colors duration-200 cursor-pointer rounded-lg hover:bg-white/5 active:scale-[0.98]"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Reset
          </button>
          <button
            onClick={handleScreenshot}
            className="flex-1 py-2 text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-200 transition-colors duration-200 cursor-pointer rounded-lg hover:bg-white/5 active:scale-[0.98]"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Screenshot
          </button>
        </div>
      </Panel>
    </div>
  )
}
