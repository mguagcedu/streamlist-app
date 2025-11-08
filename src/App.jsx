import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import Header from './components/Header.jsx'
import MovieList from './components/MovieList.jsx'
import Events from './components/Events.jsx'
import { searchMovies } from './services/tmdb.js'
import { loadState, saveState, logEvent } from './utils/localStorage.js'

function AppInner() {
  const { favorites, setFavorites } = useApp()
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Week 3: hydrate state from localStorage
  useEffect(() => {
    const s = loadState()
    if (s.favorites?.length) setFavorites(s.favorites)
  }, [setFavorites])

  // Week 4: stable callback used in effect deps
  const doSearch = useCallback(async (term) => {
    setError('')
    setLoading(true)
    try {
      const items = await searchMovies(term)
      setResults(items)
    } catch (e) {
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }, [])

  // Week 4: debounce search to reduce API spam
  const debouncedQ = useMemo(() => q.trim(), [q])
  useEffect(() => {
    if (!debouncedQ) { setResults([]); return }
    const id = setTimeout(() => { doSearch(debouncedQ) }, 400)
    return () => clearTimeout(id)
  }, [debouncedQ, doSearch])

  function addFavorite(movie) {
    if (favorites.find(f => f.id === movie.id)) return
    const next = [movie, ...favorites]
    setFavorites(next)
    saveState({ ...loadState(), favorites: next })
    logEvent('add_favorite', movie.title)
  }

  return (
    <div>
      <Header q={q} setQ={setQ} />
      <main className="container">
        <p className="meta">Type to search. Press <span className="kbd">Tab</span> to move through cards.</p>
        {loading && <p className="kbd">Loading…</p>}
        {error && <p className="kbd" role="alert">{error}</p>}
        <MovieList items={results} onAdd={addFavorite} />
        <div className="footer">
          <Events />
          <p>StreamList • Week 1–4 combined build</p>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>
}
