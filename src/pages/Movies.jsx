import React, { useEffect, useState } from "react";
import { useApp } from "../state/AppContext.jsx";

export default function Movies() {
  const { tmdbTrending, tmdbSearchMovies, poster, isFavorite, toggleFavorite } = useApp();
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = q.trim() ? await tmdbSearchMovies(q.trim()) : await tmdbTrending();
      setResults(data.results || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  const onSearch = async (e) => { e.preventDefault(); await load(); };

  return (
    <div>
      <h2>Movies</h2>
      <form onSubmit={onSearch} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search TMDB…" style={{ flex: 1, padding: 8 }} />
        <button type="submit">Search</button>
      </form>
      {loading ? <p>Loading…</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
          {results.map(m => (
            <div key={m.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
              {poster(m.poster_path) && <img src={poster(m.poster_path)} alt={m.title} style={{ width: "100%", height: 260, objectFit: "cover" }} />}
              <div style={{ padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <strong style={{ fontSize: 14, lineHeight: "18px" }}>{m.title}</strong>
                  <button title={isFavorite(m.id) ? "Unfavorite" : "Favorite"} onClick={() => toggleFavorite({ id: m.id, title: m.title, poster_path: m.poster_path })}>
                    {isFavorite(m.id) ? "★ Favorited" : "☆ Favorite"}
                  </button>
                </div>
                <a href={`https://www.themoviedb.org/movie/${m.id}`} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 8 }}>Open on TMDB</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
