import { create } from 'zustand'

export const useSpotifyStore = create((set) => ({
  token: null,
  refreshToken: null,
  isConnected: false,
  currentTrack: null,
  isPlaying: false,
  volume: 50,

  setToken: (token, refreshToken) =>
    set({ token, refreshToken, isConnected: !!token }),

  setCurrentTrack: (track) => set({ currentTrack: track }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setVolume: (volume) => set({ volume }),

  disconnect: () => set({
    token: null,
    refreshToken: null,
    isConnected: false,
    currentTrack: null,
    isPlaying: false,
  }),
}))
