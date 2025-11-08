const API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''
const BASE = 'https://api.themoviedb.org/3'

export async function searchMovies(query) {
  if (!query || !query.trim()) return []
  // Fallback to mock if no key
  if (!API_KEY) {
    return mockSearch(query)
  }
  const url = `${BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
  const res = await fetch(url)
  if (!res.ok) throw new Error('TMDB error')
  const data = await res.json()
  return (data.results || []).map(mapMovie)
}

function mapMovie(m) {
  return {
    id: m.id,
    title: m.title,
    year: (m.release_date || '').slice(0,4),
    rating: m.vote_average,
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : null
  }
}

// Simple mock for offline or missing key
function mockSearch(q) {
  const base = [
    { id: 1, title: 'Mock Movie Alpha', year: '2023', rating: 7.4, poster: null },
    { id: 2, title: 'Mock Movie Beta', year: '2024', rating: 8.2, poster: null },
    { id: 3, title: 'StreamList Origins', year: '2022', rating: 6.9, poster: null },
  ]
  return base.filter(x => x.title.toLowerCase().includes(q.toLowerCase()))
}
