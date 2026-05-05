import { create } from 'zustand'

const INITIAL_STATE = {
  car:         { index: 0 },
  paint:       { index: 0 },
  finish:      { index: 0 },
  rims:        { index: 0 },
  rimColor:    { index: 0 },
  bodyKit:     { index: 0 },
  decals:      { index: 0 },
  environment: { index: 0 },
  weather:     { index: 0 },
  camera:      { index: 0 },
}

export const useCarStore = create((set) => ({
  ...INITIAL_STATE,

  next: (key, total) =>
    set((state) => ({ [key]: { index: (state[key].index + 1) % total } })),

  prev: (key, total) =>
    set((state) => ({ [key]: { index: (state[key].index - 1 + total) % total } })),

  setIndex: (key, index) =>
    set({ [key]: { index } }),

  reset: () => set(INITIAL_STATE),
}))

useCarStore.getInitialState = () => INITIAL_STATE
