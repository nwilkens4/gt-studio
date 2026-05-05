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
