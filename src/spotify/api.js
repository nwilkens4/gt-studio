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
