# Spotify Background Music Panel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Spotify music search + playback panel inside the right-side Panel so users can search for any track and play it while customizing their car.

**Architecture:** Pure-frontend PKCE OAuth flow stores tokens in `localStorage`. The Spotify Web Playback SDK runs in-browser (requires Premium). A Zustand store holds auth + playback state. A new `MusicPanel` component handles auth, search, and now-playing UI, dropped into `App.jsx` above the Reset/Screenshot buttons.

**Tech Stack:** React 19, Zustand 5, Vite (env via `import.meta.env`), Vitest + Testing Library, Spotify Web Playback SDK (loaded via `<script>` at runtime), Spotify Web API v1

---

### Task 1: PKCE Auth Helpers

**Files:**
- Create: `src/spotify/auth.js`
- Create: `src/spotify/auth.test.js`

**Step 1: Create the auth module**

```js
// src/spotify/auth.js
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'

export function generateCodeVerifier() {
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  return Array.from(array).map(b => CHARS[b % CHARS.length]).join('')
}

export async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function buildAuthUrl(clientId, redirectUri) {
  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  sessionStorage.setItem('spotify_code_verifier', verifier)
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'streaming user-read-email user-read-private',
    code_challenge_method: 'S256',
    code_challenge: challenge,
  })
  return `https://accounts.spotify.com/authorize?${params}`
}

export async function exchangeCodeForToken(code, clientId, redirectUri) {
  const verifier = sessionStorage.getItem('spotify_code_verifier')
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: verifier,
    }),
  })
  if (!res.ok) throw new Error('Token exchange failed')
  const data = await res.json()
  sessionStorage.removeItem('spotify_code_verifier')
  return data
}

export async function refreshAccessToken(refreshToken, clientId) {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  })
  if (!res.ok) throw new Error('Token refresh failed')
  return res.json()
}
```

**Step 2: Write the tests**

```js
// src/spotify/auth.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateCodeVerifier, generateCodeChallenge, buildAuthUrl, exchangeCodeForToken } from './auth'

describe('generateCodeVerifier', () => {
  it('returns a 64-character string', () => {
    expect(generateCodeVerifier()).toHaveLength(64)
  })

  it('only contains URL-safe characters', () => {
    const verifier = generateCodeVerifier()
    expect(verifier).toMatch(/^[A-Za-z0-9\-._~]+$/)
  })

  it('produces different values each call', () => {
    expect(generateCodeVerifier()).not.toBe(generateCodeVerifier())
  })
})

describe('generateCodeChallenge', () => {
  it('returns a base64url string without padding', async () => {
    const challenge = await generateCodeChallenge('test-verifier')
    expect(challenge).not.toContain('+')
    expect(challenge).not.toContain('/')
    expect(challenge).not.toContain('=')
    expect(challenge.length).toBeGreaterThan(0)
  })

  it('is deterministic for the same input', async () => {
    const a = await generateCodeChallenge('same-input')
    const b = await generateCodeChallenge('same-input')
    expect(a).toBe(b)
  })
})

describe('buildAuthUrl', () => {
  it('returns a Spotify auth URL with the challenge', async () => {
    const url = await buildAuthUrl('client123', 'http://localhost:5173')
    expect(url).toContain('https://accounts.spotify.com/authorize')
    expect(url).toContain('client_id=client123')
    expect(url).toContain('code_challenge_method=S256')
    expect(url).toContain('scope=')
  })

  it('stores the code verifier in sessionStorage', async () => {
    await buildAuthUrl('client123', 'http://localhost:5173')
    expect(sessionStorage.getItem('spotify_code_verifier')).toBeTruthy()
  })
})

