const TMDB_BASE = "https://api.themoviedb.org/3";
const READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN || "";

export async function tmdb(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${READ_TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`TMDB ${res.status}: ${msg}`);
  }
  return res.json();
}
