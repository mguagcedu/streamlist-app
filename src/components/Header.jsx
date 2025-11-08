import React from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function Header({ q, setQ }) {
  const { theme, setTheme, favorites } = useApp()
  function toggleTheme() { setTheme(theme === 'dark' ? 'light' : 'dark') }
  return (
    <header className="header" role="banner">
      <div className="brand" aria-label="StreamList home">
        <div className="brand-logo" aria-hidden="true">SL</div>
        <span>StreamList</span>
      </div>
      <div className="controls">
        <input
          className="input"
          aria-label="Search movies"
          placeholder="Search titles..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button onClick={toggleTheme} aria-label="Toggle theme">
          Theme: {theme}
        </button>
        <span className="badge" aria-label={`Favorites count ${favorites.length}`}>
          ♥ {favorites.length}
        </span>
      </div>
    </header>
  )
}
