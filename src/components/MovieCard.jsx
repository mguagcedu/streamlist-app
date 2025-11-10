import React from 'react'
const MovieCard = React.memo(function MovieCard({movie,onFav}){
  return (
    <article className="card" tabIndex={0} aria-label={`Movie ${movie.title}`}>
      {movie.poster ? (
        <img src={movie.poster} alt={`Poster of ${movie.title}`} style={{width:'100%',borderRadius:'10px'}} />
      ) : null}
      <h3 style={{margin:'8px 0 6px'}}>{movie.title}</h3>
      <div className="meta">{movie.year || ''}{movie.year ? ' • ' : ''}{movie.rating? movie.rating.toFixed(1) : 'NR'}</div>
      <div style={{marginTop:8}}>
        <button onClick={()=>onFav(movie)} aria-label={`Add ${movie.title} to favorites`}>
          <span className="icon">favorite</span> Add to Favorites
        </button>
      </div>
    </article>
  )
})
export default MovieCard
