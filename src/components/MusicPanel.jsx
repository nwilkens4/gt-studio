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
