import React from 'react'
import MovieCard from './MovieCard.jsx'
export default function MovieResults({items,onFav}){
  if(!items.length) return <p className="kbd">No results. Try searching.</p>
  return <section className="grid" aria-label="Search results">
    {items.map(m => <MovieCard key={m.id} movie={m} onFav={onFav}/>)}
  </section>
}
