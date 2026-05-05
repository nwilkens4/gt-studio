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

  it('returns empty string for albumArt when no images', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        tracks: {
          items: [{ ...MOCK_TRACK, album: { images: [] } }],
        },
      }),
    })
    const results = await searchTracks('token', 'query')
    expect(results[0].albumArt).toBe('')
  })

  it('returns empty string for artist when artists array is empty', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        tracks: {
          items: [{ ...MOCK_TRACK, artists: [] }],
        },
      }),
    })
    const results = await searchTracks('token', 'query')
    expect(results[0].artist).toBe('')
  })
})
