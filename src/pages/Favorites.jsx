import { Link } from "react-router-dom";
import { useApp } from "../state/AppContext.jsx";

const posterUrl = (path, size = "w342") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/images/placeholder.png";

export default function Favorites() {
  const { favorites = [], removeFavorite } = useApp();

  if (!Array.isArray(favorites) || favorites.length === 0) {
    return (
      <section className="page">
        <h1>Favorites</h1>
        <p>No favorites yet. Use the Search page to add some.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Favorites</h1>
      <div className="grid">
        {favorites.map((m) => {
          const id = m.id ?? m.tmdb_id ?? m.movie_id;
          const title = m.title ?? m.name ?? "Untitled";
          const img = posterUrl(m.poster_path || m.poster);
          const tmdbHref = id ? `https://www.themoviedb.org/movie/${id}` : null;

          return (
            <div className="card" key={`${id}-${title}`}>
              {tmdbHref ? (
                <a href={tmdbHref} target="_blank" rel="noreferrer">
                  <img src={img} alt={title} loading="lazy" />
                </a>
              ) : (
                <img src={img} alt={title} loading="lazy" />
              )}
              <div className="card-body">
                <h3 className="card-title">{title}</h3>
                <div className="row">
                  {tmdbHref && (
                    <a className="btn" href={tmdbHref} target="_blank" rel="noreferrer">
                      View on TMDB
                    </a>
                  )}
                  <button className="btn danger" onClick={() => removeFavorite(id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
