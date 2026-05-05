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
