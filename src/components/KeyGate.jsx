import { useState } from "react";
import { useApp } from "../state/AppContext.jsx";

export default function KeyGate(){
  const { tmdbKey, setTmdbKey } = useApp();
  const [val,setVal] = useState("");

  if (tmdbKey) return null;

  return (
    <div style={{
      border:"1px dashed #bbb",
      padding:"12px",
      borderRadius:"10px",
      background:"var(--card)",
      margin:"12px 0"
    }}>
      <strong>TMDB key required</strong>
      <p className="muted" style={{margin:"6px 0 10px"}}>
        Enter your TMDB API key to enable search and trending movies.
      </p>
      <div style={{display:"flex", gap:"8px"}}>
        <input
          type="password"
          placeholder="TMDB API key"
          value={val}
          onChange={e=>setVal(e.target.value)}
          style={{flex:1, padding:"8px", borderRadius:"8px", border:"1px solid #ccc", background:"var(--bg)", color:"var(--fg)"}}
        />
        <button className="btn" onClick={()=>{ if(val.trim()){ setTmdbKey(val.trim()); } }}>
          Save
        </button>
      </div>
    </div>
  );
}
