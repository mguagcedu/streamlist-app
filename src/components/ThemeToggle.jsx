import React from "react"; import {useApp} from "../context/AppContext.jsx"
export default function ThemeToggle(){ const {theme,setTheme}=useApp(); const next=theme==='dark'?'light':'dark'
  return (<button aria-label="Toggle color theme" onClick={()=>setTheme(next)}>{theme==='dark'?'Light':'Dark'} mode</button>)
}
