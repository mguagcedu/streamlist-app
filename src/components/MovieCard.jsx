import React from 'react'

const MovieCard = React.memo(function MovieCard({ movie, onAdd }) {
  return (
    <article className="card" tabIndex={0} aria-label={`Movie ${movie.title}`}>
      {movie.poster ? (
        <img src={movie.poster} alt={`Poster of ${movie.title}`} style={{width:'100%', borderRadius:'10px'}} />
      ) : (
        <div className="card" style={{height: '280px', display:'grid', placeItems:'center'}} aria-label="No poster">
          <span className="kbd">No image</span>
        </div>
      )}
      <h3>{movie.title}</h3>
      <div className="meta">
        <span>{movie.year || '—'}</span> • <span>{movie.rating ? movie.rating.toFixed(1) : 'NR'}</span>
      </div>
      <div style={{marginTop:8}}>
        <button onClick={() => onAdd(movie)} aria-label={`Add ${movie.title} to favorites`}>Add to Favorites</button>
      </div>
    </article>
  )
})

export default MovieCard