describe('exchangeCodeForToken', () => {
  beforeEach(() => {
    sessionStorage.setItem('spotify_code_verifier', 'test-verifier')
  })

  it('returns token data on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'abc', refresh_token: 'xyz', expires_in: 3600 }),
    })
    const data = await exchangeCodeForToken('code123', 'client123', 'http://localhost:5173')
    expect(data.access_token).toBe('abc')
    expect(data.refresh_token).toBe('xyz')
  })

  it('clears sessionStorage verifier after exchange', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'abc', refresh_token: 'xyz', expires_in: 3600 }),
    })
    await exchangeCodeForToken('code123', 'client123', 'http://localhost:5173')
    expect(sessionStorage.getItem('spotify_code_verifier')).toBeNull()
  })

  it('throws on non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false })
    await expect(exchangeCodeForToken('bad', 'client', 'http://localhost')).rejects.toThrow('Token exchange failed')
  })
})
```

**Step 3: Run tests**

```bash
npx vitest run src/spotify/auth.test.js
```

Expected: All tests pass.

**Step 4: Commit**

```bash
git add src/spotify/auth.js src/spotify/auth.test.js
git commit -m "feat: add Spotify PKCE auth helpers"
```

---

### Task 2: Spotify API Wrapper

**Files:**
- Create: `src/spotify/api.js`
- Create: `src/spotify/api.test.js`

**Step 1: Create the API module**

```js
// src/spotify/api.js
export async function searchTracks(token, query) {
  const params = new URLSearchParams({ q: query, type: 'track', limit: 5 })
  const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Search failed')
  const data = await res.json()
  return data.tracks.items.map(track => ({
    id: track.id,
    uri: track.uri,
    name: track.name,
    artist: track.artists[0]?.name ?? '',
    albumArt: track.album.images[2]?.url ?? track.album.images[0]?.url ?? '',
  }))
}
```

**Step 2: Write the tests**

```js
// src/spotify/api.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchTracks } from './api'

const MOCK_TRACK = {
  id: 'track1',
  uri: 'spotify:track:track1',
  name: 'Test Song',
  artists: [{ name: 'Test Artist' }],
  album: {
    images: [
      { url: 'http://large.jpg' },
      { url: 'http://medium.jpg' },
      { url: 'http://small.jpg' },
    ],
  },
}

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ tracks: { items: [MOCK_TRACK] } }),
  })
})

describe('searchTracks', () => {
  it('returns normalized track objects', async () => {
    const results = await searchTracks('token123', 'test query')
    expect(results).toHaveLength(1)
    expect(results[0]).toEqual({
      id: 'track1',
      uri: 'spotify:track:track1',
      name: 'Test Song',
      artist: 'Test Artist',
      albumArt: 'http://small.jpg',
    })
  })

  it('calls the Spotify search endpoint with correct params', async () => {
    await searchTracks('mytoken', 'hello world')
    const [url, opts] = global.fetch.mock.calls[0]
    expect(url).toContain('v1/search')
    expect(url).toContain('q=hello+world')
    expect(url).toContain('type=track')
    expect(url).toContain('limit=5')
    expect(opts.headers.Authorization).toBe('Bearer mytoken')
  })

  it('throws on non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false })
    await expect(searchTracks('token', 'query')).rejects.toThrow('Search failed')
  })

  it('falls back to first image if fewer than 3 images', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        tracks: {
          items: [{
            ...MOCK_TRACK,
            album: { images: [{ url: 'http://only.jpg' }] },
          }],
        },
      }),
    })
    const results = await searchTracks('token', 'query')
    expect(results[0].albumArt).toBe('http://only.jpg')
  })
})
```

**Step 3: Run tests**

```bash
npx vitest run src/spotify/api.test.js
```

Expected: All tests pass.

**Step 4: Commit**

```bash
git add src/spotify/api.js src/spotify/api.test.js
git commit -m "feat: add Spotify search API wrapper"
```

---

### Task 3: Spotify Zustand Store

**Files:**
- Create: `src/state/useSpotifyStore.js`
- Create: `src/state/useSpotifyStore.test.js`

**Step 1: Create the store**

```js
// src/state/useSpotifyStore.js
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
```

**Step 2: Write the tests**

```js
// src/state/useSpotifyStore.test.js
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
```

**Step 3: Run tests**

```bash
npx vitest run src/state/useSpotifyStore.test.js
```

Expected: All tests pass.

**Step 4: Commit**

```bash
git add src/state/useSpotifyStore.js src/state/useSpotifyStore.test.js
git commit -m "feat: add Spotify Zustand store"
```

---

### Task 4: Web Playback SDK Hook

**Files:**
- Create: `src/spotify/useSpotifyPlayer.js`

No unit tests for this hook — it's entirely a wrapper around the Spotify Web Playback SDK's global `window.Spotify.Player`, which can't be meaningfully mocked in jsdom. Manual testing in the browser covers this.

**Step 1: Create the hook**

```js
// src/spotify/useSpotifyPlayer.js
import { useEffect, useRef, useCallback } from 'react'
import { useSpotifyStore } from '../state/useSpotifyStore'

function loadSdkScript() {
  return new Promise((resolve) => {
    if (window.Spotify) { resolve(); return }
    const prev = window.onSpotifyWebPlaybackSDKReady
    window.onSpotifyWebPlaybackSDKReady = () => { prev?.(); resolve() }
    if (!document.querySelector('script[src*="spotify-player"]')) {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)
    }
  })
}

