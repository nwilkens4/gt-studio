# Spotify Background Music Panel — Design

## Overview

Add a background music feature to the car customizer. Users search for a Spotify track and play it while customizing. The player lives inside the right-side Panel, below the customization controls.

**Approach:** Spotify Authorization Code with PKCE (pure frontend, no backend). Requires Spotify Premium for in-browser playback via the Web Playback SDK.

---

## Section 1 — Auth & Setup

### One-time developer setup
1. Register an app at developer.spotify.com
2. Add redirect URIs: `http://localhost:5173` (dev) and the Vercel URL (prod)
3. Copy the Client ID into `.env` as `VITE_SPOTIFY_CLIENT_ID`

### In-app auth flow
- A "Connect Spotify" button appears in the Panel
- Clicking redirects to Spotify's PKCE auth page with scopes: `streaming`, `user-read-email`, `user-read-private`
- After login, Spotify redirects back with `?code=` in the URL
- App exchanges code for access + refresh token, stores both in `localStorage`
- Token auto-refreshes silently when expired (~1 hour TTL)
- On page load, checks `localStorage` for a valid token and auto-connects if present

---

## Section 2 — Search & Playback UI

Lives at the bottom of the right Panel (above Reset/Screenshot buttons). Styled to match existing carousel cards — dark background, thin border, uppercase tracking labels.

### States
| State | UI |
|---|---|
| Disconnected | "Connect Spotify" button |
| Connected, idle | Search input with placeholder "Search a song..." |
| Searching | Up to 5 results: album art thumbnail, track name, artist |
| Playing | Album art, track name (scrolling if long), artist, Play/Pause button, volume slider |

### Interactions
- Search input debounces 400ms → hits `/v1/search?type=track`
- Clicking a result starts playback immediately via Web Playback SDK
- Play/Pause toggles SDK player state
- Volume slider (0–100) maps to SDK `setVolume()`

---

## Section 3 — State & Architecture

### New files
| File | Purpose |
|---|---|
| `src/spotify/auth.js` | PKCE helpers: generate verifier/challenge, build auth URL, exchange code, refresh token |
| `src/spotify/api.js` | Thin wrapper around Spotify Web API (`search` only) |
| `src/spotify/useSpotifyPlayer.js` | Hook: loads SDK script, initializes player, manages `deviceId`, exposes `play(trackUri)`, `togglePlay()`, `setVolume()` |
| `src/state/useSpotifyStore.js` | Zustand store: `token`, `isConnected`, `currentTrack`, `isPlaying`, `volume` |
| `src/components/MusicPanel.jsx` | UI section dropped into `App.jsx` inside `<Panel>` |

### Data flow
1. On app load → check `localStorage` for token → if valid, auto-connect
2. If URL has `?code=` → complete PKCE exchange → store token → strip code from URL
3. `useSpotifyPlayer` initializes SDK once token exists, registers device with Spotify
4. Search calls go through `api.js` with the stored token
5. Playback commands go through the SDK player instance held in the hook
