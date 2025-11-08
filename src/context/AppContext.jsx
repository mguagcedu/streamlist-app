import React, { createContext, useContext, useState } from 'react'

const AppCtx = createContext(null)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [favorites, setFavorites] = useState([])
  const value = { theme, setTheme, favorites, setFavorites }
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() { return useContext(AppCtx) }
