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
      const storedVolume = useSpotifyStore.getState().volume
      player = new window.Spotify.Player({
        name: 'GT Studio',
        getOAuthToken: (cb) => cb(token),
        volume: storedVolume / 100,
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