export function useSpotifyPlayer() {
  const { token, setCurrentTrack, setIsPlaying } = useSpotifyStore()
  const playerRef = useRef(null)
  const deviceIdRef = useRef(null)

  useEffect(() => {
    if (!token) return
    let player
    let active = true

    loadSdkScript().then(() => {
      if (!active) return
      player = new window.Spotify.Player({
        name: 'GT Studio',
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      })

      player.addListener('ready', ({ device_id }) => {
        deviceIdRef.current = device_id
      })

      player.addListener('player_state_changed', (state) => {
        if (!state) return
        const t = state.track_window.current_track
        setCurrentTrack({
          name: t.name,
          artist: t.artists[0]?.name ?? '',
          albumArt: t.album.images[2]?.url ?? t.album.images[0]?.url ?? '',
          uri: t.uri,
        })
        setIsPlaying(!state.paused)
      })

      player.connect()
      playerRef.current = player
    })

    return () => {
      active = false
      player?.disconnect()
    }
  }, [token])

  const play = useCallback(async (trackUri) => {
    if (!deviceIdRef.current || !token) return
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceIdRef.current}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [trackUri] }),
    })
  }, [token])

  const togglePlay = useCallback(() => {
    playerRef.current?.togglePlay()
  }, [])

  const setVolume = useCallback((pct) => {
    playerRef.current?.setVolume(pct / 100)
  }, [])

  return { play, togglePlay, setVolume }
}
```

**Step 2: Commit**

```bash
git add src/spotify/useSpotifyPlayer.js
git commit -m "feat: add Spotify Web Playback SDK hook"
```

---

### Task 5: MusicPanel Component

**Files:**
- Create: `src/components/MusicPanel.jsx`
- Create: `src/components/MusicPanel.test.jsx`

**Step 1: Create the component**

```jsx
// src/components/MusicPanel.jsx
import { useEffect, useState, useRef, useCallback } from 'react'
import { buildAuthUrl, exchangeCodeForToken, refreshAccessToken } from '../spotify/auth'
import { searchTracks } from '../spotify/api'
import { useSpotifyStore } from '../state/useSpotifyStore'
import { useSpotifyPlayer } from '../spotify/useSpotifyPlayer'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = window.location.origin

function storeTokens(access, refresh, expiresIn) {
  localStorage.setItem('spotify_access_token', access)
  localStorage.setItem('spotify_refresh_token', refresh)
  localStorage.setItem('spotify_token_expiry', String(Date.now() + expiresIn * 1000))
}

function loadStoredTokens() {
  return {
    access: localStorage.getItem('spotify_access_token'),
    refresh: localStorage.getItem('spotify_refresh_token'),
    expiry: Number(localStorage.getItem('spotify_token_expiry')),
  }
}

function clearStoredTokens() {
  localStorage.removeItem('spotify_access_token')
  localStorage.removeItem('spotify_refresh_token')
  localStorage.removeItem('spotify_token_expiry')
}

