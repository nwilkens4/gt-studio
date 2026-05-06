import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import MusicPanel from './MusicPanel'
import { useSpotifyStore } from '../state/useSpotifyStore'

vi.mock('../spotify/useSpotifyPlayer', () => ({
  useSpotifyPlayer: () => ({ play: vi.fn(), togglePlay: vi.fn(), setVolume: vi.fn() }),
}))

vi.mock('../spotify/auth', () => ({
  buildAuthUrl: vi.fn().mockResolvedValue('https://accounts.spotify.com/authorize'),
  exchangeCodeForToken: vi.fn(),
  refreshAccessToken: vi.fn(),
}))

beforeEach(() => {
  // Node 25 exposes a non-functional built-in localStorage; stub it for tests.
  const store = {}
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((k) => store[k] ?? null),
    setItem: vi.fn((k, v) => { store[k] = String(v) }),
    removeItem: vi.fn((k) => { delete store[k] }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]) }),
  })

  useSpotifyStore.setState({
    token: null,
    refreshToken: null,
    isConnected: false,
    currentTrack: null,
    isPlaying: false,
    volume: 50,
  })
})

describe('MusicPanel', () => {
  it('shows Connect Spotify button when disconnected', () => {
    render(<MusicPanel />)
    expect(screen.getByText(/connect spotify/i)).toBeInTheDocument()
  })

  it('shows search input when connected', () => {
    useSpotifyStore.setState({ isConnected: true, token: 'tok' })
    render(<MusicPanel />)
    expect(screen.getByPlaceholderText(/search a song/i)).toBeInTheDocument()
  })

  it('shows now-playing controls when a track is active', () => {
    useSpotifyStore.setState({
      isConnected: true,
      token: 'tok',
      currentTrack: { name: 'Bohemian Rhapsody', artist: 'Queen', albumArt: '', uri: 'spotify:track:1' },
      isPlaying: true,
    })
    render(<MusicPanel />)
    expect(screen.getByText('Bohemian Rhapsody')).toBeInTheDocument()
    expect(screen.getByText('Queen')).toBeInTheDocument()
  })
})
