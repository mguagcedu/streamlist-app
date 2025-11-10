export const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

export async function getTrendingMovies(apiKey){
  if(!apiKey) return { results: [] };
  const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
  try{ const r = await fetch(url); if(!r.ok) return {results:[]}; return await r.json(); }catch{ return {results:[]} }
}


export async function searchMovies(apiKey, q) {
  if (!apiKey || !q) return { results: [] };
  const r = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(q)}`);
  if (!r.ok) return { results: [] };
  return await r.json();
}

export async function firstPosterForTitle(apiKey, title) {
  try {
    const data = await searchMovies(apiKey, title);
    const m = (data.results || [])[0];
    return m?.poster_path ? `${TMDB_IMG}${m.poster_path}` : "";
  } catch { return ""; }
}

/** Fetch full details for a movie (overview, runtime, genres, ratings) */
export async function getMovieDetails(apiKey, id){
  if(!apiKey || !id) return null;
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
  try{
    const r = await fetch(url);
    if(!r.ok) return null;
    return await r.json();
  }catch{ return null; }
}
