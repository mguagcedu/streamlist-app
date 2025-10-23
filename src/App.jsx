import { NavLink, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import StreamList from './pages/StreamList.jsx'
import Movies from './pages/Movies.jsx'
import Cart from './pages/Cart.jsx'
import About from './pages/About.jsx'

// color selector options
const THEMES = [
  { value: 'theme-default', label: 'Default' },
  { value: 'theme-contrast', label: 'High Contrast' },
  { value: 'theme-wyandotte', label: 'Navy/Gold' },
  { value: 'theme-emerald', label: 'Emerald' },
  { value: 'theme-violet', label: 'Violet' }
]

export default function App() {
  // selected theme
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'theme-default')

  // apply theme class to <body>
  useEffect(() => {
    document.body.classList.remove(...THEMES.map(t => t.value))
    document.body.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div>
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand">
            <span className="logo">SL</span>
            <span>StreamList</span>
          </div>
          <div className="menu">
            {/* navigation routes */}
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
            <NavLink to="/movies" className={({ isActive }) => isActive ? 'active' : ''}>Movies</NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>Cart</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>

            {/* color selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
              <span className="material-icons" style={{ fontSize: 18 }} aria-hidden>palette</span>
              <label className="sr-only" htmlFor="theme-select">Theme</label>
              <select
                id="theme-select"
                className="input"
                style={{ width: 160, padding: '6px 8px' }}
                value={theme}
                onChange={e => setTheme(e.target.value)}
              >
                {THEMES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<StreamList />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}