export default function MusicPanel() {
  const { token, isConnected, currentTrack, isPlaying, volume, setToken, setVolume: storeSetVolume, disconnect } = useSpotifyStore()
  const { play, togglePlay, setVolume: sdkSetVolume } = useSpotifyPlayer()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const debounceRef = useRef()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      window.history.replaceState({}, '', window.location.pathname)
      exchangeCodeForToken(code, CLIENT_ID, REDIRECT_URI)
        .then((data) => {
          storeTokens(data.access_token, data.refresh_token, data.expires_in)
          setToken(data.access_token, data.refresh_token)
        })
        .catch(console.error)
      return
    }

    const { access, refresh, expiry } = loadStoredTokens()
    if (!access) return
    if (Date.now() < expiry) {
      setToken(access, refresh)
    } else if (refresh) {
      refreshAccessToken(refresh, CLIENT_ID)
        .then((data) => {
          storeTokens(data.access_token, data.refresh_token ?? refresh, data.expires_in)
          setToken(data.access_token, data.refresh_token ?? refresh)
        })
        .catch(() => { clearStoredTokens(); disconnect() })
    }
  }, [])

  const handleConnect = async () => {
    const url = await buildAuthUrl(CLIENT_ID, REDIRECT_URI)
    window.location.href = url
  }

  const handleDisconnect = () => {
    clearStoredTokens()
    disconnect()
    setResults([])
    setQuery('')
  }

  const handleSearch = useCallback((q) => {
    setQuery(q)
    clearTimeout(debounceRef.current)
    if (!q.trim()) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const tracks = await searchTracks(token, q)
        setResults(tracks)
      } catch (e) {
        console.error(e)
      }
    }, 400)
  }, [token])

  const handleVolumeChange = (e) => {
    const v = Number(e.target.value)
    storeSetVolume(v)
    sdkSetVolume(v)
  }

  return (
    <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[9px] tracking-[0.22em] uppercase font-medium text-zinc-500 mb-3">Music</p>

      {!isConnected ? (
        <button
          onClick={handleConnect}
          className="w-full py-2 text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-500 hover:text-zinc-200 transition-colors duration-200 cursor-pointer rounded-lg hover:bg-white/5 active:scale-[0.98]"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Connect Spotify
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search a song..."
            className="w-full bg-white/5 rounded-lg px-3 py-2 text-[11px] text-zinc-300 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-white/20"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          />

          {results.length > 0 && !currentTrack && (
            <div className="flex flex-col gap-1">
              {results.map((track) => (
                <button
                  key={track.id}
                  onClick={() => { play(track.uri); setResults([]) }}
                  className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/5 active:scale-[0.98] transition-colors cursor-pointer"
                >
                  {track.albumArt && (
                    <img src={track.albumArt} alt="" className="w-7 h-7 rounded flex-shrink-0 object-cover" />
                  )}
                  <div className="min-w-0">
                    <p className="text-[11px] text-zinc-200 truncate">{track.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{track.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentTrack && (
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2">
                {currentTrack.albumArt && (
                  <img src={currentTrack.albumArt} alt="" className="w-9 h-9 rounded flex-shrink-0 object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-zinc-200 truncate">{currentTrack.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{currentTrack.artist}</p>
                </div>
                <button
                  onClick={togglePlay}
                  className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer rounded-full hover:bg-white/10"
                >
                  {isPlaying ? (
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                      <rect x="0" y="0" width="3" height="12" rx="1" />
                      <rect x="7" y="0" width="3" height="12" rx="1" />
                    </svg>
                  ) : (
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                      <path d="M0 0 L10 6 L0 12 Z" />
                    </svg>
                  )}
                </button>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1 accent-zinc-400 cursor-pointer"
              />
            </div>
          )}

          <button
            onClick={handleDisconnect}
            className="text-[9px] tracking-[0.15em] uppercase text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer text-right"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Write the tests**

```jsx
// src/components/MusicPanel.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import MusicPanel from './MusicPanel'
import { useSpotifyStore } from '../state/useSpotifyStore'

vi.mock('../spotify/useSpotifyPlayer', () => ({
  useSpotifyPlayer: () => ({ play: vi.fn(), togglePlay: vi.fn(), setVolume: vi.fn() }),
}))

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
```

**Step 3: Run tests**

```bash
npx vitest run src/components/MusicPanel.test.jsx
```

Expected: All 3 tests pass.

**Step 4: Commit**

```bash
git add src/components/MusicPanel.jsx src/components/MusicPanel.test.jsx
git commit -m "feat: add MusicPanel component with search and playback UI"
```

---

### Task 6: Wire MusicPanel into App

**Files:**
- Modify: `src/App.jsx`

**Step 1: Add the import and drop MusicPanel into the Panel**

In [src/App.jsx](src/App.jsx), add the import at the top alongside the other component imports:

```jsx
import MusicPanel from './components/MusicPanel'
```

Then add `<MusicPanel />` inside `<Panel>`, after the last `CarouselCard` map and before the Reset/Screenshot button div:

```jsx
<MusicPanel />

<div className="px-5 py-5 flex gap-3 mt-auto">
```

The full updated `App.jsx` return block becomes:

```jsx
return (
  <div className="w-full h-full flex">
    <div className="flex-1">
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
```

**Step 2: Run full test suite**

```bash
npx vitest run
```

Expected: All tests pass.

**Step 3: Smoke-test in browser**

```bash
npm run dev
```

1. Open `http://localhost:5173`
2. Scroll to bottom of the Panel — verify "MUSIC" label and "Connect Spotify" button appear
3. Click "Connect Spotify" — verify redirect to Spotify auth page
4. After auth, verify redirect back to app and search input appears
5. Type a song name — verify results appear within ~400ms
6. Click a result — verify the now-playing bar appears with album art, title, artist, play/pause, and volume slider
7. Toggle play/pause — verify it works
8. Drag volume slider — verify volume changes

**Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire MusicPanel into app Panel"
```
