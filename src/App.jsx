import Panel from './components/Panel'
import CarouselCard from './components/CarouselCard'
import { useCarStore } from './state/useCarStore'
import { ALL_CATEGORIES } from './config/carOptions'

export default function App() {
  const store = useCarStore()

  return (
    <div className="w-full h-full flex">
      {/* Car viewer placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-gray-600 text-sm">3D Canvas coming in Task 7</span>
      </div>

      {/* Control panel */}
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

        {/* Utility buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={store.reset}
            className="flex-1 py-2 text-xs font-semibold tracking-widest uppercase text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors duration-200 cursor-pointer"
          >
            Reset
          </button>
          <button
            id="screenshot-btn"
            className="flex-1 py-2 text-xs font-semibold tracking-widest uppercase text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors duration-200 cursor-pointer"
          >
            Screenshot
          </button>
        </div>
      </Panel>
    </div>
  )
}
