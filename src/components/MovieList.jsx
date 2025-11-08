import React from 'react'
import MovieCard from './MovieCard.jsx'

export default function MovieList({ items, onAdd }) {
  if (!items.length) {
    return <p className="kbd">No results. Try searching for a movie.</p>
  }
  return (
    <section className="grid" aria-label="Search results">
      {items.map(m => <MovieCard key={m.id} movie={m} onAdd={onAdd} />)}
    </section>
  )
}
