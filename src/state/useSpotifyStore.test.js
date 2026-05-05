import { describe, it, expect, beforeEach } from 'vitest'
import { useSpotifyStore } from './useSpotifyStore'

beforeEach(() => {
  useSpotifyStore.setState({
    token: null,
    refreshToken: null,
    isConnected: false,
    currentTrack: null,
    isPlaying: false,
    volume: 50,
  })
})

describe('useSpotifyStore', () => {
  it('starts disconnected', () => {
    const { isConnected, token } = useSpotifyStore.getState()
    expect(isConnected).toBe(false)
    expect(token).toBeNull()
  })

  it('setToken marks as connected', () => {
    useSpotifyStore.getState().setToken('access123', 'refresh456')
    const { token, refreshToken, isConnected } = useSpotifyStore.getState()
    expect(token).toBe('access123')
    expect(refreshToken).toBe('refresh456')
    expect(isConnected).toBe(true)
  })

  it('disconnect clears all auth and playback state', () => {
    useSpotifyStore.getState().setToken('access', 'refresh')
    useSpotifyStore.getState().setCurrentTrack({ name: 'Song', artist: 'Artist', albumArt: '', uri: '' })
    useSpotifyStore.getState().setIsPlaying(true)
    useSpotifyStore.getState().disconnect()
    const state = useSpotifyStore.getState()
    expect(state.token).toBeNull()
    expect(state.isConnected).toBe(false)
    expect(state.currentTrack).toBeNull()
    expect(state.isPlaying).toBe(false)
  })

  it('setVolume updates volume', () => {
    useSpotifyStore.getState().setVolume(75)
    expect(useSpotifyStore.getState().volume).toBe(75)
  })
})
