import React from "react";
import { useApp } from "../state/AppContext.jsx";

export default function Favorites() {
  const { favorites, poster, toggleFavorite } = useApp();
  return (
    <div>
      <h2>Favorites</h2>
      {favorites.length === 0 ? <p>No favorites yet.</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
          {favorites.map(m => (
            <a
              key={m.id}
              href={`https://www.themoviedb.org/movie/${m.id}`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
              title="Open on TMDB"
            >
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                {poster(m.poster_path) && <img src={poster(m.poster_path)} alt={m.title} style={{ width: "100%", height: 260, objectFit: "cover" }} />}
                <div style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: 14 }}>{m.title}</strong>
                  <button onClick={(e) => { e.preventDefault(); toggleFavorite(m); }} title="Remove favorite">✕</button>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
