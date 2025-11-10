let DEFAULT_API_KEY = import.meta.env.VITE_TMDB_API_KEY || import.meta.env.VITE_TMDB_KEY || '';
if(!DEFAULT_API_KEY){
  try{ DEFAULT_API_KEY = localStorage.getItem('tmdbKey') || '' }catch(_){ DEFAULT_API_KEY = '' }
}
const BASE = 'https://api.themoviedb.org/3'

export async function searchMovies(query, apiKey){
  if(!query || !query.trim()) return [];
  const key = (apiKey || DEFAULT_API_KEY || "").trim();
  if(!key) return mock(query);
  const url = `${BASE}/search/movie?api_key=${encodeURIComponent(key)}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('TMDB error');
  const data = await res.json();
  return (data.results||[]).map(m => ({
    id: m.id,
    title: m.title || m.name || 'Untitled',
    year: (m.release_date||'').slice(0,4),
    rating: m.vote_average,
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : null
  }));
}

function mock(q){
  const base = [
    { id:1, title:'Mock Movie Alpha', year:'2023', rating:7.4, poster:null },
    { id:2, title:'Mock Movie Beta', year:'2024', rating:8.2, poster:null },
    { id:3, title:'StreamList Origins', year:'2022', rating:6.9, poster:null }
  ]
  return base.filter(x => x.title.toLowerCase().includes(q.toLowerCase()))
}
