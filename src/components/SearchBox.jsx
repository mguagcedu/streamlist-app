import { useEffect, useRef, useState } from "react";
import { useApp } from "../state/AppContext.jsx";
import { searchMovies } from "../services/tmdb.js";

export default function SearchBox({placeholder="Search movies or shows...", onPick}){
  const { tmdbKey, setTmdbKey } = useApp();
  const [q,setQ]=useState("");
  const [items,setItems]=useState([]);
  const box = useRef(null);

  useEffect(()=>{
    let ac = new AbortController();
    const run = async ()=>{
      if(!q.trim() || q.trim().length<2){ setItems([]); return; }
      try{
        // Use centralized search service; pass tmdbKey from context to override module default
        const results = await searchMovies(q, tmdbKey);
        // map to UI shape (service already normalizes most fields)
        const items = (results||[]).slice(0,8).map(x=>({
          id: x.id,
          title: x.title || x.name || "Untitled",
          overview: x.overview||"",
          poster: x.poster || (x.poster_path ? `https://image.tmdb.org/t/p/w342${x.poster_path}` : ""),
          kind: x.media_type || x.kind || "movie"
        }));
        if(!ac.signal.aborted) setItems(items);
      }catch(_){ if(!ac.signal.aborted) setItems([]); }
    };
    // debounce slightly to avoid too many calls
    const t = setTimeout(()=>run(), 200);
    return ()=>{ clearTimeout(t); ac.abort(); };
  },[q, tmdbKey]);

  const handlePick = (it)=>{
    onPick && onPick(it);
    setQ(it.title);
    setItems([]);
  };

  return (
    <div className="searchbox" ref={box}>
      <input
        value={q}
        onChange={e=>setQ(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {items.length>0 && (
        <ul className="suggestions">
          {items.map(it=>(
            <li key={it.id} onClick={()=>handlePick(it)}>
              {it.poster && <img alt="" src={it.poster}/>} 
              <span>{it.title}</span>
            </li>
          ))}
        </ul>
      )}
          <h4>TMDB Key Required</h4>
          <p>Paste your TMDB API key to enable search.</p>
          <input type="password" placeholder="TMDB API Key" onChange={e=>setTmdbKey(e.target.value)}/>
        </div>
      )}
    </div>
  );
}
